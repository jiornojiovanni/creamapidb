(function script() {
    let searchController = null;

    const shakeCheckboxes = () => {
        document.querySelector('.checkbox-list').classList.add('error-shake');
        document.activeElement.blur();
    };

    const showLoadingScreen = (bool) => {
        const list = document.querySelector('#overlay').classList;
        if (bool) list.add('show'); else list.remove('show');
    };

    const showGameResults = (bool) => {
        const classes = document.querySelector('#game-list').classList;
        if (bool) classes.add('visible'); else classes.remove('visible');
    };

    const filterInput = (e) => {
        if (e.code === 'Enter' || e.target.innerText.length > 32) e.preventDefault();
    };

    const updateGameResults = (results = []) => {
        document.querySelector('#game-list > .not-found').style.display = (results.length === 0) ? 'flex' : 'none';
        document.querySelectorAll('#game-list > .result:not(.not-found)').forEach((e, i) => {
            e.style.display = results[i] ? 'flex' : 'none';
            if (!results[i]) return;
            e.dataset.appid = results[i].id;
            e.querySelector('.game-name').innerText = results[i].name;
            e.querySelector('.game-img > img').src = results[i].img;
        });
    };

    const queryOnKeyPress = (text) => {
        if (searchController) searchController.abort();
        searchController = new AbortController();
        fetch('/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ term: text }),
            signal: searchController.signal,
        })
            .then((res) => res.json())
            .then((json) => updateGameResults(json))
            .catch((err) => { if (err.name !== 'AbortError') console.error(err); });
    };

    const searchInput = (e) => {
        queryOnKeyPress(e.target.innerText);
        showGameResults(e.target.innerText.length !== 0);
    };

    const getParams = (DOMResult) => ({
        appid: DOMResult.dataset.appid,
        wrapper: document.querySelector('#wrapper').checked,
        dlcs: document.querySelector('#dlcs').checked,
    });

    const getReady = (appid) => new Promise((resolve, reject) => {
        fetch('/ready', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appid }),
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                resolve(json);
            })
            .catch((err) => reject(err));
    });

    const buildReq = (appid) => new Promise((resolve, reject) => {
        fetch('/build', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appid }),
        })
            .then((res) => res.json())
            .then((json) => {
                resolve(json);
            })
            .catch((err) => reject(err));
    });

    const downloadZip = (opts) => {
        fetch('/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(opts),
        })
            .then((res) => Promise.all([res.blob(), res.headers.get('content-disposition').match(/(?<=")(?:\\.|[^"\\])*(?=")/)[0]]))
            .then(([blob, file]) => {
                const a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = file;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch((err) => console.error(err));
    };

    const onClickResult = (e) => {
        const { appid, wrapper, dlcs } = getParams(e.currentTarget);
        if (!(wrapper || dlcs)) return shakeCheckboxes();
        getReady(appid)
            .then(({ readyToDownload }) => {
                if (readyToDownload) return { success: true };
                showLoadingScreen(true);
                return buildReq(appid);
            })
            .then(({ success }) => {
                showLoadingScreen(false);
                if (success) downloadZip({ appid, wrapper, dlcs });
            })
            .catch((err) => console.error(err));
        return null;
    };

    document.querySelector('.checkbox-list').addEventListener('animationend', (e) => e.target.classList.remove('error-shake'));
    document.querySelector('#search > .field').addEventListener('keypress', filterInput);
    document.querySelector('#search > .field').addEventListener('input', searchInput);
    document.querySelector('#search > .field').addEventListener('focusin', (e) => { showGameResults(e.target.innerText.length !== 0); });
    document.querySelectorAll('#game-list > .result:not(.not-found)').forEach((e) => {
        e.addEventListener('click', onClickResult);
        e.addEventListener('keypress', (k) => { if (k.code === 'Enter') onClickResult(k); });
    });
}());
