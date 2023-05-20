import {
  CheckOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, Row, notification } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/account/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
};
const AccountProfile = () => {
  const [form] = Form.useForm();
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [id, setId] = useState<string>("");
  const { data: user, error } = useSWR("product-category/list", fetcher);
  console.log(user);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);
  useEffect(() => {
    setId(user?.id);
    form.setFieldsValue({
      username: user?.username,
      fullName: user?.fullName,
    });
  }, [user]);
  const handleOk = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/account/update_admin",
      {
        ...form.getFieldsValue(),
        avatarPath: "string",
        email: "string",
        id: id,
        password: "string",
        phone: "string",
        status: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res);
    // if (res.data.result) {
    //   notification.open({
    //     message: res.data.message,
    //     icon: <CheckOutlined style={{ color: "#52c41a" }} />,
    //   });
    // } else {
    //   notification.open({
    //     message: res.data,
    //     icon: <WarningOutlined style={{ color: "red" }} />,
    //   });
    // }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý tài khoản cá nhân</h1>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        form={form}
        className="mt-5"
      >
        <Row gutter={6}>
          <Col span={4}>
            <Avatar className="mr-2" size={100} icon={<UserOutlined />} />
          </Col>
          <Col span={20}>
            <Form.Item label="Tên đăng nhập" name="username">
              <Input disabled onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>
            <Form.Item label="Họ và tên" name="fullName">
              <Input disabled onChange={(e) => setFullName(e.target.value)} />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item label="Điện thoại" name="phone">
              <Input disabled onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="flex justify-end">
        <Button key="submit" type="primary" onClick={handleOk}>
          Cập nhập
        </Button>
      </div>
    </div>
  );
};

export default AccountProfile;
