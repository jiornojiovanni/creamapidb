import Router from 'express';
import getZipInfo from '../helpers/zip-builder';
import getAppData from '../utils/getAppData';

const router = Router();

router.get('/download/:id', (req, res) => {
    const id      = parseInt(req.params.id) || null;
    const dlcs    = req.query.dlcs == 1 || false;
    const wrapper = req.query.wrapper == 1 || false;
    if (id == null || !Number.isInteger(id) || !(wrapper || dlcs)) res.end();
    getAppData(id)
        .then((result) => {
            return getZipInfo(result, { dlcs, wrapper });
        })
        .then(({ path, name }) => {
            res.download(path, `${name.toLowerCase()}.zip`);
        })
        .catch((err) => {
            res.end()
            console.error(err);
        });
});

router.get('/download', (req, res) => {
    res.redirect('/');
});

export default router;