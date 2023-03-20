import React, { useState } from "react";
import {
  ApartmentOutlined,
  SettingOutlined,
  DashboardOutlined,
  SnippetsOutlined,
  UserSwitchOutlined,
  UserOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Avatar, MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Dropdown } from "antd";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

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
  getItem("Vai trò & phân quyền", "sub1", <ApartmentOutlined />, [
    getItem("Quyền", "permission"),
    getItem("Phân quyền", "group"),
  ]),
  getItem("Sản phẩm", "sub2", <SettingOutlined />, [
    getItem("Danh mục", "category"),
    getItem("Sản phẩm", "product"),
  ]),
  getItem("Giao dịch", "sub3", <SnippetsOutlined />, [
    getItem("Đơn hàng", "order"),
  ]),
  getItem("Nhân viên", "sub4", <UserSwitchOutlined />, [
    getItem("Chấm công", "salary"),
  ]),
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
            <Avatar size={40} icon={<UserOutlined />} />
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
