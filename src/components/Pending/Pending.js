import friendStyle from "./Pending.module.scss";
import profile from "../../../public/icons/profile.svg";
import accept from "../../../public/icons/accept.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const Pending = ({ user }) => {
  const [picture, setPicture] = useState(null);
  const [gifts, setGifts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user.image_url === "pending") {
      setPicture(profile);
    } else {
      setPicture(user.image_url);
    }
    setIsLoading(false);
  }, [user]);

  const acceptHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:3001/api/users/friend-accept/${user.requestId}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article className={friendStyle.pendingFriendCard}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Image
          height={50}
          className={friendStyle.image}
          src={picture}
          alt="profile pic"
        />
      )}
      <div className={friendStyle.pendingFriendWrapper}>
        <h3 className={friendStyle.pendingFriendName}>{user.name}</h3>
        <div className={friendStyle.actionWrapper}>
          <button onClick={acceptHandler}>
            <Image height={20} src={accept} alt="accept"></Image>
          </button>
        </div>
      </div>
    </article>
  );
};

export default Pending;
