import ChatPage from "pages/Chat/ChatPage";
import { Route, Routes } from "react-router-dom";
import Buildings from "../../pages/LandlordPage/Buildings/Buildings";
import ContractsTab from "../../pages/LandlordPage/Contracts/ContractsTab";
import Dashboard from "../../pages/LandlordPage/Dashboard/Dashboard";
import LandlordPage from "../../pages/LandlordPage/LandlordPage";
import ManageRoom from "../../pages/LandlordPage/ManageRoom/ManageRoom";
import ManageTenants from "../../pages/LandlordPage/ManageTenants/ManageTenants";
import PaymentsByRoom from "../../pages/LandlordPage/PaymentsByRoom/PaymentsByRoom";
import PaymentApprovalDashboard from "../../pages/LandlordPage/PaymentApproval/PaymentApprovalDashboard";
import Settings from "../../pages/LandlordPage/Settings/Settings";
import Subscription from "../../pages/LandlordPage/Subscription/Subscription";
import Support from "../../pages/LandlordPage/Support/Support";
import Transaction from "../../pages/LandlordPage/Transaction/Transaction";
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
        <Route path="payment-approvals" element={<PaymentApprovalDashboard />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
        <Route path="contracts" element={<ContractsTab />} />
        <Route path="chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
};

export default LandlordRoute;
