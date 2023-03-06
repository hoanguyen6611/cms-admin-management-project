import Head from "next/head";
import LayoutPage from "@/components/layout/layout/Layout";
import Login from "@/components/layout/login-page/Login";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Login Admin</title>
      </Head>
      <Login></Login>
    </div>
  );
}
