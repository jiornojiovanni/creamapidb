import express, { json } from "express";
import dotenv from "dotenv";
import steamcmd from "steamcmd";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    if(req.body.id != null) {
        steamcmd.getAppInfo(req.body.id)
            .then( (result) => {
                if(JSON.stringify(result) == "{}") {
                    res.status(404).send("Non ho trovato niente! <br> <a href='/'>Ritenta</a>");                   
                } else {
                    res.json(result);
                }
            });
    }
});

app.listen(port, () => {
    steamcmd.download()
        .then( () => {
            steamcmd.touch();
        });
    console.log(`Server is listening on http://127.0.0.1:${port}`);
});