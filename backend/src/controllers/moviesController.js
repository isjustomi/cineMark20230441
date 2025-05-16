//Array de metodos (C R U D)
const moviesController = {};
import moviesModel from "../models/movies.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";


//1- Configurar cloudinary con nuestra cuenta
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret
})

// SELECT
moviesController.getMovie = async (req, res) => {
  const movies = await moviesModel.find();
  res.json(movies); 
};

// INSERT
moviesController.insertMovie = async (req, res) => {
  try {
      const { title, description, director, genre, year, duration } = req.body;
      let imageURL = "";

      // Verificar campos requeridos
      if (!title || !description || !director || !genre || !year || !duration) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Subir la imagen a Cloudinary
      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "public",
              allowed_formats: ["png", "jpg", "jpeg"],
          });
          imageURL = result.secure_url;
      }

      // Guardar todo en la base de datos
      const newMovie = new moviesModel({ title, description, director, genre, year, duration, image: imageURL });
      await newMovie.save();

      res.status(201).json({ message: "Movie saved", movie: newMovie });
  } catch (error) {
      console.error("Error in insertMovie:", error);
      res.status(500).json({ message: "An error occurred while saving the movie", error: error.message });
  }
};


// DELETE
moviesController.deleteMovie = async (req, res) => {
  const deleteMovie = await moviesModel.findByIdAndDelete(req.params.id);
  if (!deleteMovie) {
    return res.status(404).json({ message: "Movie not found "});
  }
  res.json({ message: "Movie deleted" });
};


// UPDATE
moviesController.updateMovie = async (req, res) => {
  try {
      // Verifica si req.body está definido
      if (!req.body) {
          return res.status(400).json({ message: "Request body is required" });
      }

      const { title, description, director, genre, year, duration } = req.body;

      if (!title || !description || !director || !genre || !year || !duration) {
          return res.status(400).json({ message: "All fields are required" });
      }

      let imageURL = "";

      // Subir la nueva imagen a Cloudinary si existe
      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "public",
              allowed_formats: ["png", "jpg", "jpeg"],
          });
          imageURL = result.secure_url;

          // Eliminar el archivo temporal
          fs.unlink(req.file.path, (err) => {
              if (err) console.error("Error deleting temp file:", err);
          });
      }

      // Actualizo
      const updatedMovie = await moviesModel.findByIdAndUpdate(
          req.params.id,
          {
              title,
              description,
              director,
              genre,
              year,
              duration,
              ...(imageURL && { image: imageURL }) // Solo actualiza el campo image si hay una nueva URL
          },
          { new: true }
      );

      if (!updatedMovie) {
          return res.status(404).json({ message: "Movie not found" });
      }

      // Muestro un mensaje que todo se actualizó
      res.json({ message: "Movie updated", movie: updatedMovie });
  } catch (error) {
      console.error("Error in updateMovie:", error);
      res.status(500).json({ message: "An error occurred while updating the movie", error: error.message });
  }
};


export default moviesController;
