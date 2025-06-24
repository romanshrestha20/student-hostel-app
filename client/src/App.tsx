import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import AuthPage from "./pages/AuthPage";
import CreateHostelForm from "./features/hostels/CreateHostelForm";
import HostelList from "./features/hostels/HostelList";
import HostelDetail from "./features/hostels/HostelDetail";
import RoomList from "./features/rooms/RoomList";
import RoomDetail from "./features/rooms/RoomDetail";
import FavoriteList from "./features/favorites/FavoriteList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* Protected routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner", "student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-hostel"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <CreateHostelForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hostels"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner", "student"]}>
              <HostelList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hostels/:hostelId"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner", "student"]}>
              <HostelDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <FavoriteList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hostels/:hostelId/rooms"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner", "student"]}>
              <RoomList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:roomId"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner", "student"]}>
              <RoomDetail />
            </ProtectedRoute>
          }
        />

        <Route path="/auth" element={<AuthPage />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
