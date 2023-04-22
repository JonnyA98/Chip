import styles from "./Card.module.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../public/Logo/Logo.svg";

const Card = ({ userData, userGift }) => {
  const [comments, setComments] = useState(null);

  useEffect(() => {
    const getComments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/gifts/getcomments/${userGift.id}`
        );
        setComments(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (userGift) {
      getComments();
      console.log(comments);
    }
  }, [userGift]);

  return (
    <div className={styles.card}>
      <div className={styles.outside}>
        <div className={styles.front}>
          <p>To {userData.name}</p>
          <Image src={logo} alt="logo" width={250} height={250} />
        </div>
        <div className={styles.back}></div>
      </div>
      <ul className={styles.inside}>
        {comments &&
          comments.map((comment, i) => (
            <li className={styles.comment} key={i}>
              <p>{comment.comment}</p>
              <h3>{comment.user_name}</h3>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Card;
