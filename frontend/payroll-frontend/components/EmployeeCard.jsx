import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000/api';

function EmployeeCard({ employee }) {
  const totalSalary = employee.salary
    ? (employee.salary.basic || 0) + (employee.salary.hra || 0) + (employee.salary.other || 0)
    : 0;

  const lastPaid = employee.lastPaidDate
    ? new Date(employee.lastPaidDate).toLocaleDateString()
    : 'N/A';

  return (
    <div className="card bg-white/30 backdrop-blur-md shadow-xl p-4 hover:shadow-2xl transition border border-base-200">
      <h3 className="font-bold text-xl text-primary mb-2">{employee.name}</h3>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Role:</strong> {employee.role || 'N/A'}</p>
      <p><strong>Department:</strong> {employee.department || 'N/A'}</p>
      <p><strong>Salary:</strong> {totalSalary > 0 ? `$${totalSalary.toFixed(2)}` : 'Not available'}</p>
      <p><strong>Last Paid:</strong> {lastPaid}</p>

      <Link
        to={`/payroll/edit/${employee._id}`}
        className="inline-block mt-3 text-primary hover:underline"
      >
        Edit Payroll
      </Link>
    </div>
  );
}

export default EmployeeCard;