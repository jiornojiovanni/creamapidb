const { Client } = require('pg');

exports.idExist = async function (id) {
    const client = new Client();
    let res;
    await client.connect();
    try {
        res = await client.query(`select exists(select 1 from gamedata where id=${id}) as value`);
    } catch (err) {
        console.log(err);
    }
    console.log(res)
    client.end();
    return res.rows[0].value;
};

exports.cacheId = async function (id, name, path) {
    const client = new Client();
    await client.connect();
    try {
        await client.query(`insert into gamedata(id, name, path) values ('${id}', '${name}', '${path}')`);
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

exports.getResults = async function (text) {
    const client = new Client();
    let res;
    await client.connect();
    try {
        res = await client.query(`select name from gamedata 
                                    where to_tsvector(name) @@ to_tsquery(${escapeText(text)})`);
    } catch (err) {
        console.log(err);
    }
    client.end();
    let arrayRes = {};
    let rows = (res.rowCount > 5) ? 5 : res.rowCount;
    for (let i = 0; i < rows; i++) {
        arrayRes[i] = {
            name: res.rows[i].name
        }
    }
    return arrayRes;
}

function escapeText(text) {
    return text.trim().replace(/ +(?= )/g, '').replace(/[^\w\s]/gi, '').replace(/ /g, "|");
}