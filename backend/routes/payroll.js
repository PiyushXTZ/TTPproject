import express from 'express';
import {
  generatePayroll,
  getAllPayrolls,
  getPayrollForEmployee,
  updateEmployeePayroll
} from '../controllers/payrollController.js';

const router = express.Router();

router.post('/generate/:employeeId', generatePayroll);
router.get('/', getAllPayrolls);
router.get('/employee/:employeeId', getPayrollForEmployee);
router.put('/employee/:id/payroll', updateEmployeePayroll);
export default router;
