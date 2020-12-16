import Router from 'express';
import getZip from '../helpers/zip';
import { getGameInfo } from '../helpers/db';
import { ERRORS } from '../config/constants';

const router = Router();

router.post('/download', (req, res) => {
    const appid = req.body.appid || null;
    const dlcs = req.body.dlcs === true || false;
    const wrapper = req.body.wrapper === true || false;
    if (appid === null || !(wrapper || dlcs)) return res.status(400).json({ code: 400, message: 'Bad request.' });
    getGameInfo(appid)
        .then((result) => {
            if (!result) throw Error(ERRORS.NOT_BUILT);
            return getZip(result, { dlcs, wrapper });
        })
        .then(({ path }) => res.download(path, `${appid}.zip`))
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ code: 500, message: err.message });
        });
    return null;
});

router.get('/download', (req, res) => {
    res.redirect('/');
});

export default router;
