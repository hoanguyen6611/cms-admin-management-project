import React, { useState } from "react";
import {
  ApartmentOutlined,
  SettingOutlined,
  DashboardOutlined,
  SnippetsOutlined,
  UserSwitchOutlined,
  BranchesOutlined,
  CustomerServiceOutlined,
  AccountBookOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  BarcodeOutlined,
  UserOutlined,
  AppstoreOutlined,
  BorderlessTableOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { useRouter } from "next/router";
import Profile from "./Profile";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Tổng quan", "", <AppstoreOutlined />),
  getItem("Phân quyền", "group", <ApartmentOutlined />),
  // getItem("Quyền", "permission"),
  getItem("Sản phẩm", "sub1", <SettingOutlined />, [
    getItem("Danh mục", "category"),
    getItem("Sản phẩm", "product"),
  ]),
  getItem("Lịch sử nhập hàng", "import-product", <BorderlessTableOutlined />),
  getItem("Đơn hàng", "order", <ShoppingCartOutlined />),
  getItem("Mã giảm giá", "promotion",<BarcodeOutlined />),
  getItem("Quản lý cửa hàng", "store", <ShopOutlined />),
  getItem("Quản trị viên", "account", <AccountBookOutlined />),
  getItem("Khách hàng", "customer", <UserOutlined />),
];
const LayoutPage = (props: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState("/");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  // const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
          className="logo"
        />
        <div className="SideMenu">
          <Menu
            theme="dark"
            defaultSelectedKeys={["dashboard"]}
            className="SideMenuVertical"
            mode="inline"
            items={items}
            onClick={(info) => {
              router.push(`/${info.key}`);
              // navigate(info.key);
            }}
          />
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex items-end flex-col m-4">
            <Profile></Profile>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>{props.pathOne}</Breadcrumb.Item>
            <Breadcrumb.Item>{props.pathTwo}</Breadcrumb.Item>
          </Breadcrumb> */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
