import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import styles from "../styles/home.module.scss";

import intro from "../../public/Logo/Logo.svg";
import logo from "../../public/Logo/11.svg";

const Home = () => {
  const [displayWelcome, setDisplayWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDisplayWelcome(false);
    }, 3000);
  }, []);

  return (
    <>
      {!displayWelcome && (
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
                    height="250"
                    src={logo}
                    alt="logo"
                  />
                </Link>
              </div>

              <div className={styles.login}>
                <Link className={styles.link} href="/signup">
                  <h1 className={styles.header}>Get Started </h1>
                </Link>

                <h2 className={styles.header_small}>
                  Or already have an account?
                </h2>
                <Link className={styles.link_login} href="/login">
                  Login Here
                </Link>
              </div>
            </article>
          </div>
        </>
      )}
      {displayWelcome && (
        <div className={styles.welcome}>
          <Image
            className={styles.welcome__image}
            src={intro}
            alt={logo}
            height={250}
          ></Image>
        </div>
      )}
    </>
  );
};

export default Home;
