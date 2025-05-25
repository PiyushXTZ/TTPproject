import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is configured with a base URL
import { useParams, useNavigate } from 'react-router-dom';

export default function PayrollEdit() {
  const { id } = useParams(); // This 'id' should be the employee's _id
  const navigate = useNavigate();

  const [employeeName, setEmployeeName] = useState('');
  const [salary, setSalary] = useState({ basic: '', hra: '', other: '' });
  const [lastPaidDate, setLastPaidDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEmployeePayroll() {
      try {
        setLoading(true);
        setError('');

        // Assuming axios.defaults.baseURL is set globally (e.g., to 'http://localhost:5000/api')
        // So this will hit 'http://localhost:5000/api/payroll/employee/:id'
        const res = await axios.get(`/payroll/employee/${id}`);
        const empPayrollData = res.data; // The response should contain employee and payroll info

        setEmployeeName(empPayrollData.name || 'Employee'); // Employee's name
        setSalary({
          basic: empPayrollData.salary?.basic || '',
          hra: empPayrollData.salary?.hra || '',
          other: empPayrollData.salary?.other || ''
        });
        // Ensure date is in 'YYYY-MM-DD' format for input type="date"
        setLastPaidDate(empPayrollData.lastPaidDate ? new Date(empPayrollData.lastPaidDate).toISOString().split('T')[0] : '');
        
      } catch (err) {
        console.error("Error fetching employee payroll data:", err);
        if (axios.isAxiosError(err)) {
          setError(`Failed to load data: ${err.response?.data?.message || err.message}`);
        } else {
          setError('An unexpected error occurred while loading data.');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchEmployeePayroll();
  }, [id]); // Depend on 'id' to refetch if the ID in the URL changes

  function handleChange(e) {
    const { name, value } = e.target;
    // Basic validation to ensure numbers, or keep as string if input type='text' for non-numeric data
    setSalary(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); // Clear previous errors on submit

    try {
      // Assuming axios.defaults.baseURL is set globally
      // This will hit 'http://localhost:5000/api/payroll/employee/:id/payroll'
      await axios.put(`/payroll/employee/${id}/payroll`, {
        salary: {
          basic: Number(salary.basic), // Convert to Number before sending
          hra: Number(salary.hra),
          other: Number(salary.other),
        },
        lastPaidDate, // Send the date as is (YYYY-MM-DD)
      });

      // DaisyUI/Tailwind friendly alert or toast for success
      // You might use a state-driven notification system instead of alert()
      alert('Payroll updated successfully!');
      navigate('/dashboard'); // Navigate back to the dashboard after successful update
    } catch (err) {
      console.error("Error updating payroll:", err);
      if (axios.isAxiosError(err)) {
        setError(`Failed to update payroll: ${err.response?.data?.message || err.message}`);
      } else {
        setError('An unexpected error occurred during update.');
      }
      // Use an alert() for simplicity, but consider a toast/modal
      alert(`Failed to update payroll: ${err.response?.data?.message || 'Check console for details.'}`);
    }
  }

  // --- Render based on loading/error states ---
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span> {/* DaisyUI loading spinner */}
        <p className="ml-3 text-lg">Loading employee payroll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex justify-center items-center">
        <div role="alert" className="alert alert-error max-w-md"> {/* DaisyUI error alert */}
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  // --- Main form rendering ---
  return (
    // Apply data-theme="dark" here if this component is not already nested within a dark theme context
    // <div data-theme="dark" className="min-h-screen bg-base-200 text-base-content flex justify-center items-center px-4">
    <div className="min-h-screen bg-base-200 text-base-content flex justify-center items-center px-4">
      <div className="w-full max-w-md card shadow-2xl bg-neutral text-neutral-content p-6 rounded-2xl">
        <h1 className="text-3xl font-bold text-primary text-center mb-1">{employeeName}</h1>
        <h2 className="text-lg text-accent text-center mb-6 font-medium">Edit Payroll</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control"> {/* DaisyUI form-control for spacing */}
            <label className="label">
              <span className="label-text text-neutral-content">Basic Salary</span>
            </label>
            <input
              type="number"
              name="basic"
              value={salary.basic}
              onChange={handleChange}
              className="input input-bordered w-full bg-base-100 text-base-content" // input styles
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-neutral-content">HRA</span>
            </label>
            <input
              type="number"
              name="hra"
              value={salary.hra}
              onChange={handleChange}
              className="input input-bordered w-full bg-base-100 text-base-content"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-neutral-content">Other Allowance</span>
            </label>
            <input
              type="number"
              name="other"
              value={salary.other}
              onChange={handleChange}
              className="input input-bordered w-full bg-base-100 text-base-content"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-neutral-content">Last Paid Date</span>
            </label>
            <input
              type="date"
              value={lastPaidDate}
              onChange={(e) => setLastPaidDate(e.target.value)}
              className="input input-bordered w-full bg-base-100 text-base-content"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full mt-6" // DaisyUI primary button
          >
            Save Payroll
          </button>
        </form>
      </div>
    </div>
  );
}