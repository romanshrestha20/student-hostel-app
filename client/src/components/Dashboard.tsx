import { useAuth } from "../context/useAuth";
import HostelList from "../features/hostels/HostelList";
import CreateHostelForm from "../features/hostels/CreateHostelForm";
import SearchHostels from "../features/hostels/SearchHostels";

import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
          <p>Your role: {user.role}</p>
          <p>Your email: {user.email}</p>
          <Link to="/favorites" className="text-blue-600 hover:underline">
            My Favorites
          </Link>

          <SearchHostels />
          <CreateHostelForm />
          <HostelList />
        </div>
      ) : (
        <p>
          Please <a href="/login">log in</a>
        </p>
      )}
    </div>
  );
};

export default Dashboard;
