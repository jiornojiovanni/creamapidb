import Router from 'express';
import getZipInfo from '../helpers/zip-builder';
import getAppData from '../utils/getAppData';

const router = Router();

router.get('/download/:id', (req, res) => {
    const id = parseInt(req.params.id, 10) || null;
    const dlcs = req.query.dlcs === '1' || false;
    const wrapper = req.query.wrapper === '1' || false;
    if (id == null || !Number.isInteger(id) || !(wrapper || dlcs)) {
        res.status(400).render('error-page', { code: 400, message: 'bad request' });
        return;
    }
    getAppData(id)
        .then((result) => getZipInfo(result, { dlcs, wrapper }))
        .then(({ path, name }) => {
            res.download(path, `${name.toLowerCase()}.zip`);
        })
        .catch((err) => {
            res.status(500).render('error-page', { code: 500, message: 'internal server error' });
            console.error(err);
        });
});

router.get('/download', (req, res) => {
    res.redirect('/');
});

export default router;
