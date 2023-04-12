import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/createGift.module.scss";
import backarrow from "../../../public/icons/backarrow.svg";
import logo from "../../../public/Logo/Logo.svg";
import Link from "next/link";
import { useRouter } from "next/router";
import PulseLoader from "react-spinners/PulseLoader";
import { loadStripe } from "@stripe/stripe-js";
import StripeForm from "../../components/StripeForm/StripeForm";

import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MqMotD7x5DQT6pFSyJECz2KkzKc58OkyWUyDelnjAt6xYb5j2J1i54KoMnyIqWCiAUF2QFDaI1sKG8Ts6AVRQtW00C97JVYz4"
);

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [chipDone, setChipDone] = useState(false);
  const [interests, setInterests] = useState(null);
  const [hasInterests, setHasInterests] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);

  const router = useRouter();
  const { recipientId } = router.query;

  const startGiftHandler = async (e) => {
    e.preventDefault();
    if (!title || !description || !target || !you) {
      setErrorMessage("You must provide a title, a description");
      return;
    }

    setShowStripeForm(true);
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
        console.log("Interests array:", interestsArray);
        if (interestsArray.length !== 0) {
          console.log("Setting hasInterests to true");
          setHasInterests(true);
        } else {
          console.log("Setting hasInterests to false");
          setHasInterests(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getGiftRecommendations = async (recinterests) => {
    if (recinterests && recinterests.length > 0) {
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
        // Move this line here
        console.log("getRecipientInterests called");
      } catch (error) {
        console.error("Failed to fetch gift recommendations:", error);
      }
    }
  };

  useEffect(() => {
    const postGift = async () => {
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
      } catch (error) {
        console.log(error);
      }
    };
    if (chipDone) {
      postGift();
    }
  }, [chipDone]);

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

  useEffect(() => {}, [recommendations]);

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
      {isLoading && (
        <PulseLoader className={styles.colorchangingloader} size={15} />
      )}
      {chipDone && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.successHeader}>Payment accepted! ✅</h2>
            <h1 className={styles.successHeader}>Gift Created Successfully!</h1>
            <p>Thank you for starting something special!</p>
            <Link
              className={styles.successlinkwrap}
              href={`/profile/${userData.id}`}
            >
              <p className={styles.successLink}>
                Go back home to start another gift or Chip!
              </p>
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
            {!recommendations ? (
              hasInterests && (
                <article className={styles.loadingwrapper}>
                  <p className={styles.alternateColorSpinner}>
                    Loading recommended gifts based on your friends interests!
                  </p>
                  <PulseLoader
                    color="#fddb40"
                    className={styles.alternateColorSpinner}
                    size={15}
                  />
                </article>
              )
            ) : (
              <>
                {hasInterests
                  ? recommendations && (
                      <section className={styles.recommendationContainer}>
                        {recommendations.map((recommendation, index) => (
                          <button
                            className={styles.recommendationCard}
                            key={index}
                            onClick={() =>
                              onRecommendationClick(recommendation)
                            }
                          >
                            <h1>{recommendation.title}</h1>
                            <p>{recommendation.description}</p>
                            <p>£{recommendation.target_money}</p>
                          </button>
                        ))}
                      </section>
                    )
                  : null}
              </>
            )}

            {!showForm && nonUserData && (
              <button
                className={styles.createbutton}
                onClick={onCreateOwnGiftClick}
              >
                {hasInterests
                  ? "I would rather choose my own gift"
                  : "Start Creating Gift"}
              </button>
            )}
            {showForm && (
              <article className={styles.recommendationContainer}>
                <div className={styles.recommendationCard}>
                  <h1 className={styles.formHeader}>Create a Gift</h1>
                  <form onSubmit={startGiftHandler} className={styles.form}>
                    <label className={styles.formLabel} htmlFor="description">
                      Title
                    </label>
                    <input
                      className={styles.title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      name="title"
                      value={title}
                    />
                    <label className={styles.formLabel} htmlFor="description">
                      Description
                    </label>
                    <textarea
                      className={styles.description}
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
                    <label className={styles.formLabel} htmlFor="date">
                      When would you like the deadline for collection to be?
                    </label>
                    <div className={styles.datewrapper}>
                      <input
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                        name="date"
                        className={styles.customDatepicker}
                      />
                    </div>

                    <button
                      className={styles.buttonrecomendation}
                      type="submit"
                    >
                      Create Gift
                    </button>
                  </form>
                </div>
              </article>
            )}
          </main>
        </div>
      )}
      {showStripeForm && (
        <div className={styles.modal}>
          <article className={styles.modalContent}>
            <h2>Make Payment</h2>
            <Elements stripe={stripePromise}>
              <StripeForm
                setShowStripeForm={setShowStripeForm}
                amount={you * 100}
                setChipDone={setChipDone}
              />
            </Elements>
          </article>
        </div>
      )}
    </>
  );
};

export default createGift;
