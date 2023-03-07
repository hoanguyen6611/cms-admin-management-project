import React from "react";
import { Breadcrumb, Layout, Menu, theme, Dropdown, Avatar, MenuProps } from "antd";
import { SmileOutlined, UserOutlined } from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;

const HeaderItem = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: "4",
      danger: true,
      label: "a danger item",
    },
  ];
  return (
    <div>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Avatar size={40} icon={<UserOutlined />} />
        <Dropdown menu={{ items }}></Dropdown>
      </Header>
    </div>
  );
};

export default HeaderItem;
