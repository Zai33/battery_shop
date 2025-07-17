import {
  createSaleService,
  getAllSalesService,
} from "../services/saleService.js";
import Customer from "../models/customerMode.js";

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
      warrantyExpiry,
    } = req.body;

    // Basic validation
    if (
      !customer ||
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
      });

      if (existingCustomer) {
        customerId = existingCustomer._id;
      } else {
        // Create new customer
        const newCustomer = new Customer(customerInfo);
        const savedCustomer = await newCustomer.save();
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

    const saleData = {
      customer: customerId,
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
      warrantyExpiry,
    };

    const savedSale = await createSaleService(saleData, req.user._id);

    res.status(201).json({
      con: true,
      message: "Sale created successfully",
      result: savedSale,
    });
  } catch (error) {
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
