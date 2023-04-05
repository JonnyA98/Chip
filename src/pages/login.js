import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../styles/home.module.scss";
import navStyles from "../styles/Navbar.module.scss";
import logo from "../../public/Logo/Chiplogo.svg";
import Link from "next/link";
import { useRouter } from "next/router";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  const router = useRouter();

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMessage("You must provide a username and a password");
      return;
    }

    try {
      const { data } = await axios.post(`http://localhost:3001/api/user`, {
        email: loginEmail,
        password: loginPassword,
      });
      sessionStorage.setItem("authToken", data.authToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error.response);
      setErrorMessage(error.response.data.message);
    }
  };

  const getUserDetails = async () => {
    const authToken = sessionStorage.getItem("authToken");
    try {
      const { data } = await axios.get(`http://localhost:3001/api/user`, {
        headers: {
          authorisation: `Bearer ${authToken}`,
        },
      });
      setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoggedIn) {
    getUserDetails().then(() =>
      router.push({
        pathname: `/profile/${userData.id}`,
      })
    );
  }

  return (
    <>
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
            <h1 className={navStyles.navBar__header}>Login</h1>
          </div>

          <form onSubmit={loginHandler} className={styles.home__center}>
            <input
              onChange={(e) => setLoginEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="email@example.com"
            />
            <input
              onChange={(e) => setLoginPassword(e.target.value)}
              type="password"
              name="password"
              placeholder="password"
            />
            <button type="submit">Login</button>
          </form>
        </article>

        <div className={styles.home}>
          <div className={styles.home__left}></div>
          <div className={styles.home__right}></div>
        </div>
      </div>
    </>
  );
};

export default Login;
