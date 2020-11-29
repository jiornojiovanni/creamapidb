const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const steamcmd = require('steamcmd');
const path = require('path');
const db = require('./db');
const steam = require('./steamsearch');
const fsPromises = require('fs').promises;
const zipper = require('./zipbuilder');
const app = express();
const port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.render('index');
});

app.post('/search', async (req, res) => {
    try {
        const data = await steam.getSteamSearch(req.body.text);
        res.render('result', { data: data, query: req.body.text });
    } catch (error) {
        res.send("Error with the search query.");
    }
});

app.get('/download', (req, res) => {
    res.redirect('/');
});

app.get('/download/:id', async (req, res) => {
    const id = parseFloat(req.params.id);
    if (Number.isInteger(id) && !isNaN(id) && id != null) {
        const checkID = await db.idExist(id);
        if (checkID == true) {
            const result = await db.getData(id);
            try {
                const zipPath = await getZipPath(result.id, result.path);
                res.download(zipPath, result.name + '.zip');
            } catch (error) {
                console.log(error);
                res.status(400).send("Errore durante la creazione del file zip.");
            }
        } else {
            let result = await steamcmd.getAppInfo(id);
            if (JSON.stringify(result) == '{}' || result.hasOwnProperty('config') == false) {
                res.status(404).send("Non ho trovato niente! <br> <a href='/'>Ritenta</a>");
            } else {
                let name = getName(result);
                let execPath = getPath(result);
                db.cacheId(id, name, execPath);
                try {
                    const zipPath = await getZipPath(id, db.escapePath(execPath));
                    res.download(zipPath, name + '.zip');
                } catch (error) {
                    console.log(error);
                    res.status(400).send("Errore durante la creazione del file zip.");
                }
            }
        }
    } else {
        res.status(404).send("ID Non valido.");
    }
});

app.listen(port, async () => {
    await steamcmd.download();
    await steamcmd.touch();
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

async function getZipPath(id, path) {
    let tmpPath = await zipper.buildZip(id, path);
    await fsPromises.stat(tmpPath);
    return tmpPath;
}