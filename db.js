const { Client } = require('pg');

exports.idExist = async function (id) {
    const client = new Client();
    await client.connect();
    const res = await client.query(`select exists(select 1 from gamedata where id=${id}) as value`);
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
}

exports.getData = async function (id) {
    const client = new Client();
    await client.connect();
    const res = await client.query(`select id, name, path from gamedata where id=${id}`);
    return {
        id: res.rows[0].id,
        name: res.rows[0].name,
        path: res.rows[0].path
    };
}