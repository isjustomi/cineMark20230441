//Array de metodos (C R U D)
const employeeController = {};
import employeeModel from "../models/employee.js";

// SELECT
employeeController.getemployee = async (req, res) => {
  const employees = await employeeModel.find();
  res.json(employees);
};

// INSERT
employeeController.createemployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      telephone,
      address,
      workRange,
      hireDate,
      salary,
      dui
    } = req.body;

    const newEmployee = new employeeModel({
      name,
      email,
      password,
      telephone,
      address,
      workRange,
      hireDate,
      salary,
      dui
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee saved successfully", employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error saving employee", error: error.message });
  }
};

// DELETE
employeeController.deleteemployee = async (req, res) => {
  try {
    const deletedEmployee = await employeeModel.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
};

// UPDATE
employeeController.updateemployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      telephone,
      address,
      workRange,
      hireDate,
      salary,
      dui
    } = req.body;

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password,
        telephone,
        address,
        workRange,
        hireDate,
        salary,
        dui
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error: error.message });
  }
};

export default employeeController;
