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
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { useRouter } from "next/router";
import Profile from "./Profile";

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
  getItem("Tổng quan", "", <DashboardOutlined />),
  getItem("Phân quyền", "group", <ApartmentOutlined />),
  // getItem("Quyền", "permission"),
  getItem("Sản phẩm", "sub1", <SettingOutlined />, [
    getItem("Danh mục", "category"),
    getItem("Sản phẩm", "product"),
  ]),
  getItem("Giao dịch", "sub2", <SnippetsOutlined />, [
    getItem("Đơn hàng", "order"),
    getItem("Mã giảm giá", "voucher"),
  ]),
  getItem("Quản lý cửa hàng", "sub3",<BranchesOutlined />, [
    getItem("Thông tin cửa hàng","store")
  ]),
  getItem("Tài khoản", "account", <AccountBookOutlined />),
  getItem("Khách hàng", "customer", <CustomerServiceOutlined />),
];

const LayoutPage = (props: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
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
        <Menu
          theme="dark"
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={items}
          onClick={(info) => {
            router.push(`/${info.key}`);
          }}
        />
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
