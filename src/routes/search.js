import getSteamSearch from '../helpers/steam-search';
import Router from 'express';

const router = Router();

router.get('/search', (req, res) => {
    getSteamSearch(req.query.term)
        .then((data) => {
            res.json({ data: data });
        })
        .catch((err) => {
            console.log(err);
            res.json({});
        })
});

export default router;