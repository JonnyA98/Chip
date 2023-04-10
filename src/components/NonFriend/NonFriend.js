import friendStyle from "./NonFriend.module.scss";
import profile from "../../../public/icons/profile.svg";
import addFriend from "../../../public/icons/addFriend.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const NonFriend = ({ nonFriend, currentUser, setAddModal }) => {
  const [picture, setPicture] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (nonFriend.image_url === "pending") {
      setPicture(profile);
    } else {
      setPicture(nonFriend.image_url);
    }
    setIsLoading(false);
  }, [nonFriend]);

  const sendFriendRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/api/users/friend-request`, {
        send_user_id: currentUser.id,
        receive_user_id: nonFriend.id,
      });
      setAddModal(true);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <article className={friendStyle.nonFriendCard}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Image
          width={50}
          height={50}
          className={friendStyle.image}
          src={picture}
          alt="profile pic"
        />
      )}
      <div className={friendStyle.nonFriendWrapper}>
        <h3 className={friendStyle.nonFriendName}>{nonFriend.name}</h3>
        <button className={friendStyle.button} onClick={sendFriendRequest}>
          <Image
            height={40}
            className={friendStyle.addImage}
            src={addFriend}
            alt="add friend"
          ></Image>
        </button>
      </div>
    </article>
  );
};

export default NonFriend;
