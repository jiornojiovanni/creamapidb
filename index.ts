import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Cream API DB!");
});

app.listen(port, () => {
    return console.log(`Server is listening on http://127.0.0.1:${port}`);
});