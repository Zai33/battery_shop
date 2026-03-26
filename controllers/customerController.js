import {
  createCustomerService,
  deleteCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
} from "../services/customerService.js";

//get all customers
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await getAllCustomersService();
    res.status(200).json({
      con: true,
      message: "Customers fetched successfully",
      result: customers,
    });
  } catch (error) {
    return next(error);
  }
};

//create a new customer
export const getCustomerById = async (req, res, next) => {
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
      result: customer,
    });
  } catch (error) {
    return next(error);
  }
};

//create a new customer
export const createCustomer = async (req, res, next) => {
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
      result: newCustomer,
    });
  } catch (error) {
    return next(error);
  }
};

// delete a customer
export const deleteCustomer = async (req, res, next) => {
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
    return next(error);
  }
};
