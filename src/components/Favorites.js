import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Favorites() {
  const [likedMeals, setLikedMeals] = useState(
    JSON.parse(localStorage.getItem("likedMeals")) || []
  );

  useEffect(() => {
    setLikedMeals(JSON.parse(localStorage.getItem("likedMeals")) || []);
  }, []);

  return (
    <div className="container">
      <h1 className="text-center my-4">Mes Recettes Favorites</h1>
      <div className="row">
        {likedMeals.length > 0 ? (
          likedMeals.map((meal) => (
            <div key={meal.idMeal} className="col-md-4 mb-4">
              <div className="card h-100">
                <img src={meal.strMealThumb} className="card-img-top" alt={meal.strMeal} />
                <div className="card-body">
                  <h5 className="card-title">{meal.strMeal}</h5>
                  <Link to={`/recipe/${meal.idMeal}`} className="btn btn-primary">
                    Voir les détails
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Aucune recette favorite pour le moment.</p>
        )}
      </div>
    </div>
  );
}

export default Favorites;
