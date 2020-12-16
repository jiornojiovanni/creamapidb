import Router from 'express';
import { getGameInfo } from '../helpers/db';

const router = Router();

router.post('/ready', (req, res) => {
    const appid = req.body.appid || null;
    if (appid === null) return res.status(400).json({ code: 400, message: 'Bad request.' });
    getGameInfo(appid)
        .then((doc) => res.status(200).json({ appid, readyToDownload: doc || false }))
        .catch((err) => res.status(500).json({ code: 500, message: err.message }));
    return null;
});

router.get('/ready', (req, res) => {
    res.redirect('/');
});

export default router;
