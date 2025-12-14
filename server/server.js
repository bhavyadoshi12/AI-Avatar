require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/get-access-token', async (req, res) => {
    try {
        const { data } = await axios.post(
            'https://api.heygen.com/v1/streaming.create_token',
            {},
            { headers: { 'x-api-key': process.env.HEYGEN_API_KEY } }
        );
        res.json({ token: data.data.token });
    } catch (error) {
        console.error("HeyGen Token Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate HeyGen token' });
    }
});

app.post('/chat', async (req, res) => {
    const userText = req.body.text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!userText) return res.status(400).json({ error: "No text provided" });

    try {
        const modelName = 'gemini-flash-latest';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const response = await axios.post(
            url,
            {
                contents: [
                    {
                        parts: [
                            { text: `You are a helpful AI avatar. Answer in 1 sentence. User says: ${userText}` }
                        ]
                    }
                ]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const aiAnswer =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I couldn't think of an answer.";

        console.log("AI replied:", aiAnswer);
        res.json({ reply: aiAnswer });

    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.warn("⚠️ Rate Limit Hit. Sending polite refusal to avatar.");
            res.json({ reply: "I am receiving too many messages. Please give me 20 seconds to cool down." });
        } else {
            console.error("Google API Error:", error.response?.data || error.message);
            res.json({ reply: "I am having trouble connecting to the internet." });
        }
    } //
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
