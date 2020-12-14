import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';
import download from './src/routes/download';
import search from './src/routes/search';
import ready from './src/routes/ready';
import build from './src/routes/build';
import checkServices from './src/utils/check';
import { ERRORS } from './src/config/constants';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
const port = process.env.PORT || 3000;

const app = express();
app.set('views', join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use('/public', express.static(join(__dirname, '/views/public')));
app.use(express.json());
app.use(ready);
app.use(build);
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
            console.log(`Web server is listening at port ${port}.`);
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
