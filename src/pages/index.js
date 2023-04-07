import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import styles from "../styles/home.module.scss";

import logo from "../../public/Logo/chiplogo.webp";

const Home = () => {
  return (
    <>
      <Head>
        <title>Chip</title>
      </Head>
      <div className={styles.container}>
        <article className={styles.navBar}>
          <div className={styles.logowrapper}>
            <Link className={styles.logo} href="/">
              <Image
                className={styles.image}
                height="300"
                src={logo}
                alt="logo"
              />
            </Link>
          </div>

          <div className={styles.textContainer}>
            <Link className={styles.link} href="/signup">
              <h1 className={styles.header}>Get Started </h1>
            </Link>

            <div>
              <h2 className={styles.header_small}>
                Or already have an account?
              </h2>
              <Link className={styles.link_login} href="/login">
                Login Here
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default Home;
