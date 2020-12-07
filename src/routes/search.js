import getSteamSearch from '../helpers/steam-search';
import Router from 'express';

const router = Router();

router.get('/search', (req, res) => {
    getSteamSearch(req.query.term)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ error: 'Internal server error'});
            console.log(err);
        })
});

export default router;