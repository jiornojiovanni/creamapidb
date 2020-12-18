import Router from 'express';
import steamSearch from '../helpers/steam-search';
import { InternalError } from '../helpers/general-error';

const router = Router();

router.post('/search', (req, res) => {
    const term = req.body.term || '';
    steamSearch(term)
        .then((data) => res.json(data || []))
        .catch(() => next(new InternalError()));
});

export default router;
