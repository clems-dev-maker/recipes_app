import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mealsPerPage] = useState(6);
  const [likedMeals, setLikedMeals] = useState(
    JSON.parse(localStorage.getItem("likedMeals")) || []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await axios.get("https://www.themealdb.com/api/json/v1/1/categories.php");
      setCategories(result.data.categories);
    };
    fetchCategories();
  }, []);

  const searchMeals = async (term, category) => {
    try {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`;
      if (category) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      }
      const response = await axios.get(url);
      setMeals(response.data.meals);
    } catch (error) {
      console.error("Erreur lors de la récupération des recettes :", error);
    }
  };

  useEffect(() => {
    searchMeals(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);

  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = meals ? meals.slice(indexOfFirstMeal, indexOfLastMeal) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleLike = (meal) => {
    let updatedLikedMeals;
    if (likedMeals.some((m) => m.idMeal === meal.idMeal)) {
      updatedLikedMeals = likedMeals.filter((m) => m.idMeal !== meal.idMeal);
    } else {
      updatedLikedMeals = [...likedMeals, meal];
    }
    setLikedMeals(updatedLikedMeals);
    localStorage.setItem("likedMeals", JSON.stringify(updatedLikedMeals));
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Application de Recettes</h1>

      {/* Barre de recherche */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher une recette..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-4">
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.idCategory} value={category.strCategory}>
              {category.strCategory}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des recettes */}
      <div className="row">
        {currentMeals ? currentMeals.map((meal) => (
          <div key={meal.idMeal} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={meal.strMealThumb} className="card-img-top" alt={meal.strMeal} />
              <div className="card-body">
                <h5 className="card-title">{meal.strMeal}</h5>
                <div className="d-flex justify-content-between">
                  <Link to={`/recipe/${meal.idMeal}`} className="btn btn-primary">
                    Voir les détails
                  </Link>
                  <button
                    className={`btn ${likedMeals.some((m) => m.idMeal === meal.idMeal) ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => toggleLike(meal)}
                  >
                    {likedMeals.some((m) => m.idMeal === meal.idMeal) ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : <p>Aucune recette trouvée.</p>}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center" style={{marginBottom: "15px"}}>
        {Array.from({ length: Math.ceil((meals ? meals.length : 0) / mealsPerPage) }, (_, i) => (
          <button key={i + 1} className="btn btn-outline-primary mx-1" onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
