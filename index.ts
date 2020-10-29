import express from "express";
import dotenv from "dotenv";
import steamcmd from "steamcmd";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
    if(req.query.id != null) {
        steamcmd.getAppInfo(req.query.id)
            .then( result => {
                res.send(result);
            });
    } else {
        res.send("Inserisci un id");
    }
});

app.listen(port, () => {
    steamcmd.download().then( () => {
        steamcmd.touch();
    });
    console.log(`Server is listening on http://127.0.0.1:${port}`);
});