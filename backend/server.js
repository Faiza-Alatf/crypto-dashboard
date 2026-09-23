const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Crypto Dashboard Backend is running"
    });
});

app.get("/api/crypto", async (req, res) => {
    try {
        const url = new URL(
            "https://pro-api.coinmarketcap.com/v3/cryptocurrency/listings/latest"
        );

        url.search = new URLSearchParams({
            start: "1",
            limit: "20",
            convert: "USD",
        }).toString();

        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error("API Error:", error);

        res.status(500).json({
            error: "Failed to fetch cryptocurrency data"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});