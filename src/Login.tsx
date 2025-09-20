import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // for redirecting after login

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Example login logic
    if (username === "admin" && password === "reportforadmin321") {
      // Save credentials to localStorage
      localStorage.setItem("admin", username);
      localStorage.setItem("adminpassword", password);

      setError("");
      // Redirect to report page
      navigate("/report");
    } else {
      setError("Invalid username or password");
    }
    if (username === "nhanvien" && password === "mamaramen321") {
      // Save credentials to localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);

      setError("");
      // Redirect to report page
      navigate("/kitchen");
    } else {
      setError("Invalid username or password");
    }
  };
      if (username === "cashier" && password === "ramenabc147") {
      // Save credentials to localStorage
      localStorage.setItem("cashier", username);
      localStorage.setItem("cashierpassword", password);

      setError("");
      // Redirect to report page
      navigate("/billing");
    } else {
      setError("Invalid username or password");
    }
  };

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          Login
        </h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
