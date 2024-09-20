import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function RecipeDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        setMeal(response.data.meals[0]);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la recette :", error);
      }
    };

    fetchMealDetails();
  }, [id]);

  if (!meal) {
    return <p>Chargement des détails de la recette...</p>;
  }

  return (
    <div className="container">
      <h1 className="text-center my-4">{meal.strMeal}</h1>
      <div className="row">
        <div className="col-md-6">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h4>Catégorie : {meal.strCategory}</h4>
          <h4>Zone : {meal.strArea}</h4>
          <p><strong>Instructions :</strong></p>
          <p>{meal.strInstructions}</p>
        </div>
      </div>
      
      <h3 className="my-4">Ingrédients :</h3>
      <ul className="list-group">
        {Array.from({ length: 20 }, (_, i) => {
          const ingredient = meal[`strIngredient${i + 1}`];
          const measure = meal[`strMeasure${i + 1}`];
          return ingredient ? (
            <li key={i} className="list-group-item">{ingredient} - {measure}</li>
          ) : null;
        })}
      </ul>
      
      <Link to="/" className="btn btn-secondary mt-4">Retour à l'accueil</Link>
    </div>
  );
}

export default RecipeDetail;
