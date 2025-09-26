import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../../pages/CommonPage/Landing/LandingPage";
import ProtectedRedirect from "../../components/ProtectedRedirect/ProtectedRedirect";
import Main from "pages/CommonPage/Main/Main";
import Home from "../../pages/CommonPage/Main/Home/Home";
import Review from "../../pages/CommonPage/Main/Review/Review";
import Find from "../../pages/CommonPage/Main/FindRoom/FindRoom";
import RoomDetail from "pages/CommonPage/Main/RoomDetail/Detail";
import Saved from "../../pages/CommonPage/Main/Saved/SavedRoom";
import Profile from "../../pages/CommonPage/Profile/Profile";
import Bills from "../../pages/CommonPage/Main/Bill/Bills";
import PaymentResult from "../../pages/CommonPage/Main/PaymentResult/PaymentResult";
// import Contract from '../../pages/CommonPage/Main/Contract/Contract';
// import History from '../../pages/CommonPage/Main/History/History';
// import Support from '../../pages/CommonPage/Main/Support/Support';
// import Settings from '../../pages/CommonPage/Main/Settings/Settings';

const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRedirect />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/main" element={<Main />}>
        <Route path="home" element={<Home />} />
        <Route path="room-detail/:id" element={<RoomDetail />} />
        <Route path="find" element={<Find />} />
        <Route path="saved" element={<Saved />} />
        <Route path="bills" element={<Bills />} />
        <Route path="payment-result" element={<PaymentResult />} />
        {/* <Route path="contract" element={<Contract />} /> */}
        {/* <Route path="history" element={<History />} /> */}
        {/* <Route path="support" element={<Support />} /> */}
        {/* <Route path="settings" element={<Settings />} /> */}
        <Route path="review" element={<Review />} />
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default CommonRoutes;
