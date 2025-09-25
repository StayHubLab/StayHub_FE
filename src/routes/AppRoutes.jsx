import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/CommonPage/Landing/LandingPage";
import ProtectedRedirect from "../components/ProtectedRedirect/ProtectedRedirect";
import Main from "../pages/CommonPage/Main/Main";
import Home from "../pages/CommonPage/Main/Home/Home";
import Review from "../pages/CommonPage/Main/Review/Review";
import Find from "../pages/CommonPage/Main/FindRoom/FindRoom";
import RoomDetail from "../pages/CommonPage/Main/RoomDetail/Detail";
import Saved from "../pages/CommonPage/Main/Saved/SavedRoom";
import Profile from "../pages/CommonPage/Profile/Profile";
import Start from "../pages/AuthPage/Start/Start";
import Register from "../pages/AuthPage/Register/Register";
import Login from "../pages/AuthPage/Login/Login";
import Forgot from "../pages/AuthPage/Forgot/Forgot";
import Verify from "../pages/AuthPage/Verify/Verify";
import LandlordPage from "../pages/LandlordPage/LandlordPage";
import Dashboard from "../pages/LandlordPage/Dashboard/Dashboard";
import ManageRoom from "../pages/LandlordPage/ManageRoom/ManageRoom";
import ManageTenants from "../pages/LandlordPage/ManageTenants/ManageTenants";
import Transaction from "../pages/LandlordPage/Transaction/Transaction";
import Subscription from "../pages/LandlordPage/Subscription/Subscription";
import Settings from "../pages/LandlordPage/Settings/Settings";
import Support from "../pages/LandlordPage/Support/Support";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Common Routes */}
      <Route path="/" element={<ProtectedRedirect />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/main" element={<Main />}>
        <Route path="home" element={<Home />} />
        <Route path="room-detail/:id" element={<RoomDetail />} />
        <Route path="find" element={<Find />} />
        <Route path="saved" element={<Saved />} />
        <Route path="review" element={<Review />} />
        <Route index element={<Home />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/start" element={<Start />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/verify" element={<Verify />} />

      {/* Landlord Routes */}
      <Route path="/landlord" element={<LandlordPage />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="manage-room" element={<ManageRoom />} />
        <Route path="manage-tenants" element={<ManageTenants />} />
        <Route path="transaction" element={<Transaction />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
