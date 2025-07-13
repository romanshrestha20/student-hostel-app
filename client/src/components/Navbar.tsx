import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  // Memoize nav links based on user role
  const navLinks = React.useMemo(() => {
    if (!user) {
      return [{ to: "/", label: "Login" }];
    }

    const commonLinks = [{ to: "/profile", label: "Profile" }];

    if (user.role === "admin" || user.role === "owner") {
      return [
        ...commonLinks,
        { to: "/create-hostel", label: "Create Hostel" },
        { to: "/manage-bookings", label: "Manage Bookings" },
      ];
    }

    if (user.role === "student") {
      return [
        ...commonLinks,
        { to: "/favorites", label: "Favorites" },
        { to: "/bookings/user", label: "My Bookings" },
      ];
    }

    return commonLinks;
  }, [user]);

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-bold text-blue-600"
      : "font-medium text-gray-700 hover:text-blue-600";

  return (
    <nav className="flex items-center justify-between px-6 py-4 mx-auto bg-white shadow-md max-w-10xl">
      <NavLink to="/dashboard" className="text-2xl font-bold text-blue-600">
        HostelApp
      </NavLink>

      <div className="flex items-center space-x-6">
        {navLinks.map(({ to, label }) => (
          <NavLink key={to} to={to} className={linkClassName}>
            {label}
          </NavLink>
        ))}

        {user && (
          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            className="ml-4 bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
