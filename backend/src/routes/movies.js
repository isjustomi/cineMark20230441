import express from "express";
import moviesController from "../controllers/moviesController.js";
import multer from "multer";

// Router() nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

// Configuración de multer para guardar archivos en la carpeta "public/"
const upload = multer({ dest: "public/" });

router
  .route("/")
  .get(moviesController.getMovie)
  .post(upload.single("image"), moviesController.insertMovie);

router
  .route("/:id")
  .put(upload.single("image"), moviesController.updateMovie) // Agrega multer aquí
  .delete(moviesController.deleteMovie);

export default router;
