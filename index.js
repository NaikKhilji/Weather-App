import express from "express";  
import dotenv from "dotenv";
import path from "path";        
import { fileURLToPath } from "url";
import axios from "axios";  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const API_KEY = process.env.WEATHER_API_KEY;  

const weatherBackgrounds = {  
    Clear: "clear.jpg",
    Clouds: "cloudy.jpg",
    Rain: "rainy.jpg",
    Drizzle: "drizzle.jpg",
    Thunderstorm: "storm.jpg",
    Snow: "snowy.jpg",
    Mist: "mist.jpg",
    Haze: "mist.jpg",
    Fog: "mist.jpg",
    Default: "default.jpg"
};

// Default home route
app.get("/", (req, res) => {
    res.render("index", { weatherData: null, bgImage: "default.jpg", icon: null });
});

app.post("/", async (req, res) => {
    console.log("City searched:", req.body.city);
    
    const city = req.body.city;
    if (!city) {
        return res.render("index", { weatherData: null, bgImage: "default.jpg", icon: null });
    }

    const apiKey = API_KEY;  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;
        const condition = weatherData.weather[0].main;
        const bgImage = weatherBackgrounds[condition] || "default.jpg";
        const icon = weatherData.weather[0].icon;

        res.render("index", { weatherData, bgImage, icon });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.render("index", { weatherData: null, bgImage: "default.jpg", icon: null });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
