(function () {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status === 200) {
            updateGameResults(JSON.parse(this.responseText));
        } else console.log('Request failed.  Returned status of ' + this);
    };

    var filterInput = (e) => {
        if (e.code === 'Enter' || e.target.innerText.length > 32) e.preventDefault();
    };

    var searchInput = (e) => {
        queryOnKeyPress(e.target.innerText);
        showGameResults(e.target.innerText.length !== 0);
    };

    var queryOnKeyPress = (text) => {
        xhr.open('GET', `/search?term=${encodeURI(text)}`);
        xhr.send();
    };

    var updateGameResults = (results = []) => {
        document.querySelector('#game-list > .not-found').style.display = (results.length == 0) ? 'flex' : 'none';
        document.querySelectorAll('#game-list > .result:not(.not-found)').forEach((e, i) => {
            e.style.display = results[i] ? 'flex' : 'none';
            if (!results[i]) return;
            e.appid = results[i].id;
            e.querySelector('.game-name').innerText = results[i].name;
            e.querySelector('.game-img > img').src = results[i].img;
        });
    };

    var showGameResults = (bool) => {
        let classes = document.querySelector('#game-list').classList;
        bool ? classes.add('visible') : classes.remove('visible');
    };

    var onClickResult = (e) => {
        var params = {};
        if (document.querySelector('#wrapper').checked) params.wrapper = true;
        if (document.querySelector('#dlcs').checked) params.dlcs = true;
        if (Object.keys(params).length === 0) {
            document.querySelector('.checkbox-list').classList.add('error-shake');
            document.activeElement.blur();
            return;
        }
        let appid = e.currentTarget.appid;
        window.location.href = `/download/${appid}?${new URLSearchParams(params).toString()}`;
    };

    document.querySelector('.checkbox-list').addEventListener('animationend', (e) => e.target.classList.remove('error-shake'));
    document.querySelector('#search > .field').addEventListener('keypress', filterInput);
    document.querySelector('#search > .field').addEventListener('input', searchInput);
    document.querySelector('#search > .field').addEventListener('focusin', (e) => { showGameResults(e.target.innerText.length !== 0); });
    document.querySelectorAll('#game-list > .result:not(.not-found)').forEach((e) => {
        e.addEventListener('click', onClickResult);
        e.addEventListener('keypress', (e) => { if (e.code === 'Enter') onClickResult(e); });
    });
})()
