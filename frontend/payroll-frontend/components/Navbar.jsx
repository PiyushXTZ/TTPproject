import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Payroll Management</h1>
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
      >
        Logout
      </button>
    </nav>
  );
}
