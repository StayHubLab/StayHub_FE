import ChatPage from "pages/CommonPage/Main/Chat/ChatPage";
import Main from "pages/CommonPage/Main/Main";
import RoomDetail from "pages/CommonPage/Main/RoomDetail/Detail";
import { Route, Routes } from "react-router-dom";
import LandingPage from "../../pages/CommonPage/Landing/LandingPage";
import Find from "../../pages/CommonPage/Main/FindRoom/FindRoom";
import Home from "../../pages/CommonPage/Main/Home/Home";
import Review from "../../pages/CommonPage/Main/Review/Review";
import Saved from "../../pages/CommonPage/Main/Saved/SavedRoom";
// import Contract from '../../pages/CommonPage/Main/Contract/Contract';
// import History from '../../pages/CommonPage/Main/History/History';
// import Support from '../../pages/CommonPage/Main/Support/Support';
// import Settings from '../../pages/CommonPage/Main/Settings/Settings';

const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/main" element={<Main />}>
        <Route path="home" element={<Home />} />
        <Route path="room-detail/:id" element={<RoomDetail />} />
        <Route path="find" element={<Find />} />
        <Route path="saved" element={<Saved />} />
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
