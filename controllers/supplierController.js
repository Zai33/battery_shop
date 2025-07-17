import Supplier from "../models/supplierModel.js";

export const getAllSupplier = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    if (!suppliers) {
      return res.status(404).json({
        con: false,
        message: "There is no supplier",
      });
    }

    res.status(200).json({
      con: true,
      message: "Supplier fetch successfully",
      result: suppliers,
    });
  } catch (error) {
    console.log("Error in getAllSupplier:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const { companyName, contact, address, phone } = req.body;
    if (!companyName || !contact || !address || !phone) {
      return res.status(400).json({
        con: false,
        message: "All fields are required",
      });
    }
    const newSupplier = new Supplier({
      companyName,
      contact,
      address,
      phone,
    });
    const savedSupplier = await newSupplier.save();
    res.status(201).json({
      con: true,
      message: "Supplier created successfully",
      result: savedSupplier,
    });
  } catch (error) {
    console.log("Error in creatSupplier:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, contact, address, phone } = req.body;

    if (!companyName || !contact || !address || !phone) {
      return res.status(400).json({
        con: false,
        message: "All fields are required",
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { companyName, contact, address, phone },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        con: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      con: true,
      message: "Supplier updated successfully",
      result: updatedSupplier,
    });
  } catch (error) {
    console.log("Error in updateSupplier:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({
        con: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      con: true,
      message: "Supplier deleted successfully",
      result: deletedSupplier,
    });
  } catch (error) {
    console.log("Error in deleteSupplier:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({
        con: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      con: true,
      message: "Supplier fetched successfully",
      result: supplier,
    });
  } catch (error) {
    console.log("Error in getSupplierById:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
