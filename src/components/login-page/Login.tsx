import React, { SyntheticEvent, useEffect, useState } from "react";
import { Layout, Menu, notification, theme } from "antd";
import { useRouter } from "next/router";
import { CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { EKey } from "@/models/general";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserLogin } from "@/redux/permissionSlice";
// import * as yup from "yup";
// import { useForm, useController } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";

const { Header, Content } = Layout;
// const schemaValidation = yup.object({
//   username: yup.string().required("Vui lòng nhập tên đăng nhập"),
//   password: yup.string().required("Vui lòng nhập mật khẩu"),
// });
const Login = () => {
  // const { control, register } = useForm({
  //   resolver: yupResolver(schemaValidation),
  // });
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.permission);
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
  };
  useEffect(() => {
    // if (user) {
    //   router.push("/");
    // }
  }, []);

  return (
    // <Layout className="layout">
    //   <Header>
    //     <div className="logo" />
    //     <Menu mode="horizontal" />
    //   </Header>
    //   <Content>

    //   </Content>
    // </Layout>
    <div
      className="site-layout-content"
      style={{ background: colorBgContainer }}
    >
      <form
        className="px-10 pb-10 pt-[100px] w-full max-w-[500px] mx-auto"
        autoComplete="off"
        onSubmit={login}
      >
        <div className="flex flex-col gap-2 mb-5">
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
        <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            required
            placeholder="Vui lòng nhập mật khẩu"
            className="p-4 rounded-md border border-gray-100"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg"
          >
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
