import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/signup.module.scss";

import logo from "../../../public/Logo/chiplogo.webp";
import Link from "next/link";
import { useRouter } from "next/router";

const GiftDetails = () => {
  const router = useRouter();

  const [giftData, setGiftData] = useState();
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [chip, setChip] = useState();
  const [userData, setUserData] = useState();
  const { giftId } = router.query;
  const [errorMessage, setErrorMessage] = useState("");
  const [chipped, setChipped] = useState(false);

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
    const getUsers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/users/all`);
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  const getGiftDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/gifts/gift/${giftId}`
      );
      setGiftData(data[0]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGiftDetails();
  }, [router.isReady]);

  useEffect(() => {
    if (giftData && users) {
      const recipient = users.find((user) => user.id === giftData.recipient_id);
      setRecipientName(recipient.name);
    }
  }, [giftData, users]);

  const chipHandler = async (e) => {
    e.preventDefault();
    if (!chip) {
      setErrorMessage("You must Chip to chip!");
    }
    try {
      await axios.post(`http://localhost:3001/api/gifts/chip`, {
        user_id: userData.id,
        gift_id: giftId,
        chip_amount: chip,
      });
      await axios.patch(`http://localhost:3001/api/gifts/edit-gift`, {
        gift_id: giftId,
        chip_amount: chip,
      });
      getGiftDetails();
      setChipped(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {chipped && <div></div>}
      {isLoading && <h1>LOADING...</h1>}
      {!isLoading && (
        <div className={styles.container}>
          <article className={styles.navBar}>
            <div>
              <Link className={styles.navBar__logo} href="/">
                <Image
                  className={styles.navBar__image}
                  height="150"
                  src={logo}
                  alt="logo"
                />
              </Link>
            </div>
            <div className={styles.formWrapper}>
              <h1 className={styles.formHeader}>
                {giftData && giftData.title} for {recipientName}
              </h1>
              <p>{giftData && giftData.description}</p>
              <div className={styles.formWrapper}>
                <h2 className={styles.formHeader}>
                  £{giftData && giftData.money_left} to go!
                </h2>
                <form onSubmit={chipHandler} className={styles.form}>
                  <div>
                    <label htmlFor="amount">Contribute:</label>
                    <p>
                      £
                      <input
                        onChange={(e) => setChip(e.target.value)}
                        name="amount"
                        min="0"
                        type="number"
                      />
                    </p>
                  </div>
                  <button type="submit">Chip!</button>
                </form>
              </div>
            </div>
          </article>
          <div className={styles.background}>
            <div className={styles.background__left}></div>
            <div className={styles.background__right}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default GiftDetails;
