import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const authToken = sessionStorage.getItem("authToken");
      try {
        const { data } = await axios.get("http://localhost:3001/api/user", {
          headers: { authorisation: `Bearer ${authToken}` },
        });
        setUserData(data);
        setIsLoading(false);
      } catch {}
    };
    getUserData();
  }, []);

  return (
    <>
      {isLoading && <h1>LOADING...</h1>}
      {!isLoading && <h1>hello {userData.name} !</h1>}
    </>
  );
};

export default Profile;
