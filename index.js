const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const steamcmd = require('steamcmd');
const path = require('path');
const db = require('./db');
const fs = require('fs');
const zipper = require('./zipbuilder');
const app = express();
const port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    //Controllo se l'id è vuoto, se contiene effettivamente un numero e se è solo una stringa di spazi vuoti
    if (req.body.id != '' && !isNaN(req.body.id) && !isNaN(parseFloat(req.body.id))) {
        let id = parseFloat(req.body.id);
        let checkID = await db.idExist(id);
        if (checkID == true) {
            let result = await db.getData(id);
            let filename = await zipper.buildZip(result.id, result.path);
            fs.stat(filename, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.download(__dirname + '/' + filename, (err) => {
                        if (err != null)
                            console.log(err);
                    });
                }
            });
        } else {
            let result = await steamcmd.getAppInfo(id);
            if (JSON.stringify(result) == '{}' || result.hasOwnProperty('config') == false) {
                res.status(404).send("Non ho trovato niente! <br> <a href=' / '>Ritenta</a>");
            } else {
                let name = getName(result);
                let execPath = getPath(result);
                res.send(`${id} < br > ${name} < br > ${execPath} <br>`)
                db.cacheId(id, name, execPath);
            }
        }
    } else {
        res.status(404).send("Hai inserito un ID non valido <br> <a href=' / '>Ritenta</a>");
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