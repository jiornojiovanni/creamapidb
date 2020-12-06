import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { join } from 'path';
import download from './src/routes/download';
import search from './src/routes/search';
import checkServices from './src/helpers/check';
const app = express();

const port = process.env.PORT || 3000;

app.set('views', join(__dirname, '/views'));
app.set('view engine', 'pug');

// GET Download
app.use(download);

//GET Search
app.use(search);

// GET Index
app.get('/', (req, res) => {
    res.render('index');
});

checkServices()
    .then(() => {
        app.listen(port, () => {
            console.log("Server is listening at http://localhost:" + port);
        });
    })
    .catch((err) => { process.exit(err); });