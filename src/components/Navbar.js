import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

function Navbar({ darkMode, setDarkMode}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/" style={{color: "#2C7865"}}>
          Mes Recettes
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{color: "#2C7865"}}>
                Accueil
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/favorites" style={{color: "#2C7865"}}>
                Favoris
              </Link>
            </li>
            <li className="nav-item">
            <button
                  className="btn btn-outline-light"
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                >
                  <FontAwesomeIcon icon={darkMode ? faSun : faMoon} style={{ marginRight: "8px" }} />
                  {darkMode ? "Mode Clair" : "Mode Sombre"}
                </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
