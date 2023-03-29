import styles from "./Navbar.module.scss";
import Link from "next/link";

const NavBar = () => {
  return (
    <article className={styles.navBar}>
      <div>
        <Link className={styles.navBar__logo} href="/">
          <h2>
            C<span className={styles.navBar__h}>h</span>
            ip
          </h2>
        </Link>
      </div>
      <div>
        <ul className={styles.navBar__linklist}>
          <Link className={styles.navBar__link} href="/login">
            <li>Login</li>
          </Link>
          <Link className={styles.navBar__link} href="/signup">
            <li>Sign up</li>
          </Link>
          <Link className={styles.navBar__link} href="/profile">
            <li>Profile</li>
          </Link>
          <Link className={styles.navBar__link} href="/friends">
            <li>Friends</li>
          </Link>
        </ul>
      </div>
    </article>
  );
};

export default NavBar;
