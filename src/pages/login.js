import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../styles/signup.module.scss";

import logo from "../../public/Logo/11.svg";
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
    <div className={styles.container}>
      <article className={styles.navBar}>
        <div>
          <Link className={styles.navBar__logo} href="/">
            <Image
              className={styles.navBar__image}
              height="250"
              src={logo}
              alt="logo"
            />
          </Link>
        </div>
        <div className={styles.formWrapper}>
          <form onSubmit={loginHandler} className={styles.form}>
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
        </div>
      </article>
      <div className={styles.background}>
        <div className={styles.background__left}></div>
        <div className={styles.background__right}></div>
      </div>
    </div>
  );
};

export default Login;
