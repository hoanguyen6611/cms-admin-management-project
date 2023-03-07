import Head from "next/head";
import Dashboard from "@/components/layout/dashboard/DashBoard";

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
