import { useState } from "react";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  return (
    <div>
      <h1>Login</h1>
      <form action="">
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
      </form>
    </div>
  );
};

export default Login;
