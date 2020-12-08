import steamSearch from '../helpers/steam-search';
import Router from 'express';

const router = Router();

router.get('/search', (req, res) => {
    const term = req.query.term || '';
    steamSearch(term)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ error: 'Internal server error'});
            console.log(err);
        })
});

export default router;