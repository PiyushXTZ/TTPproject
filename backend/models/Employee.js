import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  role: String,
  joiningDate: Date,
  salary: {
    basic: Number,
    hra: Number,
    other: Number
  },
  lastPaidDate: Date // <-- ADD THIS LINE
});

export default mongoose.model('Employee', EmployeeSchema);
