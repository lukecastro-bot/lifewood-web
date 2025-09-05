import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
 const [formData, setFormData] = useState({
  username: "",
  email: "",
  password: "",
  role: 1, // force normal user role
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        const text = await res.text();
        alert("Error: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4cc8f]">
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="border p-2 w-full rounded" required />
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" required />
        <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className="border p-2 w-full rounded" required />
        <select name="role" value={formData.role} onChange={handleChange} className="border p-2 w-full rounded">
          <option value={1}>User</option>
          <option value={2}>Admin</option>
        </select>
        <button type="submit" className="bg-[#3b7a57] text-white py-2 w-full rounded hover:bg-[#ff914d] transition">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
