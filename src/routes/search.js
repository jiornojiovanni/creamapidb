import Router from 'express';
import steamSearch from '../helpers/steam-search';

const router = Router();

router.get('/search', (req, res) => {
    const term = req.query.term || '';
    steamSearch(term)
        .then((data) => { return res.json(data || []); })
        .catch((err) => {
            return res.json({ error: 'Internal server error' });
        });
});

export default router;
