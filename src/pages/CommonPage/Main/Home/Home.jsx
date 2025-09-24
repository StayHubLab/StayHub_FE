import React from "react";
import Welcome from "./Welcome/Welcome";
import Renting from "./Renting/Renting";
import Suggest from "./Suggest/Suggest";
import Saved from "./Saved/Saved";
import Activity from "./Activity/Activity";
import { Row, Col } from "antd";

const Main = () => {
  return (
    <div>
      <Row>
        <Welcome />
        <Renting />
        <Suggest />
        <Saved />
        <Activity />
      </Row>
    </div>
  );
};

export default Main;
