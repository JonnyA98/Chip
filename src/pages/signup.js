import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../styles/signup.module.scss";

import logo from "../../public/Logo/chiplogo.webp";
import Link from "next/link";
import { useRouter } from "next/router";

const Signup = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

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

  const loginHandler = async () => {
    try {
      const { data } = await axios.post(`http://localhost:3001/api/user`, {
        email: registerEmail,
        password: registerPassword,
      });
      sessionStorage.setItem("authToken", data.authToken);
      setIsLoggedIn(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (!registerUsername || registerPassword || registerEmail) {
      setErrorMessage("You must provide an email, username and password");
    }
    try {
      await axios.post(`http://localhost:3001/api/users`, {
        name: registerUsername,
        password: registerPassword,
        email: registerEmail,
      });
      loginHandler();
    } catch (error) {
      console.log(error.response);
      setErrorMessage(error.response.data.message);
    }
  };

  if (isLoggedIn) {
    getUserDetails();
    router.push({
      pathname: `/profile/${userData.id}`,
    });
  }

  return (
    <>
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
          <form onSubmit={signupHandler} className={styles.form}>
            <input
              onChange={(e) => setRegisterUsername(e.target.value)}
              type="text"
              name="username"
              placeholder="username"
            />
            <input
              onChange={(e) => setRegisterPassword(e.target.value)}
              type="password"
              name="password"
              placeholder="password"
            />
            <input
              onChange={(e) => setRegisterEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="email@example.com"
            />
            <button type="submit">Create Account</button>
          </form>
        </div>
      </article>
    </>
  );
};

export default Signup;
