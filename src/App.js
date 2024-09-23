import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import RecipeDetail from './components/RecipeDetail';
import Favorites from './components/Favorites';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {

  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);


  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
