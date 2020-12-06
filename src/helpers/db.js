import { Client } from 'pg';

export const connectDb = function connectDb() {
    const client = new Client();
    return new Promise((resolve, reject) => {
        client.connect()
            .then(() => {
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
                resolve(rows[0]);
            })
            .catch((err) => {
                reject(err);
            })
    });
}