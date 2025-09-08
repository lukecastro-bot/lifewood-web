// src/pages/AdminSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://lifewood-web.onrender.com/api/auth/signup-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Admin account created successfully!");
        navigate("/admin-login");
      } else {
        const text = await res.text();
        alert("Error: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed due to server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-green-600">
          Admin Signup
        </h2>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-700 transition"
        >
          Sign Up as Admin
        </button>
      </form>
    </div>
  );
}

export default AdminSignup;
