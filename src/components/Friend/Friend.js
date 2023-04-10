import friendStyle from "./Friend.module.scss";
import profile from "../../../public/icons/profile.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const Friend = ({ friend, allUsers, userData }) => {
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

  const getGifts = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:3001/api/gifts/reciever/${friend.id}`,
        { userId: userData.id }
      );

      setGifts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGifts();
  }, []);

  return (
    <article className={friendStyle.friendCard}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Image
          height={50}
          width={50}
          className={friendStyle.image}
          src={picture}
          alt="profile pic"
        />
      )}
      <div className={friendStyle.friendWrapper}>
        <h3 className={friendStyle.friendName}>{friend.name}</h3>
        <div className={friendStyle.giftWrapper}>
          <h3 className={friendStyle.giftHeading}>Current Gifts</h3>
          {gifts &&
            gifts.map((gift) => {
              const sender = allUsers.find(
                (user) => user.id === gift.sender_id
              );

              return (
                <Link
                  className={friendStyle.giftlink}
                  key={gift.id}
                  href={`/gift/${gift.id}`}
                >
                  <article
                    className={
                      gift.has_contributed || userData.id === gift.sender_id
                        ? friendStyle.contributed
                        : friendStyle.nonContributed
                    }
                  >
                    <h4>
                      {" "}
                      <span className={friendStyle.giftTitle}>
                        {gift.title}{" "}
                      </span>
                      started by {sender.name}
                    </h4>
                  </article>
                </Link>
              );
            })}
        </div>
        {gifts && !gifts.length && (
          <p className={friendStyle.none}>
            There are no gifts for your friend,{" "}
            <Link
              className={friendStyle.start}
              href={`/creategift/${friend.id}`}
            >
              start one!
            </Link>
          </p>
        )}
      </div>
    </article>
  );
};

export default Friend;
