import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';
import download from './src/routes/download';
import search from './src/routes/search';
import checkServices from './src/helpers/check';
import { ERRORS } from './src/config/constants';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

const port = process.env.PORT || 3000;

app.set('views', join(__dirname, '/views'));
app.set('view engine', 'pug');
app.use('/public', express.static(join(__dirname, '/views/public')));

app.use(download);
app.use(search);

app.get('/', (req, res) => {
    res.render('game-search');
});

app.use((req, res) => {
    res.status(404).render('error-page', { code: 404, message: 'not found' });
});

checkServices()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        if (err.message === ERRORS.DATABASE_ERROR) {
            process.exit(0);
        }
        if (err.message === ERRORS.STEAMCMD_ERROR) {
            process.exit(-1);
        }
    });
