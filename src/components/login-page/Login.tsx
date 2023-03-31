import React, { SyntheticEvent, useEffect, useState } from "react";
import { Input, Layout, Form, notification, theme, Button } from "antd";
import { useRouter } from "next/router";
import { CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { EKey } from "@/models/general";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserLogin } from "@/redux/permission/permissionSlice";
import * as yup from "yup";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";

const { Header, Content } = Layout;
const schema = yup.object({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$/,
      "Mật khẩu chưa đúng định dạng, mật khẩu bao gồm cả chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),
});
type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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
  const user = useSelector((state: RootState) => state.permission);
  const login = async () => {
    console.log(errors);
    // e.preventDefault();
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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.back();
      }
    }
  }, [router]);
  const onSubmit = (data: FormData) => {
    console.log(JSON.stringify(data));
  };
  const redirectKey = "sign_in_redirect";
  function getRedirect(): string | null {
    return window.sessionStorage.getItem(redirectKey);
  }

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
      </Header>
      <Content>
        <div
          className="site-layout-content w-full h-[646px] flex justify-around items-center"
          style={{ background: "#4070f4" }}
        >
          <Form
            className="px-10 pb-10 pt-[100px] w-full max-w-[500px] mx-auto border rounded-lg bg-white"
            autoComplete="off"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 15 }}
            // onSubmit={login}
          >
            <h1 className="text-xl text-center font-bold mb-4">Đăng nhập</h1>
            <Form.Item label="Tên đăng nhập" name="username">
              <Input
                // {...register("username")}
                placeholder="Vui lòng nhập tên đăng nhập"
                onChange={(e) => setUsername(e.target.value)}
              />
              {/* <p className={styles.warning}>{errors.username?.message}</p> */}
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password">
              <Input.Password
                // {...register("password")}
                placeholder="Vui lòng nhập mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <p className={styles.warning}>{errors.password?.message}</p> */}
            </Form.Item>
            <div className="flex">
              <Button
                onClick={login}
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
