import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/home.module.scss";
import navStyles from "../../styles/Navbar.module.scss";
import giftStyles from "../../styles/createGift.module.scss";
import logo from "../../../public/Logo/Chiplogo.svg";
import Link from "next/link";
import { useRouter } from "next/router";

const createGift = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState();
  const [you, setYou] = useState();
  const [endDate, setEndDate] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [nonUserData, setNonUserData] = useState(null);
  const [giftCreated, setGiftCreated] = useState(false);
  const [userGifts, setUserGifts] = useState(null);

  const router = useRouter();
  const { recipientId } = router.query;

  const getGiverGifts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/gifts/giver/${userData.id}`
      );
      setUserGifts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const startGiftHandler = async (e) => {
    e.preventDefault();
    if (!title || !description || !target || !you) {
      setErrorMessage("You must provide a title, a description");
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/gifts/create`, {
        title: title,
        description: description,
        sender_id: Number(userData.id),
        recipient_id: Number(recipientId),
        target_money: target,
        money_left: target - you,
        end_date: endDate,
      });
      setGiftCreated(true);
    } catch (error) {
      console.log(error.response);
      setErrorMessage(error.response.data.message);
    }
  };

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
  const getRecipientDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/non-user/${recipientId}`
      );
      setNonUserData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecipientDetails();
    getUserData();
  }, []);

  return (
    <>
      {giftCreated && (
        <div className={giftStyles.wrapper}>
          <article className={giftStyles.thankyou}>
            <h1 className={giftStyles.thankyou__header}>
              Thank you for starting something special!
            </h1>
            <div>
              <p>
                Your friend is going to have a wonderful surprise! What would
                you like to do now?
              </p>
              {/* <Link href={`/`}>Go to this gift's page?</Link> or */}
              <Link href={`/profile/${userData.id}`}>
                Go back home to start another gift or Chip!
              </Link>
            </div>
          </article>
        </div>
      )}
      {isLoading && <h1>LOADING....</h1>}
      {!isLoading && (
        <div className={giftStyles.mainwrapper}>
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
              <h1 className={navStyles.navBar__header}>Create a Gift</h1>
            </div>

            <form onSubmit={startGiftHandler} className={styles.home__center}>
              <label className={styles.home__label} htmlFor="description">
                Title
              </label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                name="title"
                placeholder="Title"
              />
              <label className={styles.home__label} htmlFor="description">
                Description
              </label>
              <input
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                name="description"
                placeholder="Description"
              />
              <label className={styles.home__label} htmlFor="target">
                Target amount
              </label>
              <input
                onChange={(e) => setTarget(e.target.value)}
                type="number"
                name="target"
                placeholder="00.00"
              />
              <label className={styles.home__label} htmlFor="you">
                How much would you like to put in?
              </label>
              <input
                onChange={(e) => setYou(e.target.value)}
                type="number"
                name="you"
                placeholder="00.00"
              />
              <label className={styles.home__label} htmlFor="you">
                When would you like the deadline for collection to be?
              </label>
              <input
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
                name="you"
              />

              <button type="submit">Create Gift</button>
            </form>
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

export default createGift;
