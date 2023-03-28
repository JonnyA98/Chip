import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Chip</title>
      </Head>
      <div>
        <Link href="/login">Log in</Link>
        <h1>Homepage</h1>
      </div>
    </>
  );
}
