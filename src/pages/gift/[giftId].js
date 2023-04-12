import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/home.module.scss";
import backarrow from "../../../public/icons/backarrow.svg";
import onenotin from "../../../public/progress/1_notin.svg";
import two from "../../../public/progress/2.svg";
import fiftynotin from "../../../public/progress/50_notin.svg";
import seven5notin from "../../../public/progress/75_notin.svg";
import hundred from "../../../public/progress/100.svg";
import started from "../../../public/progress/started_0.svg";
import started_2 from "../../../public/progress/started_2.svg";
import started_75 from "../../../public/progress/started_75.svg";
import started_100 from "../../../public/progress/started_100.svg";
import seven5 from "../../../public/progress/75.svg";
import Confetti from "react-confetti";
import logo from "../../../public/Logo/Logo.svg";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import StripeForm from "../../components/StripeForm/StripeForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MqMotD7x5DQT6pFSyJECz2KkzKc58OkyWUyDelnjAt6xYb5j2J1i54KoMnyIqWCiAUF2QFDaI1sKG8Ts6AVRQtW00C97JVYz4"
);

import { useRouter } from "next/router";

const GiftDetails = () => {
  const router = useRouter();

  const [giftData, setGiftData] = useState();
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [giftCompleted, setGiftCompleted] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [chip, setChip] = useState();
  const [userData, setUserData] = useState();
  const { giftId } = router.query;
  const [errorMessage, setErrorMessage] = useState("");
  const [chipDone, setChipDone] = useState(false);
  const [chipData, setChipData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [showStripeForm, setShowStripeForm] = useState(false);

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

      const { data: chipdata } = await axios.get(
        `http://localhost:3001/api/gifts/chips/${giftId}`
      );

      setChipData(chipdata);
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
      if (giftData.money_left <= 0) {
        setTimeout(() => {
          setChipDone(false);
          setGiftCompleted(true);
        }, 500);
      }

      const recipient = users.find((user) => user.id === giftData.recipient_id);
      setRecipientName(recipient.name);
      setPercentage(
        ((giftData.target_money - giftData.money_left) /
          giftData.target_money) *
          100
      );
    }
  }, [giftData, users]);

  useEffect(() => {
    if (giftData && percentage && userData && chipData) {
      const userNotChipped = chipData.every(
        (chip) => chip.user_id !== userData.id
      );

      if (userNotChipped) {
        if (percentage < 50) {
          setProgress(onenotin);
        } else if (percentage < 75) {
          setProgress(fiftynotin);
        } else {
          setProgress(seven5notin);
        }
      } else {
        if (!chipData.length) {
          setProgress(started);
        } else if (percentage <= 50) {
          if (giftData.sender_id === userData.id) {
            setProgress(started_2);
          } else {
            setProgress(two);
          }
        } else if (percentage < 100) {
          if (giftData.sender_id === userData.id) {
            setProgress(started_75);
          } else {
            setProgress(seven5);
          }
        } else {
          if (giftData.sender_id === userData.id) {
            setProgress(started_100);
          } else {
            setProgress(hundred);
          }
        }
      }
    }
  }, [giftData, userData, percentage, chipData]);

  const chipHandler = async (e) => {
    e.preventDefault();
    if (!chip) {
      setErrorMessage("You must Chip to chip!");
      return;
    }
    setShowStripeForm(true);
  };

  useEffect(() => {
    const finalChip = async () => {
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
    if (chipDone) {
      finalChip();
    }
  }, [chipDone]);

  return (
    <>
      {!giftData || (!recipientName && isLoading && <h1>Loading...</h1>)}
      {giftData && recipientName && progress && !isLoading && (
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

          <main className={styles.main}>
            <Image
              src={progress}
              alt="Gift progress"
              width={250}
              height={250}
            />
            <article className={styles.anotherwrapper}>
              <h1 className={styles.moretext}>
                {giftData.title} for {recipientName}
              </h1>
              <p className={styles.moretext}>{giftData.description}</p>
              <div className={styles.formWrapper}>
                <h2 className={styles.moretext}>
                  £{giftData.money_left} to go!
                </h2>
                <form onSubmit={chipHandler} className={styles.formdiv}>
                  <div>
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
                  <button className={styles.chip} type="submit">
                    Chip!
                  </button>
                </form>
              </div>
            </article>
          </main>
        </div>
      )}
      {chipDone && (
        <div className={styles.chipmodal}>
          <div className={styles.modalContent}>
            <h2 className={styles.successHeader}>Payment accepted! ✅</h2>

            <p>Thank you for joining in!</p>
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
      {giftCompleted && giftData && (
        <div className={styles.confettiContainer}>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <div className={styles.confettibox}>
            <h1>You did it!</h1>
            <h2>You were part of something incredible!</h2>
          </div>

          <Link className={styles.backlink} href={`/profile/${userData.id}`}>
            Back to dashboard
          </Link>
        </div>
      )}
      {showStripeForm && (
        <div className={styles.chipmodal}>
          <article className={styles.modalContent}>
            <h2>Payment</h2>
            <Elements stripe={stripePromise}>
              <StripeForm
                setShowStripeForm={setShowStripeForm}
                amount={chip * 100}
                setChipDone={setChipDone}
              />
            </Elements>
          </article>
        </div>
      )}
    </>
  );
};

export default GiftDetails;
