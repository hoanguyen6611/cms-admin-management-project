import Dashboard from "@/components/dashboard/DashBoard";
import Login from "@/components/login-page/Login";
import Head from "next/head";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <Login/>
    </div>
  );
};
export default Home;
