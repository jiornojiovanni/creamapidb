import mongoose from 'mongoose';
import GameData from '../models/gamedata.model';

export function connectDb() {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGOURL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}

export function cacheGameInfo(appInfo) {
    return new Promise((resolve, reject) => {
        GameData.create(appInfo)
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));
    });
}

export function getGameInfo(appid) {
    return new Promise((resolve, reject) => {
        GameData.findOne({ appid })
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));
    });
}
