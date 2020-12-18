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
    TOO_MANY_REQUESTS: {
        code: 429,
        message: 'too many requests',
    }
};

const RATE_LIMIT = {
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: HTTP_STATUS.TOO_MANY_REQUESTS,
}

export {
    STEAM,
    ERRORS,
    HTTP_STATUS,
    RATE_LIMIT,
};
