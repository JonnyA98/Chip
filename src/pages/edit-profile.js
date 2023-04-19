import profile from "../../public/icons/profile.svg";
import { useState, useEffect } from "react";
import styles from "../styles/home.module.scss";
import Link from "next/link";
import logo from "../../public/Logo/Logo.svg";
import save from "../../public/icons/save.svg";
import backarrow from "../../public/icons/backarrow.svg";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";

const editProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [picture, setPicture] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [uploadModal, setUploadModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);

  const [interest, setInterest] = useState("");
  const [interestList, setInterestList] = useState(null);

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

  useEffect(() => {
    const getUserInterests = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/users/interests/${userData.id}`
        );
        setInterestList(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserInterests();
  }, [userData]);

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
        setTimeout(() => {
          setUploadModal(false);
        }, 2000);
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

  const addInterest = () => {
    if (interest.trim() !== "") {
      setInterestList([...interestList, { interest }]);
      setInterest("");
    }
  };

  const removeInterest = (index) => {
    setInterestList(interestList.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    const authToken = sessionStorage.getItem("authToken");
    const id = userData.id;

    try {
      await axios.put(
        "http://localhost:3001/api/users/update",
        {
          id,
          interests: interestList,
          image_url: url || userData.image_url,
        },
        {
          headers: { authorisation: `Bearer ${authToken}` },
        }
      );
      setSaveModal(true);
      setTimeout(() => {
        setSaveModal(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Chip</title>
      </Head>
      {isLoading && <h1>loading!!!!!</h1>}
      {!isLoading && (
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link className={styles.logosmall} href={`/profile/${userData.id}`}>
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
          <article>
            <div className={styles.hero}>
              <div>
                <h1 className={styles.subHeading}>Edit Profile</h1>
              </div>
              <p className={styles.about}>
                This is how you will appear to other users.
              </p>
            </div>
            <div className={styles.ppwrapper}>
              <div className={styles.imgWrapper}>
                <Image
                  className={styles.pp}
                  src={picture}
                  alt="profile picture"
                  height={100}
                  width={100}
                />
              </div>
              <div className={styles.fileUploadWrapper}>
                <input
                  onChange={uploadImage}
                  type="file"
                  id="file-upload"
                  hidden
                />
                <label htmlFor="file-upload" className={styles.ppbutton}>
                  Edit
                </label>
              </div>
            </div>
            <h2 className={styles.subsubHeading}>Your interests :</h2>
            <div className={styles.textbox}>
              <article className={styles.interestwrapper}>
                <ul className={styles.interestList}>
                  {interestList &&
                    interestList.map((item, index) => (
                      <li key={index} className={styles.interestItem}>
                        {item.interest}
                        <button
                          className={styles.removeInterestButton}
                          onClick={() => removeInterest(index)}
                        >
                          X
                        </button>
                      </li>
                    ))}
                </ul>

                <div className={styles.textContainer}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Enter a new interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  />
                  <button className={styles.addbutton} onClick={addInterest}>
                    +
                  </button>
                </div>
              </article>
            </div>
            <footer className={styles.footer}>
              <button
                onClick={handleSaveChanges}
                className={styles.footerwrapper}
              >
                <h1 className={styles.footertext}>Save changes</h1>
              </button>
            </footer>
          </article>
        </div>
      )}
      {uploadModal && (
        <div className={styles.modalwrapper}>
          <article className={styles.modal}>
            <h2>Upload Successful!</h2>
          </article>
        </div>
      )}
      {saveModal && (
        <div className={styles.modalwrapper}>
          <article className={styles.modal}>
            <h2>Changes Saved ✅</h2>
          </article>
        </div>
      )}
    </>
  );
};

export default editProfile;
