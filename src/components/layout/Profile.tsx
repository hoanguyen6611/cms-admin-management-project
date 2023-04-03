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
  const logout = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://tech-api.herokuapp.com/v1/account/logout",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      notification.open({
        message: "Đăng xuất thành công",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      router.push("/login");
      localStorage.clear();
    } else {
      notification.open({
        message: res.data,
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
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
