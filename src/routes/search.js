import Router from 'express';
import steamSearch from '../helpers/steam-search';

const router = Router();

router.post('/search', (req, res) => {
    const term = req.body.term || '';
    steamSearch(term)
        .then((data) => res.json(data || []))
        .catch(() => res.json({ error: 'Internal server error' }));
});

export default router;
