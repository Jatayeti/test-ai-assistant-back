require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRoutes = require("./routes/todoRoutes");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 3000;
const OPENAI_MODEL = process.env.OPENAI_MODEL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

app.get("/session", async (req, res) => {
    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                voice: "sage",
                instructions: "Speak Russian only. Say Hello first",
            }),
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "Failed to create session" });
    }
});

app.post("/webrtc-offer", async (req, res) => {
    try {
        const { sdp } = req.body;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ error: "Authorization header missing or invalid" });
        }
        const ephemeralKey = authHeader.split(" ")[1];

        const sdpResponse = await fetch("https://api.openai.com/v1/realtime", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${ephemeralKey}`,
                "Content-Type": "application/sdp",
            },
            body: sdp,
        });

        if (!sdpResponse.ok) {
            const errorText = await sdpResponse.text();
            return res.status(500).json({ error: "Failed to process SDP with OpenAI", details: errorText });
        }

        const answerSdp = await sdpResponse.text();
        res.json({ type: "answer", sdp: answerSdp });
    } catch (error) {
        console.error("Error in /webrtc-offer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/weather", async (req, res) => {
    const { location } = req.query;
    if (!location) {
        return res.status(400).json({ error: "Location is required" });
    }
    try {
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!weatherResponse.ok) {
            const errorText = await weatherResponse.text();
            return res.status(500).json({ error: "Failed to fetch weather data", details: errorText });
        }
        const weatherData = await weatherResponse.json();
        const weatherInfo = {
            location: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
        };
        res.json(weatherInfo);
    } catch (error) {
        console.error("Error fetching weather:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/search", async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }
    try {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TAVILY_API_KEY}`,
            },
            body: JSON.stringify({ query, num_results: 5 }),
        });
        if (!response.ok) {
            throw new Error("Tavily API error");
        }
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to fetch search results" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
