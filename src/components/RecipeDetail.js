import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";

function RecipeDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [comment, setComment] = useState()
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // Pour le survol des étoiles
  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem(`comments_${id}`)) || []
  )
  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem("favoriteCategories")) || {}
  );
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const newComment = { text: comment, rating, date: new Date().toLocaleDateString() };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    setComment("");
    setRating(0);
  };

  const handleRatingClick = (rate) => {
    setRating(rate);
  };

  const addToFavorites = () => {
    if (!selectedCategory && !newCategory) {
      alert("Veuillez sélectionner ou créer une catégorie.");
      return;
    }

    const category = selectedCategory || newCategory;
    const updatedCategories = { ...categories };

    if (!updatedCategories[category]) {
      updatedCategories[category] = [];
    }

    updatedCategories[category].push({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
    });

    setCategories(updatedCategories);
    localStorage.setItem("favoriteCategories", JSON.stringify(updatedCategories));
    setNewCategory("");
    setSelectedCategory("");
    alert(`${meal.strMeal} ajouté à la catégorie "${category}"`);
  };

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

  const currentUrl = window.location.href;
 

  if (!meal) {
    return <p>Chargement des détails de la recette...</p>;
  }

  return (
    <div className="container">
      <h1 className="text-center my-4" style={{ color: "#2C7865" }}>
        {meal.strMeal}
      </h1>
      <div className="row">
        <div className="col-md-6">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h4 style={{ color: "#2C7865" }}>Catégorie : {meal.strCategory}</h4>
          <h4 style={{ color: "#2C7865" }}>Zone : {meal.strArea}</h4>
          <p style={{ color: "#2C7865" }}>
            <strong>Instructions :</strong>
          </p>
          <p style={{ color: "#2C7865" }}>{meal.strInstructions}</p>
        </div>
      </div>

      {/* Section vidéo tutoriel */}
      {meal.strYoutube && (
        <div className="my-4">
          <h3 style={{ color: "#2C7865" }}>Vidéo Tutoriel</h3>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              className="embed-responsive-item"
              src={`https://www.youtube.com/embed/${
                meal.strYoutube.split("v=")[1]
              }`}
              allowFullScreen
              title="Tutoriel vidéo"
              style={{ width: "100%", height: "400px" }}
            ></iframe>
          </div>
        </div>
      )}

      <div className="my-4">
        <h3 style={{ color: "#2C7865" }}>Partager cette recette</h3>
        <div className="d-flex">
          <FacebookShareButton url={currentUrl} quote={meal.strMeal}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={currentUrl} title={meal.strMeal}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <WhatsappShareButton url={currentUrl} title={meal.strMeal}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={currentUrl} title={meal.strMeal}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
        </div>
      </div>

      <h3 className="my-4" style={{ color: "#2C7865" }}>
        Ingrédients :
      </h3>
      <ul className="list-group">
        {Array.from({ length: 20 }, (_, i) => {
          const ingredient = meal[`strIngredient${i + 1}`];
          const measure = meal[`strMeasure${i + 1}`];
          return ingredient ? (
            <li
              key={i}
              className="list-group-item"
              style={{ color: "#2C7865" }}
            >
              {ingredient} - {measure}
            </li>
          ) : null;
        })}
      </ul>

      {/* Section pour ajouter aux favoris */}
      <div className="my-4">
        <h3 style={{ color: "#2C7865" }}>Ajouter aux Favoris</h3>
        <div className="mb-3">
          <label htmlFor="categorySelect" className="form-label" >
            Sélectionner une catégorie existante
          </label>
          <select
            id="categorySelect"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Sélectionner une catégorie</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="newCategory" className="form-label">
            Ou créer une nouvelle catégorie
          </label>
          <input
            type="text"
            id="newCategory"
            className="form-control"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>

        <button onClick={addToFavorites} className="btn btn-success">
          Ajouter aux Favoris
        </button>
      </div>

      {/* Commentaires et notes */}
      <h3 className="my-4" style={{ color: "#2C7865" }}>
        Commentaires et Notes
      </h3>
      <ul className="list-group mb-4">
        {comments.length > 0 ? (
          comments.map((c, index) => (
            <li key={index} className="list-group-item">
              <strong>
                {Array(c.rating)
                  .fill()
                  .map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} color="gold" />
                  ))}
              </strong>{" "}
              - {c.text} <br />
              <small>{c.date}</small>
            </li>
          ))
        ) : (
          <li className="list-group-item" style={{ color: "#2C7865" }}>
            Pas encore de commentaires.
          </li>
        )}
      </ul>

      {/* Formulaire de commentaire */}
      <form onSubmit={handleCommentSubmit}>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label" style={{ color: "#2C7865" }}>
            Ajouter un commentaire
          </label>
          <textarea
            id="comment"
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label" style={{ color: "#2C7865" }}>Donner une note</label>
          <div>
            {[1, 2, 3, 4, 5].map((rate) => (
              <FontAwesomeIcon
                key={rate}
                icon={faStar}
                color={rate <= (hoverRating || rating) ? "gold" : "gray"}
                onClick={() => handleRatingClick(rate)}
                onMouseEnter={() => setHoverRating(rate)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" >
          Soumettre
        </button>
      </form>

      <Link to="/" className="btn btn-secondary mt-4">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default RecipeDetail;
