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
    NOT_BUILT: 'Build is required.',
    ALREADY_BUILT: 'Already built.',
    MISSING_DATA: 'Missing config in game infos.',
    STEAMCMD_ERROR: 'SteamCMD is not working.',
    DATABASE_ERROR: 'Database is not working.',
};

const HTTP_STATUS = {
    NOT_FOUND: {
        code: 404,
        message: 'not found',
    },
    INTERNAL_ERROR: {
        code: 500,
        message: 'internal server error',
    },
    BAD_REQUEST: {
        code: 400,
        message: 'bad request',
    },
};

export {
    STEAM,
    ERRORS,
    HTTP_STATUS,
};
