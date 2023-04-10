import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/createGift.module.scss";
import backarrow from "../../../public/icons/backarrow.svg";
import logo from "../../../public/Logo/Logo.svg";
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
  const [interests, setInterests] = useState(null);
  const [isFetchingRecommendations, setIsFetchingRecommendations] =
    useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const router = useRouter();
  const { recipientId } = router.query;

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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecipientInterests = async () => {
    if (nonUserData) {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/users/interests/${nonUserData.id}`
        );

        const interestsArray = data.map((item) => item.interest);
        setInterests(interestsArray);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getGiftRecommendations = async (recinterests) => {
    if (recinterests) {
      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/gifts/recommendation",
          {
            interests: recinterests,
          }
        );
        // Check if the received data is an array
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else {
          setRecommendations([]);
          console.error("Received data is not an array.");
          console.log(data);
        }
        setIsFetchingRecommendations(false);
        console.log("getRecipientInterests called");
      } catch (error) {
        console.error("Failed to fetch gift recommendations:", error);
      }
    }
  };

  useEffect(() => {
    getRecipientDetails();
    getUserData();
  }, [router.isReady]);

  useEffect(() => {
    getRecipientInterests();
  }, [nonUserData, router.isReady]);

  useEffect(() => {
    getGiftRecommendations(interests);
  }, [interests]);

  useEffect(() => {
    console.log(recommendations);
  }, [recommendations]);

  const onRecommendationClick = (recommendation) => {
    setTitle(recommendation.title);
    setDescription(recommendation.description);
    setTarget(recommendation.target_money);
    setShowForm(true);
  };

  const onCreateOwnGiftClick = () => {
    setShowForm(true);
  };

  return (
    <>
      {isLoading && <h1>Loading...</h1>}
      {giftCreated && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h1 className={styles.successHeader}>Gift Created Successfully!</h1>
            <p>Thank you for starting something special!</p>
            <Link href={`/profile/${userData.id}`}>
              Go back home to start another gift or Chip!
            </Link>
          </div>
        </div>
      )}
      {!isLoading && (
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
                src={backarrow}
                alt="settings"
                className={styles.settingsimg}
              />
              <h1>Cancel</h1>
            </Link>
          </nav>
          <main className={styles.main}>
            {isFetchingRecommendations ? (
              <p className={styles.loadingState}>Loading recommendations...</p>
            ) : (
              <section className={styles.recommendationContainer}>
                {recommendations.map((recommendation, index) => (
                  <div
                    className={styles.recommendationCard}
                    key={index}
                    onClick={() => onRecommendationClick(recommendation)}
                  >
                    {" "}
                    <h1>{recommendation.title}</h1>
                    <p>{recommendation.description}</p>
                    <p>£{recommendation.target_money}</p>
                    <button className={styles.buttonrecomendation}>
                      Select
                    </button>
                  </div>
                ))}
              </section>
            )}
            {!showForm && (
              <button
                className={styles.buttonrecomendation}
                onClick={onCreateOwnGiftClick}
              >
                I would rather make my own gift
              </button>
            )}
            {showForm && (
              <div className={styles.formWrapper}>
                <h1 className={styles.formHeader}>Create a Gift</h1>
                <form onSubmit={startGiftHandler} className={styles.form}>
                  <label className={styles.formLabel} htmlFor="description">
                    Title
                  </label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    name="title"
                    value={title}
                  />
                  <label className={styles.formLabel} htmlFor="description">
                    Description
                  </label>
                  <input
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    name="description"
                    value={description}
                  />
                  <label className={styles.formLabel} htmlFor="target">
                    Target amount
                  </label>
                  <input
                    onChange={(e) => setTarget(e.target.value)}
                    type="number"
                    name="target"
                    value={target}
                  />
                  <label className={styles.formLabel} htmlFor="you">
                    How much would you like to put in?
                  </label>
                  <input
                    onChange={(e) => setYou(e.target.value)}
                    type="number"
                    name="you"
                    placeholder="00.00"
                  />
                  <label className={styles.formLabel} htmlFor="you">
                    When would you like the deadline for collection to be?
                  </label>
                  <input
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                    name="you"
                    className={styles.dateInput}
                  />
                  <button type="submit">Create Gift</button>
                </form>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default createGift;
