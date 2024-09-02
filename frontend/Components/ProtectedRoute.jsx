import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ element }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/api/auth/login/validateToken', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          if (response.status === 200) {
            setLoading(false); // Token is valid, stop loading
          } else {
            localStorage.removeItem('token');
            navigate('/login');
          }
        })
        .catch(error => {
          console.error('Token validation failed', error);
          localStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Add a spinner or custom loading component here
  }

  return element;
}

export default ProtectedRoute;
