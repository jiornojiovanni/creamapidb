import { Client } from 'pg';

let client;

export const connectDb = () => {
    return new Promise((resolve, reject) => {
        client = new Client();
        client.connect()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    });
}

export const cacheGameInfo = ({ id, name, path }) => {
    return new Promise((resolve, reject) => {
        client.query(`insert into gamedata(id, name, path) values ('${id}', '${name}', '${path}')`)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    });
}

export const getGameInfo = (id) => {
    return new Promise((resolve, reject) => {
        client.query(`select id, name, path from gamedata where id=${id}`)
            .then(({ rows }) => {
                resolve(rows[0] || null);
            })
            .catch((err) => {
                reject(err);
            })
    });
}