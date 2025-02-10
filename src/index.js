import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());


const mongoURI = "mongodb://root:root@mongodb:27017/starwars?authSource=admin";
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Encerra a aplicação se não conseguir conectar
  }
};

// Corrige o schema para incluir todos os campos necessários
const Film = mongoose.model("Film", {
  title: String,
  description: String, // Mudado de description para description para matching com o POST
  image_url: String,
  trailer_url: String,
});

app.get("/", async (req, res) => {
  try {
    const films = await Film.find();
    res.json(films);
  } catch (error) {
    console.error("Error fetching films:", error);
    res.status(500).json({ error: "Error fetching films" });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findById(id);

    if (!film) {
      return res.status(404).json({ error: "Film not found" });
    }

    res.json(film);
  } catch (error) {
    console.error("Error fetching film:", error);
    res.status(500).json({ error: "Error fetching film" });
  }
});


app.post("/", async (req, res) => {
  try {
    const { title, description, image_url, trailer_url } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const film = new Film({ title, description, image_url, trailer_url });
    await film.save();

    res.status(201).json(film);
  } catch (error) {
    console.error("Error creating film:", error);
    res.status(500).json({ error: "Error creating film" });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, trailer_url } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const film = await Film.findByIdAndUpdate(
      id, 
      {
         title, 
         description, 
         image_url, 
         trailer_url 
      }
    );

    res.status(200).json(film);
  } catch (error) {
    console.error("Error updating film:", error);
    res.status(500).json({ error: "Error updating film" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findByIdAndDelete(id);

    res.status(204).json({ message: "Film deleted" });
  } catch (error) {
    console.error("Error deleting film:", error);
    res.status(500).json({ error: "Error deleting film" });
  }
});

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
