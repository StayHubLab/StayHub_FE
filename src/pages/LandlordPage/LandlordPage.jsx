import React from "react";
import { Outlet } from "react-router-dom";
import LandlordMenu from "./LandlordMenu/LandlordMenu";
import { Row, Col } from "antd";

const Main = () => {
  return (
    <div>
      <Row>
        <Col span={4}>
          <LandlordMenu />
        </Col>
        <Col span={20}>
          <Outlet />
        </Col>
      </Row>
    </div>
  );
};

export default Main;
