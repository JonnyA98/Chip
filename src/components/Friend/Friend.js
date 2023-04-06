import friendStyle from "./Friend.module.scss";
import profile from "../../../public/icons/profile.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const Friend = ({ friend, allUsers }) => {
  const [picture, setPicture] = useState(null);
  const [gifts, setGifts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (friend.image_url === "pending") {
      setPicture(profile);
    } else {
      setPicture(friend.image_url);
    }
    setIsLoading(false);
  }, [friend]);

  const showCurrentGifts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/gifts/reciever/${friend.id}`
      );
      setGifts(data);
    } catch (error) {}
  };

  useEffect(() => {
    showCurrentGifts();
  }, []);

  return (
    <article className={friendStyle.friend}>
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
      <div className={friendStyle.friend__wrapper}>
        <h3 className={friendStyle.friend__name}>{friend.name}</h3>
        <div className={friendStyle.friend__wrapper}>
          <h3 className={friendStyle.friend__name}>Current Gifts</h3>
          {gifts &&
            gifts.map((gift) => {
              const sender = allUsers.find(
                (user) => user.id === gift.sender_id
              );

              return (
                <Link key={gift.id} href={`/gift/${gift.id}`}>
                  <article className={friendStyle.smallgift}>
                    <h4>
                      {gift.title} started by {sender.name}
                    </h4>
                  </article>
                </Link>
              );
            })}
        </div>
        {gifts && !gifts.length && (
          <p>
            There are no gifts for your friend,{" "}
            <Link href={`/creategift/${friend.id}`}>start one!</Link>
          </p>
        )}
      </div>
    </article>
  );
};

export default Friend;
