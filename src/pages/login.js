import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  const router = useRouter();

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMessage("You must provide a username and a password");
      return;
    }

    try {
      const { data } = await axios.post(`http://localhost:3001/api/user`, {
        email: loginEmail,
        password: loginPassword,
      });
      sessionStorage.setItem("authToken", data.authToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error.response);
      setErrorMessage(error.response.data.message);
    }
  };

  const getUserDetails = async () => {
    const authToken = sessionStorage.getItem("authToken");
    try {
      const { data } = await axios.get(`http://localhost:3001/api/user`, {
        headers: {
          authorisation: `Bearer ${authToken}`,
        },
      });
      setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoggedIn) {
    getUserDetails().then(() =>
      router.push({
        pathname: "/profile",
        query: { userId: userData.id },
        state: userData,
      })
    );
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={loginHandler}>
        <input
          onChange={(e) => setLoginEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="email@example.com"
        />
        <input
          onChange={(e) => setLoginPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="password"
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
