import {
  createCustomerService,
  deleteCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
} from "../services/customerService.js";

//get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomersService();
    res.status(200).json({
      con: true,
      message: "Customers fetched successfully",
      customers: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      con: false,
      message: "Error fetching customers",
      error: error.message,
    });
  }
};

//create a new customer
export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await getCustomerByIdService(id);
    if (!customer) {
      return res
        .status(404)
        .json({ con: false, message: "Customer not found" });
    }
    res.status(200).json({
      con: true,
      message: "Customer fetched successfully",
      customer: customer,
    });
  } catch (error) {
    console.log("Error fetching customer:", error);
    res.status(500).json({
      con: false,
      message: "Error fetching customer",
      error: error.message,
    });
  }
};

//create a new customer
export const createCustomer = async (req, res) => {
  const { name, phone, carNumber } = req.body;
  try {
    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({
        con: false,
        message: "Name and phone are required",
      });
    }

    // Check if customer already exists
    const customerData = { name, phone, carNumber };
    const newCustomer = await createCustomerService(customerData);

    res.status(201).json({
      con: true,
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({
      con: false,
      message: "Error creating customer",
      error: error.message,
    });
  }
};

// delete a customer
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await getCustomerByIdService(id);
    if (!customer) {
      return res.status(404).json({
        con: false,
        message: "Customer not found",
      });
    }
    await deleteCustomerService(id);
    res.status(200).json({
      con: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({
      con: false,
      message: "Error deleting customer",
      error: error.message,
    });
  }
};
