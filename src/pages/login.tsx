import Login from "@/components/login-page/Login";
import { Logins } from "@/components/login-page/Login_New";
import Head from "next/head";
import React from "react";

const LoginPage = () => {
  return (
    <div>
      <Head>
        <title>Login Admin</title>
      </Head>
      {/* <Logins></Logins> */}
      <Login></Login>
    </div>
  );
};

export default LoginPage;
