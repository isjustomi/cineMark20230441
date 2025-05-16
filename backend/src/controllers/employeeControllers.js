//Array de metodos (C R U D)
const employeeController = {};
import employeeModel from "../models/employee.js";

// SELECT
employeeController.getemployee = async (req, res) => {
  const employee = await employeeModel.find();
  res.json(employee);
};

// INSERT
employeeController.createemployee = async (req, res) => {
  const { name, lastName, birthday, email, password, telephone, dui, issNumber, hireDate } = req.body;
  const newemployee= new employeeModel({ name, email, password, telephone, address, telephone, workRange, hireDate, salary, dui });
  await newemployee.save();
  res.json({ message: "employee save" });
};

// DELETE
employeeController.deleteemployee = async (req, res) => {
const deletedemployee = await employeeModel.findByIdAndDelete(req.params.id);
  if (!deletedemployee) {
    return res.status(404).json({ message: "employee dont find" });
  }
  res.json({ message: "employee deleted" });
};

// UPDATE
employeeController.updateemployee = async (req, res) => {
  // Solicito todos los valores
  const { name, email, password, telephone, address, workRange, hireDate, salary, dui  } = req.body;
  // Actualizo
  await employeeModel.findByIdAndUpdate(
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
  // muestro un mensaje que todo se actualizo
  res.json({ message: "employee update" });
};

export default employeeController;
