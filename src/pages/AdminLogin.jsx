// AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();

        // Check if token exists
        if (!data.token) {
          alert("Login failed: no token received");
          return;
        }

        localStorage.setItem("token", data.token);
        console.log("Token saved:", data.token);

        // Optional role check
        if (data.role !== "ADMIN") {
  alert("Access denied: You are not an admin.");
  navigate("/admin-login");
  return;
}


        alert("Welcome Admin!");
        navigate("/dashboard");
      } else {
        const text = await res.text();
        alert("Admin login failed: " + text);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed due to server error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
