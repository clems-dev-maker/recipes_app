import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Favorites() {
  const [likedMeals, setLikedMeals] = useState(
    JSON.parse(localStorage.getItem("likedMeals")) || []
  );
  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem("favoriteCategories")) || {}
  );

  const removeRecipe = (category, idMeal) => {
    const updatedCategories = { ...categories };
    updatedCategories[category] = updatedCategories[category].filter(
      (recipe) => recipe.idMeal !== idMeal
    );
    if (updatedCategories[category].length === 0) {
      delete updatedCategories[category];
    }
    setCategories(updatedCategories);
    localStorage.setItem("favoriteCategories", JSON.stringify(updatedCategories));
  };

  useEffect(() => {
    setLikedMeals(JSON.parse(localStorage.getItem("likedMeals")) || []);
  }, []);

  return (
    <div className="container">
      <h1 className="my-4" style={{color: "#2C7865"}}>Mes Favoris</h1>
      {Object.keys(categories).length > 0 ? (
        Object.keys(categories).map((category) => (
          <div key={category} className="mb-4">
            <h3 style={{color: "#2C7865"}}>{category}</h3>
            <div className="row">
              {categories[category].map((recipe) => (
                <div key={recipe.idMeal} className="col-md-4">
                  <div className="card mb-3">
                    <img src={recipe.strMealThumb} alt={recipe.strMeal} className="card-img-top" />
                    <div className="card-body">
                      <h5 className="card-title" style={{color: "#2C7865"}}>{recipe.strMeal}</h5>
                      <Link to={`/recipe/${recipe.idMeal}`} className="btn btn-primary">
                        Voir la recette
                      </Link>
                      <button
                        onClick={() => removeRecipe(category, recipe.idMeal)}
                        className="btn btn-danger ms-2"
                      >
                        Retirer des favoris
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Aucune recette favorite pour l'instant.</p>
      )}
    </div>
  );
}

export default Favorites;
