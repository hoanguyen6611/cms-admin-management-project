import Head from "next/head";
import Dashboard from "@/components/layout/dashboard/DashBoard";
import LayoutPage from "@/components/layout/layout/Layout";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Tổng quan</title>
      </Head>
      <LayoutPage> Tổng quan
        {/* <h1>Tổng quan</h1> */}
        <Dashboard></Dashboard>
      </LayoutPage>
    </div>
  );
};
export default Home;
