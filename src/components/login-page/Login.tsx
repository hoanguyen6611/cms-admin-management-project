import React, { useEffect, useState } from "react";
import { Input, Layout, Form, notification, Button } from "antd";
import { useRouter } from "next/router";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "./Login.module.scss";
import * as yup from "yup";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authApi } from "@/api-client/auth-api";

const { Header, Content } = Layout;
const schema = yup.object({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
  // .matches(/[0-9]/, "Mật khẩu phải bao gồm số")
  // .matches(/[a-z]/, "Mật khẩu phải có chữ thường")
  // .matches(/[A-Z]/, "Mật khẩu phải bao gồm chữ hoa")
  // .matches(/[^\w]/, "Mật khẩu phải bao gồm ký tự đặc biệt"),
});
type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const [form] = Form.useForm();
  const [buttonSignIn, setButtonSignIn] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const yupSync = {
    async validator(field: any, value: any) {
      await schema.validateSyncAt(field, { [field]: value });
    },
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const login = async (e: any) => {
    // e.preventDefault();
    setButtonSignIn(true);
    authApi
      .login({
        app: "cms",
        username: getValues("username"),
        password: getValues("password"),
      })
      .then((res) => {
        if (res.result) {
          notification.open({
            message: "Đăng nhập thành công",
            icon: <CheckOutlined style={{ color: "#52c41a" }} />,
          });
          router.push("/");
        } else {
          setButtonSignIn(false);
          notification.open({
            message: "Thông tin đăng nhập không đúng",
            icon: <CloseOutlined style={{ color: "red" }} />,
          });
        }
      });
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.back();
      }
    }
  }, [router]);
  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setValue("username", e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setValue("password", e.target.value);
  };
  return (
    <Layout className="layout">
      <Content>
        <div
          className="site-layout-content w-full h-[840px] flex justify-around items-center background-image"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
          }}
        >
          <Form
            className="px-10 pb-10 pt-[50px] w-full max-w-[500px] mx-auto border rounded-lg bg-white"
            autoComplete="off"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 15 }}
            form={form}
          >
            <h1 className="text-xl text-center font-bold mb-4">Đăng nhập</h1>
            <Form.Item label="Tên đăng nhập" name="username">
              <Input
                {...register("username", { value: username })}
                placeholder="Vui lòng nhập tên đăng nhập"
                onChange={handleUsername}
              />
              <p className={styles.warning}>{errors.username?.message}</p>
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password">
              <Input.Password
                {...register("password", { value: password })}
                placeholder="Vui lòng nhập mật khẩu"
                onChange={handlePassword}
              />
              <p className={styles.warning}>{errors.password?.message}</p>
            </Form.Item>
            <div className="flex">
              <Button
                disabled={buttonSignIn}
                onClick={handleSubmit(login)}
                className="mx-auto bg-blue-600 text-white font-semibold"
              >
                Đăng nhập
              </Button>
            </div>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
