import mongoose from 'mongoose';

const PayrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  month: String,
  year: Number,
  grossSalary: Number,
  deductions: Number,
  netSalary: Number,
  paid: { type: Boolean, default: false }
});

export default mongoose.model('Payroll', PayrollSchema);
