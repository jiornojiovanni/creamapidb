import { Client } from 'pg';

export const checkDb = function checkDatabase() {
    const client = new Client();
    return new Promise((resolve, reject) => {
        client.connect()
            .then(() => {
                client.end();
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    });
}

export const cacheData = function cacheData(id, name, execPath) {
    const client = new Client();
    return new Promise((resolve, reject) => {
        client.connect()
            .then(() => {
                return client.query(`insert into gamedata(id, name, path) values ('${id}', '${name}', '${execPath}')`);
            })
            .then(() => {
                client.end();
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    });
}

export const getGameData = function getData(id) {
    const client = new Client();
    return new Promise((resolve, reject) => {
        client.connect()
            .then(() => {
                return client.query(`select id, name, path from gamedata where id=${id}`);
            })
            .then(({ rows }) => {
                client.end();
                resolve(rows[0]);
            })
            .catch((err) => {
                reject(err);
            })
    });
}