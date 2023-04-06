import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/home.module.scss";
import navStyles from "../../styles/Navbar.module.scss";
import logo from "../../../public/Logo/Chiplogo.svg";
import Link from "next/link";
import Friend from "../../components/Friend/Friend";
import { useRouter } from "next/router";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const authToken = sessionStorage.getItem("authToken");
      try {
        const { data } = await axios.get("http://localhost:3001/api/user", {
          headers: { authorisation: `Bearer ${authToken}` },
        });
        setUserData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const getUserFriends = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/users/friends/${userData.id}`
        );
        setFriendsList(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (userData.id) {
      getUserFriends();
    }
  }, [userData]);

  return (
    <>
      {isLoading && <h1>LOADING...</h1>}
      {!isLoading && (
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
              <h1 className={navStyles.navBar__header}>
                Hello {userData.name} !
              </h1>
            </div>

            <div className={styles.home__center}>
              <h2>Friends</h2>
              {friendsList.length > 0 ? (
                friendsList.map((friend) => {
                  return <Friend friend={friend} key={friend.id} />;
                })
              ) : (
                <p>Add some friends to get started!</p>
              )}
            </div>
          </article>

          <div className={styles.home}>
            <div className={styles.home__left}></div>
            <div className={styles.home__right}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
