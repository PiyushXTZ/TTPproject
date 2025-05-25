import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="mb-6">Page Not Found</p>
      <Link
        to="/"
        className="text-blue-600 hover:underline"
      >
        Go to Login
      </Link>
    </div>
  );
}
