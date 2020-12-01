const { Client } = require('pg');
const path = require('path');

exports.checkDB = async () => {
    try {
        await client.connect();
        client.end();
    } catch (err) {
        if (err.code = "ECONNREFUSED") {
            console.log("The database is not on, idiot.");
            process.exit(0);
        }
        console.log(err);
    }
}

exports.idExist = async (id) => {
    const client = new Client();
    let res;
    try {
        await client.connect();
        res = await client.query(`select exists(select 1 from gamedata where id=${id}) as value`);
    } catch (err) {
        if (err.code = "ECONNREFUSED") {
            console.log("The database is not on, idiot.");
            process.exit(0);
        }
        console.log(err);
    }
    client.end();
    return res.rows[0].value;
};

exports.cacheData = async (id, name, execPath) => {
    const client = new Client();
    try {
        await client.connect();
        await client.query(`insert into gamedata(id, name, path) values ('${id}', '${name}', '${this.escapePath(execPath)}')`);
    } catch (err) {
        if (err.code = "ECONNREFUSED") {
            console.log("The database is not on, idiot.");
            process.exit(0);
        }
        console.log(err);
    }
    client.end();
}

exports.getData = async (id) => {
    const client = new Client();
    let res;
    try {
        await client.connect();
        res = await client.query(`select id, name, path from gamedata where id=${id}`);
    } catch (err) {
        if (err.code = "ECONNREFUSED") {
            console.log("The database is not on, idiot.");
            process.exit(0);
        }
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
    //Replace Windows separator with Unix one, and add slash at the start of the string if necessary.
    const gamepath = (execParsed.root == execParsed.dir) ? '/' : '/' + execParsed.dir.replace(/\\/g, '/').replace(/^\//g, '') + '/';
    return gamepath;
}