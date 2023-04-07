import profile from "../../public/icons/profile.svg";
import { useState, useEffect } from "react";
import styles from "../styles/home.module.scss";
import Link from "next/link";
import logo from "../../public/Logo/chiplogo.webp";
import save from "../../public/icons/save.svg";

const editProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [picture, setPicture] = useState(null);

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
    if (userData.image_url === "pending") {
      setPicture(profile);
    } else {
      setPicture(userData.image_url);
    }
    setIsLoading(false);
  }, [userData]);

  return (
    <>
      {isLoading && <h1>loading!!!!!</h1>}
      {!isLoading && (
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href="/">
              <Image src={logo} alt="Logo" width={150} height={150} />
            </Link>
            <Link href="/edit-profile" className={styles.headingwrapper}>
              <h1 className={styles.heading}>Edit Profile</h1>
              <Image
                src={save}
                height={40}
                alt="settings"
                className={styles.settingsimg}
              />
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default editProfile;
