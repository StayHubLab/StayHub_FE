import React from "react";
import { Routes, Route } from "react-router-dom";
import LandlordPage from "../../pages/LandlordPage/LandlordPage";
import Dashboard from "../../pages/LandlordPage/Dashboard/Dashboard";
import ManageRoom from "../../pages/LandlordPage/ManageRoom/ManageRoom";
import ManageTenants from "../../pages/LandlordPage/ManageTenants/ManageTenants";
import Transaction from "../../pages/LandlordPage/Transaction/Transaction";
import Subscription from "../../pages/LandlordPage/Subscription/Subscription";
import Settings from "../../pages/LandlordPage/Settings/Settings";
import Support from "../../pages/LandlordPage/Support/Support";
import ContractsTab from "../../pages/LandlordPage/Contracts/ContractsTab";
import PaymentsByRoom from "../../pages/LandlordPage/PaymentsByRoom/PaymentsByRoom";
import Buildings from "../../pages/LandlordPage/Buildings/Buildings";

const LandlordRoute = () => {
  return (
    <Routes>
      <Route path="/landlord" element={<LandlordPage />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="manage-room" element={<ManageRoom />} />
        <Route path="manage-tenants" element={<ManageTenants />} />
        <Route path="transaction" element={<Transaction />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="payments-by-room" element={<PaymentsByRoom />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
        <Route path="contracts" element={<ContractsTab />} />
      </Route>
    </Routes>
  );
};

export default LandlordRoute;
export default LandlordRoute;
export default LandlordRoute;
export default LandlordRoute;
export default LandlordRoute;
export default LandlordRoute;