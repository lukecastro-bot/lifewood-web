import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, role: 1 }), // role=1 for normal login
    });

    if (res.ok) {
      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      alert(`Welcome ${user.username}!`);
      navigate("/"); // normal user home
    } else {
      const text = await res.text();
      alert("Login failed: " + text);
    }
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4cc8f]">
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" required />
        <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className="border p-2 w-full rounded" required />
        <button type="submit" className="bg-[#3b7a57] text-white py-2 w-full rounded hover:bg-[#ff914d] transition">Login</button>
      </form>
    </div>
  );
}

export default Login;
