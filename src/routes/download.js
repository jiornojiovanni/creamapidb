import Router from 'express';
import getZip from '../helpers/zip';
import { getGameInfo } from '../helpers/db';
import { ERRORS } from '../config/constants';
import { BadRequest, InternalError } from '../helpers/general-error';

const router = Router();

router.post('/download', (req, res, next) => {
    const appid = req.body.appid || null;
    const dlcs = req.body.dlcs === true || false;
    const wrapper = req.body.wrapper === true || false;
    if (appid === null || !(wrapper || dlcs)) return next(new BadRequest());
    getGameInfo(appid)
        .then((result) => {
            if (!result) throw Error(ERRORS.NOT_BUILT);
            return getZip(result, { dlcs, wrapper });
        })
        .then(({ path }) => res.download(path, `${appid}.zip`))
        .catch((err) => next(new InternalError()));
    return null;
});

router.get('/download', (req, res) => {
    res.redirect('/');
});

export default router;
