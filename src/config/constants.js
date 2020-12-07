const STEAM = {
    SEARCH: {
        URL: "https://store.steampowered.com/search/results",
        OPTIONS: (query) => { return { category1: "998", term: query } }
    },
    MAX_RESULTS: 5
}

const ERRORS = {
    CONNECTION_REFUSED: "ECONNREFUSED",
    MISSING_DATA: "Missing config in game infos."
}

export {
    STEAM,
    ERRORS
}