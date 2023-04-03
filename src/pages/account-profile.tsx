import AccountProfile from "@/components/login-page/AccountProfile";
import Head from "next/head";
import React from "react";

const ProfileAccount = () => {
  return (
    <div>
      <Head>
        <title>Tài khoản cá nhân </title>
      </Head>
      <AccountProfile></AccountProfile>
    </div>
  );
};

export default ProfileAccount;
