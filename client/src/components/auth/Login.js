import React, { useState, useContext } from "react";
import { UserContext } from "../../context/userContext"; // State Manajemen
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

// import useMutation from react-query
import { useMutation } from "react-query";

// Get API config
import { API } from "../../config/api";

export const Login = () => {
  const navigate = useNavigate();


  const [state, dispatch] = useContext(UserContext); // useContext

  const [message, setMessage] = useState(null);

  // Create variabel for store data with useState
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // dikeluarkan
  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // convert data menjadi string, untuk dikirim ke database
      const body = JSON.stringify(form);

      // Insert data user to database
      const response = await API.post("/login", body, config);
      console.log(response);

      // Checking Process
      if (response?.status === 200) {
        // Send data to useContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data, // data disimpan ke payload
        });
      }

      if (response.data.data.status === "admin") {
        navigate("/complain");
      } else {
        navigate("/");
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1 text-center">
          <span className="blink">Failed</span>
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  });

  return (
    <>
      <div className="card-auth p-4">
        <h3 className="mb-3">Login</h3>
        {message}
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div class="mb-3 form">
            <input type="email" placeholder="Email" name="email" onChange={handleChange} value={email} required />
          </div>
          <div class="mb-3 form">
            <input type="password" placeholder="Password" name="password" onChange={handleChange} value={password} required />
          </div>
          <div className="d-grid">
            <button className="btn-danger">Login</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;