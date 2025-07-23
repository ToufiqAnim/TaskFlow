import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PrivateRoutes from "./routes/PrivateRoutes";
import Dashboard from "./pages/admin/Dashboard";
import ManageTasks from "./pages/admin/ManageTasks";
import CreateTask from "./pages/admin/CreateTask";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDashboard from "./pages/user/UserDashboard";
import MyTask from "./pages/user/MyTask";
import TaskDetails from "./pages/user/TaskDetails";

const App = () => {
  return (
    <div className="text-7xl">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* PRIVATE ROUTES */}
          <Route element={<PrivateRoutes allowedRoles={["admin"]} />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/create-tasks" element={<CreateTask />} />
          <Route path="/admin/users" element={<ManageUsers />} />

          {/* USERS ROUTES */}
          <Route element={<PrivateRoutes allowedRoles={["user"]} />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tasks" element={<MyTask />} />
          <Route path="/user/task-deatils/:id" element={<TaskDetails />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
