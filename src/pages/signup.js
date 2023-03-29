import { useState } from "react";

const Signup = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  return (
    <div>
      <h1>Register</h1>
      <form action="">
        <input
          onChange={(e) => setRegisterUsername(e.target.value)}
          type="text"
          name="username"
          placeholder="username"
        />
        <input
          onChange={(e) => setRegisterPassword(e.target.value)}
          type="text"
          name="password"
          placeholder="password"
        />
        <input
          onChange={(e) => setRegisterEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="email@example.com"
        />

        <button type="submit"></button>
      </form>
    </div>
  );
};

export default Signup;
