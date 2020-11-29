const { Client } = require('pg');
const path = require('path');
const { exec } = require('child_process');

exports.idExist = async (id) => {
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

<<<<<<< HEAD
exports.cacheId = async (id, name, execPath) => {
=======
exports.cacheId = async function (id, name, execPath) {
    let execParsed = path.win32.parse(execPath);
    //Rimpiazza il separatore di windows con quello di unix, e se necessario toglie lo slash iniziale
    let gamepath = (execParsed.root == execParsed.dir) ? '/' : '/' + execParsed.dir.replace(/\\/g, '/').replace(/^\//g, '') + '/';
>>>>>>> c60c89ef0c44cd11ce54cfaafd4033899f917444
    const client = new Client();
    await client.connect();
    try {
        await client.query(`insert into gamedata(id, name, path) values ('${id}', '${name}', '${this.escapePath(execPath)}')`);
    } catch (err) {
        console.log(err)
    }
    client.end();
}

exports.getData = async (id) => {
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

exports.escapePath = (execPath) => {
    const execParsed = path.win32.parse(execPath);
    //Rimpiazza il separatore di windows con quello di unix, e se necessario toglie lo slash iniziale
    const gamepath = (execParsed.root == execParsed.dir) ? '/' : '/' + execParsed.dir.replace(/\\/g, '/').replace(/^\//g, '') + '/';
    return gamepath;
}