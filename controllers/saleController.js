import {
  createSaleService,
  getAllSalesService,
} from "../services/saleService.js";
import Customer from "../models/customerMode.js";
import Product from "../models/productModel.js";
import Buyback from "../models/buyBackModel.js";
import mongoose from "mongoose";

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await getAllSalesService();

    res.status(200).json({
      con: true,
      message: "Sales retrieved successfully",
      count: sales.length,
      result: sales,
    });
  } catch (error) {
    console.error("Error retrieving sales:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create a new sale
export const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      customer,
      customerInfo,
      product,
      batteryCategory,
      quantity,
      salePrice,
      oldBatteryPrice,
      totalPrice,
      rebuyOldBattery,
      paymentMethod,
      paidAmount,
      changeGiven,
      isPaid,
      buybackData,
    } = req.body;

    // Basic validation
    if (
      (!customer && !customerInfo) ||
      !product ||
      !batteryCategory ||
      !quantity ||
      !salePrice ||
      !totalPrice ||
      !paymentMethod ||
      !paidAmount
    ) {
      return res.status(400).json({
        con: false,
        message: "Please fill all required fields",
      });
    }

    let customerId = customer;

    // If customer ID is not provided but customer info is, create or find customer
    if (!customerId && customerInfo) {
      // Try to find customer by phone number
      let existingCustomer = await Customer.findOne({
        phone: customerInfo.phone,
      }).session(session);

      if (existingCustomer) {
        customerId = existingCustomer._id;
      } else {
        // Create new customer
        const newCustomer = new Customer(customerInfo);
        const savedCustomer = await newCustomer.save({ session });
        customerId = savedCustomer._id;
      }
    }

    // If still no customerId, return error
    if (!customerId) {
      return res.status(400).json({
        con: false,
        message: "Customer ID or customer info is required",
      });
    }

    // Check product stock
    const productDoc = await Product.findById(product).session(session);
    if (!productDoc || productDoc.quantity < quantity) {
      return res.status(400).json({
        con: false,
        message: "Insufficient stock for this product",
      });
    }

    // Step 3: Handle Buybacks (if any)
    const buybackIds = [];

    if (rebuyOldBattery && Array.isArray(buybackData)) {
      for (const item of buybackData) {
        const {
          batteryType,
          condition,
          quantity: bbQuantity,
          buyPrice,
          inspectionNote,
          reused,
        } = item;

        if (
          !batteryType ||
          !condition ||
          !bbQuantity ||
          !buyPrice ||
          reused === undefined
        ) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            con: false,
            message: "Invalid buyback data provided",
          });
        }

        const newBuyback = new Buyback({
          customer: customerId,
          batteries: [
            {
              batterySize: batteryType,
              condition,
              quantity: bbQuantity,
              buyPrice,
              inspectionNote,
              reused,
            },
          ],
          createdBy: req.user._id,
        });

        const savedBuyback = await newBuyback.save({ session });
        buybackIds.push(savedBuyback._id);
      }
    }

    // Calculate warranty
    let warrantyExpiry = null;
    if (batteryCategory === "new") {
      warrantyExpiry = new Date();
      warrantyExpiry.setMonth(warrantyExpiry.getMonth() + 6);
    } else if (batteryCategory === "second") {
      warrantyExpiry = new Date();
      warrantyExpiry.setMonth(warrantyExpiry.getMonth() + 3);
    }

    const saleData = {
      customer: customerId,
      product,
      batteryCategory,
      quantity,
      salePrice,
      oldBatteryPrice,
      totalPrice,
      rebuyOldBattery,
      buyback: buybackIds,
      paymentMethod,
      paidAmount,
      changeGiven,
      isPaid,
      warrantyExpiry,
    };

    const savedSale = await createSaleService(saleData, req.user._id, session);

    // Update product quantity
    await Product.findByIdAndUpdate(
      product,
      { $inc: { quantity: -quantity } },
      { session }
    );

    //Link sale to buybacks
    if (buybackIds.length > 0) {
      await Buyback.updateMany(
        { _id: { $in: buybackIds } },
        { $set: { sale: savedSale._id } },
        { session }
      );
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      con: true,
      message: "Sale created successfully",
      result: savedSale,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.name === "ValidationError") {
      return res.status(400).json({
        con: false,
        message: "Validation error",
        error: error.message,
      });
    }
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};  
