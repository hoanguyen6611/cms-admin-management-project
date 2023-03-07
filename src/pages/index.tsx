import Head from "next/head";
import Dashboard from "@/components/layout/dashboard/DashBoard";
import LayoutPage from "@/components/layout/layout/Layout";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Tổng quan</title>
      </Head>
      <Dashboard></Dashboard>
    </div>
  );
};
export default Home;
