import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';
import mongoose from 'mongoose';
export const generatePayroll = async (req, res) => {
  const { employeeId } = req.params;
  const { month, year } = req.body;

  const emp = await Employee.findById(employeeId);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });

  const gross = emp.salary.basic + emp.salary.hra + emp.salary.other;
  const deductions = gross * 0.1; // example
  const net = gross - deductions;

  const payroll = new Payroll({
    employeeId,
    month,
    year,
    grossSalary: gross,
    deductions,
    netSalary: net,
    paid: true
  });

  await payroll.save();
  res.status(201).json(payroll);
};

export const getAllPayrolls = async (req, res) => {
  try {
    const employees = await Employee.find({});  
    // get all employees with payroll info inside
    res.json(employees);
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    res.status(500).json({ message: 'Server error fetching payrolls' });
  }
};

export const getPayrollForEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Optionally, check if employeeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'Invalid Employee ID format' });
    }

    const employee = await Employee.findById(employeeId);


    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      name:employee.name,
      salary: employee.salary || {},
      lastPaidDate: employee.lastPaidDate ? employee.lastPaidDate.toISOString() : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEmployeePayroll = async (req, res) => {
  const { id } = req.params;
  const { salary, lastPaidDate } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    
    employee.salary = salary;
    employee.lastPaidDate = lastPaidDate;

    await employee.save();

    res.status(200).json({ message: 'Payroll updated successfully', employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
