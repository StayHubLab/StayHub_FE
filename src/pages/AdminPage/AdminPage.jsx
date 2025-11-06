/**
 * @fileoverview Admin Page Main Component
 * @created 2025-11-06
 * @file AdminPage.jsx
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import "./AdminPage.css";

const AdminPage = () => {
  return (
    <div className="admin-page">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more admin routes here in the future */}
      </Routes>
    </div>
  );
};

export default AdminPage;
