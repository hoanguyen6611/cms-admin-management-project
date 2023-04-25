import AccountShow from "@/components/account/Account";
import Head from "next/head";
import React from "react";

const Account = () => {
  return (
    <div>
      <Head>
        <title>Tài khoản</title>
      </Head>
      <AccountShow />
    </div>
  );
};

export default Account;
