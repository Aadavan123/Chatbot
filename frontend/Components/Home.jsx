import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../src/assets/Home.css';
import backgroundVideo from '../src/assets/home1.mp4'; // Import the video

const Home = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://localhost:3000/api/auth/login/getUserName', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUserName(response.data.name); // Assuming the backend sends { name: 'UserName' }
        })
        .catch(error => {
          console.error('Failed to fetch user name', error);
        });
    }
  }, []);

  return (
    <div className="home-container">
      <video autoPlay muted loop className="home-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>Hello {userName ? userName : 'Guest'}, Welcome to GAIL Chatbot</h1>
        <p className="tagline">Empowering Seamless Employee Experience</p>
        <p className="description">
          Discover an intuitive platform designed to provide GAIL employees with instant access to HR policies, IT support, company events, and much more. Your journey to efficiency starts here.
        </p>
        <div className="buttons">
          <Link to="/signup" className="signup-button">Sign Up</Link>
          <Link to="/login" className="login-button">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
