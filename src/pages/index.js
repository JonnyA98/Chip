import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar/Navbar";

const Home = () => {
  return (
    <>
      <Head>
        <title>Chip</title>
      </Head>
      <div>
        <Navbar />
        <div>
          <h1>Homepage</h1>
        </div>
      </div>
    </>
  );
};

export default Home;
