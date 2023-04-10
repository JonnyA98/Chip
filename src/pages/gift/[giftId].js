import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/home.module.scss";
import backarrow from "../../../public/icons/backarrow.svg";
import logo from "../../../public/Logo/Logo.svg";
import Link from "next/link";
import { useRouter } from "next/router";

const GiftDetails = () => {
  const router = useRouter();

  const [giftData, setGiftData] = useState();
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
      {!giftData || (!recipientName && <h1>Loading...</h1>)}
      {giftData && recipientName && (
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link className={styles.logosmall} href="/">
              <Image src={logo} alt="Logo" width={100} height={100} />
            </Link>
            <Link
              href={`/profile/${userData.id}`}
              className={styles.headingwrapper}
            >
              <Image
                height={40}
                alt="settings"
                className={styles.saveimg}
                src={backarrow}
              />
              <h1 className={styles.heading}>Cancel</h1>
            </Link>
          </nav>

          {/* <Image
            src={getGiftImage(gift, currentUser)}
            alt="Gift progress"
            width={100}
            height={100}
          /> */}
          <main className={styles.main}>
            <article className={styles.anotherwrapper}>
              <h1 className={styles.moretext}>
                {giftData.title} for {recipientName}
              </h1>
              <p className={styles.moretext}>{giftData.description}</p>
              <div className={styles.formWrapper}>
                <h2 className={styles.moretext}>
                  £{giftData.money_left} to go!
                </h2>
                <form onSubmit={chipHandler} className={styles.moretext}>
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
            </article>
          </main>
        </div>
      )}
    </>
  );
};

export default GiftDetails;
