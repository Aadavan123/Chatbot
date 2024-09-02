import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../src/assets/Login.css'; 
import backgroundVideo from '../src/assets/chat1.mp4';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(localStorage.getItem('isOtpSent') === 'true' || false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(10); // 10 seconds timer for resend OTP
  const navigate = useNavigate();

  useEffect(() => {
    if (isOtpSent) {
      startResendTimer(); // Start the timer if OTP was sent
    }
  }, [isOtpSent]);

  const startResendTimer = () => {
    setIsResendDisabled(true);
    setResendTimer(10);

    const timerInterval = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerInterval);
          setIsResendDisabled(false);
          return 10;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/login/sendOtp', { email });
      setIsOtpSent(true);
      localStorage.setItem('isOtpSent', 'true'); // Persist OTP sent state
      localStorage.setItem('email', email); // Persist email for use after refresh
      startResendTimer();
      toast.success('OTP sent to your email!');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to send OTP. Please try again.');
      console.error('Failed to send OTP', error);
    }
  };

  const handleResendOtp = () => {
    sendOtp(); // Resend OTP
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isOtpSent) {
        // Verify OTP and login
        const response = await axios.post('http://localhost:3000/api/auth/login/login', { email, password, otp });
        localStorage.removeItem('isOtpSent');
        localStorage.removeItem('email');
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true); // Update the authentication state
        toast.success('Login successful!');
        navigate('/choosechat'); // Navigate to the choosechat page
      } else {
        // Send OTP
        sendOtp();
      }
    } catch (error) {
      toast.error(error.response?.data || 'Login failed. Please check your credentials or OTP.');
      console.error('Login failed', error);
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="home-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-form-wrapper">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {isOtpSent && (
            <>
              <label>OTP:</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              <button type="button" onClick={handleResendOtp} disabled={isResendDisabled}>
                {isResendDisabled ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
              </button>
            </>
          )}
          <button type="submit" className="submit-button">{isOtpSent ? 'Verify OTP and Login' : 'Send OTP'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
