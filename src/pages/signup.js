import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../styles/home.module.scss";
import navStyles from "../styles/Navbar.module.scss";
import logo from "../../public/Logo/Chiplogo.svg";
import Link from "next/link";

const Signup = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    } catch (error) {
      console.log(error.response);
      setErrorMessage(err.rresponse.data.message);
    }
  };

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
            <h1 className={navStyles.navBar__header}>Register</h1>
          </div>

          <form className={styles.home__center}>
            <input
              onChange={(e) => setRegisterUsername(e.target.value)}
              type="text"
              name="username"
              placeholder="username"
            />
            <input
              onChange={(e) => setRegisterPassword(e.target.value)}
              type="text"
              name="password"
              placeholder="password"
            />
            <input
              onChange={(e) => setRegisterEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="email@example.com"
            />

            <button type="submit"></button>
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

export default Signup;
