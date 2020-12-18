import Router from 'express';
import { getGameInfo } from '../helpers/db';
import { BadRequest, InternalError } from '../helpers/general-error';

const router = Router();

router.post('/ready', (req, res) => {
    const appid = req.body.appid || null;
    if (appid === null) return next(new BadRequest());
    getGameInfo(appid)
        .then((doc) => res.status(200).json({ appid, readyToDownload: doc || false }))
        .catch((err) => next(new InternalError()));
    return null;
});

router.get('/ready', (req, res) => {
    res.redirect('/');
});

export default router;
