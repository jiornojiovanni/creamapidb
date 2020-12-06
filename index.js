import dotenv from 'dotenv';
dotenv.config();
import express, { urlencoded } from 'express';
import { download as install, touch } from 'steamcmd';
import { join } from 'path';
import download from './src/routes/download';
import search from './src/routes/search'
import { connectDb } from './src/helpers/db';
import { ERRORS } from './src/config/constants';
const app = express();

const port = process.env.PORT || 3000;

app.set('views', join(__dirname, '/views'));
app.set('view engine', 'pug');
app.use(urlencoded({ extended: true }));

// GET Download
app.use(download);

//GET Search
app.use(search);

// GET Index
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    //We check if the steamcmd is working and is updated, if not we can just exit the process with error code as it would be useless to continue.
    install()
        .then(() => {
            return touch();
        })
        .then(() => {
            return connectDb();
        })
        .then(() => {
            console.log(`Server is listening on http://127.0.0.1:${port}`);
        })
        .catch((err) => {
            if (err.code = ERRORS.CONNECTION_REFUSED)
                console.log("The database can't be reached.");
            else
                console.log("SteamCMD can't be reached.");
            process.exit(0);
        });
});