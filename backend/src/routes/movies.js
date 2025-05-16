import express from "express";
import moviesController from "../controllers/moviesController.js";
import movies from "../models/movies.js";
// Router() nos ayuda a colocar los metodos
// que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(moviesController.getMovie)
  .post(moviesController.insertMovie);

router
  .route("/:id")
  .put(moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

export default router;
