import Router from 'express';
import steamSearch from '../helpers/steam-search';

const router = Router();

router.post('/search', (req, res, next) => {
    const term = req.body.term || '';
    steamSearch(term)
        .then((data) => res.json(data || []))
        .catch((err) => next(err));
});

export default router;
