import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';
import rateLimiter from 'express-rate-limit';
import https from 'https';
import fs from 'fs';
import download from './src/routes/download';
import search from './src/routes/search';
import ready from './src/routes/ready';
import build from './src/routes/build';
import checkServices from './src/utils/check';
import { ERRORS, RATE_LIMIT, HTTP_STATUS } from './src/config/constants';
import errorHandler from './src/middleware/error-handler';

dotenv.config();

const port = process.env.PORT || 3000;
const limiter = rateLimiter(RATE_LIMIT);

const app = express();
app.set('views', join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') return next();
    if (req.secure) {
        return next();
    }
    res.redirect(join('https://', req.hostname, req.url));
    return null;
});

app.use(limiter);
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
    res.status(HTTP_STATUS.NOT_FOUND.code).render('error-page', HTTP_STATUS.NOT_FOUND);
});

app.use(errorHandler);

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

const { key, cert } = {
    key: fs.readFileSync(`${process.env.CERTPATH}/privkey.pem`),
    cert: fs.readFileSync(`${process.env.CERTPATH}/fullchain.pem`),
};

if (process.env.NODE_ENV === 'production') {
    const httpsServer = https.createServer({ key, cert }, app);
    httpsServer.listen(443);
}
