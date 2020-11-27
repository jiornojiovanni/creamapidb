const { Client } = require('pg');
const path = require('path');
const { exec } = require('child_process');

exports.idExist = async function (id) {
    const client = new Client();
    let res;
    await client.connect();
    try {
        res = await client.query(`select exists(select 1 from gamedata where id=${id}) as value`);
    } catch (err) {
        console.log(err);
    }
    client.end();
    return res.rows[0].value;
};

exports.cacheId = async function (id, name, execPath) {
    let execParsed = path.win32.parse(execPath);
    //Rimpiazza il separatore di windows con quello di unix, e se necessario toglie lo slash iniziale
    let gamepath = (execParsed.root == execParsed.dir) ? '/' : '/' + execParsed.dir.replace(/\\/g, '/').replace(/^\//g, '') + '/';
    const client = new Client();
    await client.connect();
    try {
        await client.query(`insert into gamedata(id, name, path) values ('${id}', '${name}', '${gamepath}')`);
    } catch (err) {
        console.log(err)
    }
    client.end();
}

exports.getData = async function (id) {
    const client = new Client();
    let res;
    await client.connect();
    try {
        res = await client.query(`select id, name, path from gamedata where id=${id}`);
    } catch (err) {
        console.log(err);
    }
    client.end();
    return {
        id: res.rows[0].id,
        name: res.rows[0].name,
        path: res.rows[0].path
    };
}

/* Useless ):

exports.searchText = async function (text) {
    const client = new Client();
    let res;
    await client.connect();
    try {
        res = await client.query(`select name from gamedata
                                    where to_tsvector(name) @@ to_tsquery('${escapeText(text)}')`);
    } catch (err) {
        console.log(err);
    }
    client.end();
    let arrayRes = [];
    let rows = (res.rowCount > 5) ? 5 : res.rowCount;
    for (let i = 0; i < rows; i++) {
        arrayRes.push({ name: res.rows[i].name });
    }
    return arrayRes;
}

function escapeText(text) {
    return text.trim().replace(/ +(?= )/g, '').replace(/[^\w\s]/gi, '').replace(/ /g, "|");
}

*/