const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const steamcmd = require("steamcmd");
const path = require("path");
const db = require("./db");

const app = express();
const port = process.env.PORT || 3000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", async (req, res) => {
    //Controllo se l'id è vuoto, se contiene effettivamente un numero e se è solo una stringa di spazi vuoti
    if (req.body.id != "" && !isNaN(req.body.id) && !isNaN(parseFloat(req.body.id))) {
        let checkID = await db.idExist(req.body.id);
        if (checkID == true) {
            let result = await db.getData(req.body.id);
            res.send(`${result.id} <br> ${result.name} <br> ${result.path} <br>`)
        } else {
            let result = await steamcmd.getAppInfo(req.body.id);
            if (JSON.stringify(result) == "{}") {
                res.status(404).send("Non ho trovato niente! <br> <a href='/'>Ritenta</a>");
            } else {
                let name = getName(result);
                let gamepath = getPath(result);
                res.send(`${req.body.id} <br> ${name} <br> ${gamepath} <br>`)
                db.cacheId(req.body.id, name, gamepath);
            }
        }
    } else {
        res.status(404).send("Non ho trovato niente! <br> <a href='/'>Ritenta</a>");
    }
});

app.listen(port, () => {
    steamcmd.download()
        .then(() => {
            steamcmd.touch();
        });
    console.log(`Server is listening on http://127.0.0.1:${port}`);
});

function getPath(json) {
    let i = 0;
    while (json["config"]["launch"].hasOwnProperty(i.toString()) == false)
        i++;
    return json["config"]["launch"][i.toString()]["executable"].replace(/\\\\/g, '\\');
}

function getName(json) {
    return json["common"]["name"];
}