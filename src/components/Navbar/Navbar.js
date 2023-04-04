import Link from "next/link";
import logo from "../../../public/Logo/Chiplogo.svg";
import Image from "next/image";

const NavBar = () => {
  return (
    <article className={styles.navBar}>
      <div>
        <Link className={styles.navBar__logo} href="/">
          <Image
            className={styles.navBar__image}
            height="200"
            src={logo}
            alt="logo"
          />
        </Link>
      </div>

      <ul className={styles.navBar__linklist}>
        <Link className={styles.navBar__link} href="/login">
          <li>Login</li>
        </Link>
        <Link className={styles.navBar__link} href="/signup">
          <li>Sign up</li>
        </Link>
      </ul>
    </article>
  );
};

export default NavBar;
