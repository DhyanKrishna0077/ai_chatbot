// Load environment variables FIRST
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const api_Key = process.env.OPENAI_API_KEY;
if (!api_Key) {
    console.error("❌ OpenAI API key not found. Make sure .env file is in the same folder as index.js");
    process.exit(1);
}

console.log("✅ Loaded OpenAI key:", api_Key.slice(0, 10) + "..."); // Log first 10 chars for confirmation

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "*" })); // Allow frontend requests

const openai = new OpenAI({ apiKey: api_Key });

app.post("/chat", async (req, res) => {
    let { searchData } = req.body;
    console.log("Incoming prompt:", searchData);

    // Add strict JSON instruction
    searchData += ` Respond ONLY with valid JSON in this format:
    {
        "questions": [
            {
                "question": "What does HTML stand for?",
                "options": [
                    "Hypertext Markup Language",
                    "High Text Machine Language",
                    "Hyperloop Text Machine Learning",
                    "None of the above"
                ],
                "answer": "a",
                "explanation": "HTML stands for HyperText Markup Language."
            }
        ]
    }`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0613",
            messages: [{ role: "user", content: searchData }],
            temperature: 1,
            max_tokens: 1000
        });

        let rawContent = response?.choices?.[0]?.message?.content || "";
        console.log("GPT raw response:", rawContent);

        // Try parsing JSON
        let questions = [];
        try {
            const parsed = JSON.parse(rawContent);
            questions = parsed?.questions || [];
        } catch (err) {
            console.warn("JSON parse failed. Trying extraction...");
            const start = rawContent.indexOf("{");
            const end = rawContent.lastIndexOf("}");
            if (start !== -1 && end !== -1 && end > start) {
                try {
                    const parsed = JSON.parse(rawContent.substring(start, end + 1));
                    questions = parsed?.questions || [];
                } catch (err2) {
                    console.error("Extraction failed:", err2);
                    return res.status(500).json({ error: "Failed to parse AI response. Try again." });
                }
            } else {
                return res.status(500).json({ error: "Invalid response format from AI. Try again." });
            }
        }

        if (!questions.length) {
            return res.status(500).json({ error: "No questions generated. Try a different subject or level." });
        }

        return res.status(200).json({ questions });

    } catch (error) {
        console.error("Error fetching from OpenAI:", error);

        // Log OpenAI API errors
        if (error.response) {
            console.error("OpenAI error details:", {
                status: error.response.status,
                data: error.response.data
            });
        }

        // Map errors to readable messages
        let message = "Failed to fetch from OpenAI.";
        if (error.response?.status === 401) message = "Invalid or missing OpenAI API key.";
        else if (error.response?.status === 429) message = "OpenAI rate limit reached. Try again later.";
        else if (error.response?.status >= 500) message = "OpenAI server error. Try again later.";

        return res.status(500).json({ error: message });
    }
});

// Start server
const port = 8081;
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
