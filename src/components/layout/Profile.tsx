import {
  CheckOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, notification } from "antd";
import React from "react";
import type { MenuProps } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

const Profile = () => {
  const router = useRouter();
  const logout = () => {
    notification.open({
      message: "Đăng xuất thành công",
      icon: <CheckOutlined style={{ color: "#52c41a" }} />,
    });
    router.push("/login");
    localStorage.clear();
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href="/account-profile">Quản lý tài khoản</Link>,
    },
    {
      key: "2",
      label: <a onClick={logout}>Đăng xuất</a>,
    },
  ];
  return (
    <div>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <div className="flex">
            <Avatar className="mr-2" size={40} icon={<UserOutlined />} />
            <div className="font-bold">ADMIN</div>
          </div>
        </a>
      </Dropdown>
    </div>
  );
};

export default Profile;
