import profile from "../../public/icons/profile.svg";
import { useState, useEffect } from "react";
import styles from "../styles/home.module.scss";
import Link from "next/link";
import logo from "../../public/Logo/chiplogo.webp";
import save from "../../public/icons/save.svg";
import axios from "axios";

import Image from "next/image";

const editProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [picture, setPicture] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [uploadModal, setUploadModal] = useState(false);
  const [color, setColor] = useState("");
  const [interest, setInterest] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const authToken = sessionStorage.getItem("authToken");
      try {
        const { data } = await axios.get("http://localhost:3001/api/user", {
          headers: { authorisation: `Bearer ${authToken}` },
        });
        setUserData(data);

        if (data.image_url !== "pending") {
          setPicture(data.image_url);
        } else {
          setPicture(profile);
        }
        setIsLoading(false);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  function uploadSingleImage(base64) {
    setImageLoading(true);
    axios
      .post("http://localhost:3001/api/uploadimage", { image: base64 })
      .then((res) => {
        setUrl(res.data);
        setPicture(res.data);
        setUploadModal(true);
      })
      .then(() => setImageLoading(false))
      .catch(console.log);
  }

  const uploadImage = async (event) => {
    const files = event.target.files;
    console.log(files.length);

    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      uploadSingleImage(base64);
      return;
    }
  };

  const handleSaveChanges = async () => {
    const authToken = sessionStorage.getItem("authToken");
    const id = userData.id;

    try {
      await axios.put(
        "http://localhost:3001/api/user/update",
        {
          id,
          color,
          interest,
          image_url: url || userData.image_url,
        },
        {
          headers: { authorisation: `Bearer ${authToken}` },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <h1>loading!!!!!</h1>}
      {!isLoading && (
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href="/">
              <Image src={logo} alt="Logo" width={150} height={150} />
            </Link>
            <button
              onClick={handleSaveChanges}
              className={styles.headingwrapper}
            >
              <h1 className={styles.heading}>Save changes</h1>
              <Image
                height={40}
                alt="settings"
                className={styles.saveimg}
                src={save}
              />
            </button>
          </nav>
          <article>
            <div className={styles.nav}>
              <h1 className={styles.subHeading}>Edit Profile</h1>
              <div className={styles.ppwrapper}>
                <Image
                  className={styles.pp}
                  src={picture}
                  alt="profile picture"
                  height={100}
                  width={100}
                />
                <div className={styles.pphover}>
                  <div className={styles.fileUploadWrapper}>
                    <input
                      onChange={uploadImage}
                      type="file"
                      id="file-upload"
                      hidden
                    />
                    <label htmlFor="file-upload" className={styles.ppbutton}>
                      Choose File
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.textbox}>
              <p>Personalise your profile</p>
              <div className={styles.textContainer}>
                <label htmlFor="color" className={styles.header_small}>
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  className={styles.inputField}
                  placeholder="Enter new color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />

                <label htmlFor="interest" className={styles.header_small}>
                  Interest
                </label>
                <input
                  type="text"
                  id="interest"
                  className={styles.inputField}
                  placeholder="Enter a new interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                />
              </div>
            </div>
          </article>
        </div>
      )}
      {uploadModal && (
        <div className={styles.modalWrapper}>
          <article>
            <h2>Upload Successful!</h2>
          </article>
        </div>
      )}
    </>
  );
};

export default editProfile;
