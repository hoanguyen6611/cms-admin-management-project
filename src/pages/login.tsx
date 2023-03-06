import Login from "@/components/layout/login-page/Login";
import Head from "next/head";
import React from "react";

const LoginPage = () => {
  return (
    <div>
      <Head>
        <title>Login Admin</title>
      </Head>
      <Login></Login>
    </div>
  );
};

export default LoginPage;
