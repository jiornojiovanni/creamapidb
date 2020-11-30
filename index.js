const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const steamcmd = require('steamcmd');
const fsPromises = require('fs').promises;
const path = require('path');
const db = require('./db');
const zipper = require('./zipbuilder');
const steam = require('./steamsearch');
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
    //Redirect if there is no id in the link.
    res.redirect('/');
});

app.get('/download/:id', async (req, res) => {
    const id = parseFloat(req.params.id);
    if (Number.isInteger(id) && !isNaN(id) && id != null) {
        const checkID = await db.idExist(id);
        //If the id exists in the DB we can query it so it's much faster.
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
            //Otherwise we have to query the steam api, suuuuuper slow.
            const result = await steamcmd.getAppInfo(id);
            //Some game are missing fundamental information in their json (e.g. CSGO).
            if (JSON.stringify(result) == '{}' || result.hasOwnProperty('config') == false) {
                res.status(404).send("Non ho trovato niente! <br> <a href='/'>Ritenta</a>");
            } else {
                let name = getName(result);
                let execPath = getPath(result);
                //Cache the data in the db, so we can use it in subsequent search, no need to await it.
                db.cacheData(id, name, execPath);
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
        //Catch all malformed id (e.g. if the user try to directly input the id in the link).
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
    const tmpPath = await zipper.buildZip(id, path);
    //We check if file exists before returning it as Archiver lib is a bit bugged.
    await fsPromises.stat(tmpPath);
    return tmpPath;
}