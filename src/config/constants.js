const STEAM = {
    SEARCH: {
        URL: 'https://store.steampowered.com/search/results',
        OPTIONS: (query) => ({ category1: '998', term: query }),
    },
    DLCS: {
        URL: 'https://store.steampowered.com/api/appdetails',
        OPTIONS: (query) => ({ appids: query }),
    },
    MAX_RESULTS: 5,
};

const ERRORS = {
    MISSING_DATA: 'Missing config in game infos.',
    STEAMCMD_ERROR: 'SteamCMD is not working.',
    DATABASE_ERROR: 'Database is not working.',
};

export {
    STEAM,
    ERRORS,
};
