import getDLClist from './dlc';

const getCreamINI = (appid, dlc) => {
    let text =
        '[steam]\n' +
        `appid = ${appid}\n` +
        'unlockall = true\n' +
        'orgapi = steam_api_o.dll\n' +
        'orgapi64 = steam_api64_o.dll\n' +
        'extraprotection = false\n' +
        'forceoffline = false\n' +
        '[steam_misc]\n' +
        'disableuserinterface = false\n' +
        '[dlc]';

    return getDLClist(appid)
        .then((res) => {
            if (dlc == 'false') return text;
            res.forEach(element => {
                text += "\n" + element;
            });
            return text;
        });
}

export default getCreamINI;