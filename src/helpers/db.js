import mongoose from 'mongoose';
import GameData from '../models/GameData';

export const connectDb = () => new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        resolve();
    }).catch((err) => {
        reject(err);
    });
});

export const cacheGameInfo = ({ id, name, path }) => new Promise((resolve, reject) => {
    GameData.create({ id, name, path })
        .then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
});

export const getGameInfo = (id) => new Promise((resolve, reject) => {
    GameData.find({ id })
        .then(({ result }) => {
            resolve(result);
        })
        .catch((err) => {
            reject(err);
        });
});
