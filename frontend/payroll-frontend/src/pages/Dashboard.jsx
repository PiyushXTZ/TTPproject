import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import EmployeeCard from '../../components/EmployeeCard';

axios.defaults.baseURL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    joiningDate: '',
    basicSalary: '',
    hra: '',
    otherAllowance: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError('');
      const [empRes, payrollRes] = await Promise.all([
        axios.get('/employees'),
        axios.get('/payroll'),
      ]);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
      setPayrolls(Array.isArray(payrollRes.data) ? payrollRes.data : []);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.email) {
      setFormError('Name and Email are required');
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      department: form.department,
      role: form.role,
      joiningDate: form.joiningDate || null,
      salary: {
        basic: Number(form.basicSalary) || 0,
        hra: Number(form.hra) || 0,
        other: Number(form.otherAllowance) || 0,
      }
    };

    try {
      setFormLoading(true);
      const res = await axios.post('/employees', payload);
      setEmployees(prev => [...prev, res.data]);
      setForm({
        name: '', email: '', department: '', role: '',
        joiningDate: '', basicSalary: '', hra: '', otherAllowance: '',
      });
    } catch (err) {
      setFormError('Failed to add employee. Please try again.');
    } finally {
      setFormLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen text-xl animate-pulse text-neutral-content backdrop-blur-sm">Loading employee data...</div>;
  if (error) return <div className="alert alert-error shadow-lg m-6"><span>{error}</span></div>;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-primary-content">Employee Payroll Dashboard</h1>

        <section className="card bg-gray-800 backdrop-blur-md shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-accent-content mb-4">Add New Employee</h2>
          {formError && <div className="alert alert-error shadow-sm mb-4"><span>{formError}</span></div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input type="text" name="name" placeholder="Name *" value={form.name} onChange={handleInputChange} className="input input-bordered w-full" required />
            <input type="email" name="email" placeholder="Email *" value={form.email} onChange={handleInputChange} className="input input-bordered w-full" required />
            <input type="text" name="department" placeholder="Department" value={form.department} onChange={handleInputChange} className="input input-bordered w-full" />
            <input type="text" name="role" placeholder="Role" value={form.role} onChange={handleInputChange} className="input input-bordered w-full" />
            <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleInputChange} className="input input-bordered w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input type="number" name="basicSalary" placeholder="Basic Salary" value={form.basicSalary} onChange={handleInputChange} className="input input-bordered w-full" />
              <input type="number" name="hra" placeholder="HRA" value={form.hra} onChange={handleInputChange} className="input input-bordered w-full" />
              <input type="number" name="otherAllowance" placeholder="Other Allowance" value={form.otherAllowance} onChange={handleInputChange} className="input input-bordered w-full" />
            </div>
            <button type="submit" disabled={formLoading} className={`btn btn-primary w-full ${formLoading ? 'loading' : ''}`}>
              {formLoading ? 'Adding...' : 'Add Employee'}
            </button>
          </form>
        </section>

        <section className="card bg-gray-800 backdrop-blur-md shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-accent-content mb-4">Employees Overview</h2>
          {employees.length === 0 ? (
            <p className="text-gray-400">No employees found. Add new employees to get started!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map(emp => (
                <EmployeeCard key={emp._id} employee={emp} payrolls={payrolls} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
