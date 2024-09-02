import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../Components/Home';
import Login from '../Components/Login';
import Signup from '../Components/Signup';
import ProtectedRoute from '../Components/ProtectedRoute';
import ChatInterface from '../Components/choosechat';
import IndividualChat from '../Components/IndividualChat'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/choosechat" /> : <Home />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/choosechat" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/signup" 
          element={<Signup />} 
        />
        <Route 
          path="/protected" 
          element={<ProtectedRoute element={<Home />} />} 
        />
        <Route 
          path="/choosechat" 
          element={<ProtectedRoute element={<ChatInterface />} />} 
        />
        <Route 
          path="/individualchat" 
          element={<ProtectedRoute element={<IndividualChat />} />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
