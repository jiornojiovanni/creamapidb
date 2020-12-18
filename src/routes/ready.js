import Router from 'express';
import { getGameInfo } from '../helpers/db';
import BadRequest from '../errors/bad-request';

const router = Router();

router.post('/ready', (req, res, next) => {
    const appid = req.body.appid || null;
    if (appid === null) return next(new BadRequest());
    getGameInfo(appid)
        .then((doc) => res.status(200).json({ appid, readyToDownload: doc != null }))
        .catch((err) => next(err));
    return null;
});

router.get('/ready', (req, res) => {
    res.redirect('/');
});

export default router;
