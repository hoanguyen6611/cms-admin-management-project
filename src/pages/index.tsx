import Dashboard from "@/components/dashboard/DashBoard";
import Head from "next/head";

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
