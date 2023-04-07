import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/home.module.scss";

import logo from "../../../public/Logo/chiplogo.webp";
import settings from "../../../public/icons/editProfile.svg";
import Link from "next/link";
import Friend from "../../components/Friend/Friend";
import NonFriend from "../../components/NonFriend/NonFriend";
import Pending from "../../components/Pending/Pending";
import { useRouter } from "next/router";
import { listItemSecondaryActionClasses } from "@mui/material";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [friendsList, setFriendsList] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [notFriends, setNotFriends] = useState([]);
  const [pending, setPending] = useState(null);
  const [pendingUsers, setPendingUsers] = useState(null);
  const [displayWelcome, setDisplayWelcome] = useState(true);

  const [welcomeText, setWelcomeText] = useState("Welcome");

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

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/users/all");
        setAllUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, []);

  useEffect(() => {
    const getPendingFriendRequests = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/users/friend-requests/${userData.id}`
        );
        setPending(data);
      } catch (error) {}
    };
    getPendingFriendRequests();
  }, [userData]);

  useEffect(() => {
    if (allUsers && friendsList && userData.id) {
      const notFriends = allUsers.filter(
        (user) =>
          user.id !== userData.id &&
          !friendsList.some((friend) => friend.id === user.id)
      );

      setNotFriends(notFriends);
    }
  }, [allUsers, friendsList, userData]);

  useEffect(() => {
    if (pending && allUsers) {
      const pendingList = pending.map((pendee) => {
        const user = allUsers.find((user) => user.id === pendee.send_user_id);
        return { ...user, requestId: pendee.id };
      });
      setPendingUsers(pendingList);
      console.log(pending);
    }
    return;
  }, [pending, allUsers]);

  const [page, setPage] = useState(1);
  const perPage = 3;
  const pageStart = (page - 1) * perPage;
  const pageEnd = pageStart + perPage;
  const pageNotFriends = notFriends.slice(pageStart, pageEnd);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayWelcome(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <h1>Loading...</h1>}
      {!isLoading && !displayWelcome && (
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href="/">
              <Image src={logo} alt="Logo" width={150} height={150} />
            </Link>
            <Link href="/edit-profile" className={styles.headingwrapper}>
              <h1 className={styles.heading}>Edit Profile</h1>
              <Image
                height={40}
                src={settings}
                alt="settings"
                className={styles.settingsimg}
              ></Image>
            </Link>
          </nav>

          <main className={styles.main}>
            {pendingUsers && pendingUsers.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.subHeading}>Pending Requests</h2>
                <ul className={styles.list}>
                  {pendingUsers.map((user) => (
                    <li className={styles.listItem} key={user.id}>
                      <Pending user={user} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {friendsList.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.subHeading}>Your Friends</h2>
                <ul className={styles.list}>
                  {friendsList.map((friend) => (
                    <li className={styles.listItem} key={friend.id}>
                      <Friend allUsers={allUsers} friend={friend} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className={styles.section}>
              <h2 className={styles.subHeading}>
                {friendsList.length
                  ? "Add Friends"
                  : "Add Friends to Get Started!"}
              </h2>
              <ul className={styles.list}>
                {pageNotFriends.map((person) => (
                  <li className={styles.listItem} key={person.id}>
                    <NonFriend nonFriend={person} currentUser={userData} />
                  </li>
                ))}
              </ul>
              {notFriends.length > pageEnd && (
                <button className={styles.button} onClick={handleNextPage}>
                  Next page
                </button>
              )}
              {page > 1 && (
                <button className={styles.button} onClick={handlePrevPage}>
                  Previous page
                </button>
              )}
            </section>
          </main>
        </div>
      )}
      {displayWelcome && (
        <div className={styles.welcome}>
          <Image src={logo} alt={logo} height={250}></Image>
          <h1 className={styles.welcome__heading}>
            {welcomeText} {userData.name}
          </h1>
          <h2>Lets get chipping!</h2>
        </div>
      )}
    </>
  );
};

export default Profile;
