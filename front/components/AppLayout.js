import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { Menu, Row, Col } from "antd";

const AppLayout = ({ children }) => {
  const menuItems = [
    {
      key: "node bird",
      label: <Link href="/">node bird</Link>,
    },
    {
      key: "profile",
      label: <Link href="/profile">profile</Link>,
    },
    {
      key: "signup",
      label: <Link href="/signup">signup</Link>,
    },
  ];

  return (
    <div>
      <Menu mode="horizontal" items={menuItems} />

      <Row gutter={8}>
        <Col xs={24} md={6}>
          왼쪽메뉴
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/bbyojjok"
            target="_blank"
            rel="noreferrer noopener"
          >
            made by stlee
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
