// Array de métodos (C R U D)
const customersController = {};
import customersModel from "../models/customers.js";

// SELECT
customersController.getCustomers = async (req, res) => {
  const customers = await customersModel.find();
  res.json(customers);
};

// INSERT
customersController.createCustomers = async (req, res) => {
  const { name, email, password, telephone, adress, dui } = req.body; // Cambiado a 'adress' según el modelo
  const newCustomer = new customersModel({ name, email, password, telephone, adress, dui: dui || null });
  await newCustomer.save();
  res.json({ message: "Customer saved" });
};

// DELETE
customersController.deleteCustomers = async (req, res) => {
  const deletedCustomer = await customersModel.findByIdAndDelete(req.params.id);
  if (!deletedCustomer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json({ message: "Customer deleted" });
};

// UPDATE
customersController.updateCustomers = async (req, res) => {
  // Solicito todos los valores
  const { name, email, password, telephone, adress, dui } = req.body; // Cambiado a 'adress' según el modelo
  // Actualizo
  const updatedCustomer = await customersModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      password,
      telephone,
      adress,
      dui: dui || null,
    },
    { new: true }
  );

  if (!updatedCustomer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  // Muestro un mensaje que todo se actualizó
  res.json({ message: "Customer updated" });
};

export default customersController;
