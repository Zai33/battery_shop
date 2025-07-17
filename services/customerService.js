import Customer from "../models/customerMode.js";

export const getAllCustomersService = async () => {
  return await Customer.find();
};

export const getCustomerByIdService = async (id) => {
  return await Customer.findById(id);
};

export const createCustomerService = async (customerData) => {
  const newCustomer = new Customer(customerData);
  return await newCustomer.save();
};

export const deleteCustomerService = async (id) => {
  return await Customer.findByIdAndDelete(id);
};
