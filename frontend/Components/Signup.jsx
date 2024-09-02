import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../src/assets/Signup.css'; 
import backgroundVideo from '../src/assets/chat1.mp4';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(10); // 10 seconds timer for resend OTP
  const navigate = useNavigate();

  // Check if the user already exists in the database
  useEffect(() => {
    const checkUserExistence = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/signup/checkUser', {
          email,
          mobileNumber
        });

        if (response.data.exists) {
          toast.info('You have already signed up. Redirecting to login...');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking user existence', error);
      }
    };

    if (email || mobileNumber) {
      checkUserExistence();
    }
  }, [email, mobileNumber, navigate]);

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
      const response = await axios.post('http://localhost:3000/api/auth/signup/sendOtp', { mobileNumber });

      if (response.status === 200) {
        toast.success('OTP sent successfully!');
        setIsOtpSent(true);
        startResendTimer(); // Start the resend timer
      } else {
        toast.error(response.data || 'Failed to send OTP.');
      }
    } catch (error) {
      toast.error(error.response?.data || 'Failed to send OTP. Please try again.');
      console.error('OTP send failed', error);
    }
  };

  const handleResendOtp = () => {
    sendOtp(); // Send a new OTP when Resend button is clicked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpSent) {
      // Send OTP
      if (name && email && mobileNumber && password) {
        sendOtp();
      } else {
        toast.error('Please fill in all the required fields before sending OTP.');
      }
    } else {
      // Verify OTP and complete signup
      try {
        const response = await axios.post('http://localhost:3000/api/auth/signup/CreateUser', {
          name,
          email,
          mobileNumber,
          password,
          otp
        });

        if (response.status === 201) {
          localStorage.setItem('isSignedUp', 'true'); // Set signup status in localStorage
          toast.success('Signup successful! Redirecting to login...');
          navigate('/login'); // Redirect to Login after signup
        } else {
          toast.error(response.data || 'Signup failed due to invalid OTP.');
        }
      } catch (error) {
        toast.error(error.response?.data || 'Signup failed. Please try again.');
        console.error('Signup failed', error);
      }
    }
  };

  return (
    <div className="signup-container">
      <video autoPlay muted loop className="home-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="signup-form-wrapper">
        <h2 className="signup-title">Signup</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Mobile Number: (Like +91 12345 67890)</label>
          <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
          {isOtpSent && (
            <>
              <label>OTP:</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              <button type="button" onClick={handleResendOtp} disabled={isResendDisabled}>
                {isResendDisabled ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
              </button>
            </>
          )}
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="submit-button">
            {isOtpSent ? 'Verify OTP and Signup' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
