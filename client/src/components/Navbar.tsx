import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 mx-auto bg-white shadow-md max-w-10xl">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        HostelApp
      </Link>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="font-medium text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>

            {(user.role === "admin" || user.role === "owner") && (
              <>
                <Link
                  to="/create-hostel"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Create Hostel
                </Link>
                <Link
                  to="/manage-bookings"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Manage Bookings
                </Link>
              </>
            )}

            {user.role === "student" && (
              <>
                <Link
                  to="/favorites"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Favorites
                </Link>
                <Link
                  to="/bookings/user"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  My Bookings
                </Link>
              </>
            )}

            <button
              onClick={logout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="font-medium text-gray-700 hover:text-blue-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
