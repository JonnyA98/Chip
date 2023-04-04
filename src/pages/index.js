import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import styles from "../styles/home.module.scss";
import navStyles from "../styles/Navbar.module.scss";
import logo from "../../public/Logo/Chiplogo.svg";

const Home = () => {
  return (
    <>
      <Head>
        <title>Chip</title>
      </Head>
      <div>
        <article className={navStyles.navBar}>
          <div>
            <Link className={navStyles.navBar__logo} href="/">
              <Image
                className={navStyles.navBar__image}
                height="150"
                src={logo}
                alt="logo"
              />
            </Link>
          </div>
          <div className={styles.home__center}>
            <h1 className={navStyles.navBar__header}>Get Started </h1>
            <Link className={navStyles.navBar__link} href="/signup">
              Here
            </Link>
          </div>
          <div className={styles.home__center}>
            <h2 className={navStyles.navBar__header__small}>
              Or already have an account?{" "}
            </h2>
            <Link className={navStyles.navBar__link_login} href="/login">
              Login Here
            </Link>
          </div>
        </article>

        <div className={styles.home}>
          <div className={styles.home__left}></div>
          <div className={styles.home__right}></div>
        </div>
      </div>
    </>
  );
};

export default Home;
