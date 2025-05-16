//Array de metodos (C R U D)
const moviesController = {};
import moviesModel from "../models/movies.js";

// SELECT
moviesController.getMovie = async (req, res) => {
  const movies = await moviesModel.find();
  res.json(products);
};

// INSERT
moviesController.insertMovie = async (req, res) => {
    const { title, description, director, genre, year, duration } = req.body;
    let imageURL = "";
  
    //Subir la imagen a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["png", "jpg", "jpeg"],
      });
      //Guardo en la variable la URL de donde se subió la imagen
      imageURL = result.secure_url;
    }
  
    //Guardar todo en la base de datos
    const newMovie = new moviesModel({ title, description, director, genre, year, duration, image: imageURL });
    await newMovie.save();
  
    res.json({ message: "Movie saved" });
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
    // Solicito todos los valores
    const { title, description, director, genre, year, duration } = req.body;
    let imageURL = "";
  
    // Subir la nueva imagen a Cloudinary si existe
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["png", "jpg", "jpeg"],
      });
      // Guardo en la variable la URL de donde se subió la imagen
      imageURL = result.secure_url;
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
  };
  

export default moviesController;
