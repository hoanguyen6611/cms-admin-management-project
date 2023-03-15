import React, { SyntheticEvent, useEffect, useState } from "react";
import { Layout, Menu, notification, theme, Form, Input } from "antd";
import { useRouter } from "next/router";
import { CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { EKey } from "@/models/general";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserLogin } from "@/redux/permissionSlice";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";

const { Header, Content } = Layout;
const schema = yup.object({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});
type FormData = yup.InferType<typeof schema>;
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      const { data } = await axios.post(
        "https://tech-api.herokuapp.com/v1/account/login",
        {
          username: username,
          password: password,
          app: "cms",
        }
      );
      if (data.result) {
        dispatch(setUserLogin(data.data));
        notification.open({
          message: data.message,
          icon: <CheckOutlined style={{ color: "#52c41a" }} />,
        });
        await router.push("/");
        localStorage.setItem(EKey.TOKEN, data.data.token);
        localStorage.setItem("username", data.data.username);
      } else {
        notification.open({
          message: data.message,
        });
      }
    }
    return;
  };
  // useEffect(() => {
  //   if (user) {
  //     router.push("/");
  //   }
  // }, [user]);

  return (
    <div
      className="site-layout-content"
      style={{ background: colorBgContainer }}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        className="px-10 pb-10 pt-[100px] w-full max-w-[500px] mx-auto"
        autoComplete="off"
        onClick={login}
        // onSubmit={login}
      >
        <Form.Item label="Tên đăng nhập" name="username">
          <Input
            {...register("username")}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Vui lòng nhập tên đăng nhập"
          />
          <p className={styles.warning}>{errors.username?.message}</p>
        </Form.Item>
        {/* <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            required
            placeholder="Vui lòng nhập tên đăng nhập"
            className="p-4 rounded-md border border-gray-100"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <p className={styles.warning}>{}</p> */}
        <Form.Item label="Mật khẩu" name="password">
          <Input
            {...register("password")}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Vui lòng nhập mật khẩu"
          />
          <p className={styles.warning}>{errors.password?.message}</p>
        </Form.Item>
        {/* <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            required
            placeholder="Vui lòng nhập mật khẩu"
            className="p-4 rounded-md border border-gray-100"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div> */}
        <div>
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg"
          >
            Đăng nhập
          </button>
        </div>
        <div className="mt-4">
          <Link href="/forgetPassword">Quên mật khẩu</Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
