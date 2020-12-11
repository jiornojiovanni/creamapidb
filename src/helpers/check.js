import steamcmd from 'steamcmd';
import { connectDb } from './db';
import { ERRORS } from '../config/constants';

const checkServices = () => new Promise((resolve, reject) => {
    /* We check if the steamcmd is working and is updated,
    if not we can just exit the process with error code as it would be useless to continue.
    */
    steamcmd.check()
        .then(() => {
            console.log('SteamCMD is up-to-date.');
        })
        .catch(() => {
            console.log('SteamCMD is not up-to-date.');
            steamcmd.install()
                .then(() => {
                    console.log('Installation completed');
                })
                .catch((err) => {
                    console.error(err);
                    reject(new Error(ERRORS.STEAMCMD_ERROR));
                });
        })
        .finally(() => {
            connectDb()
                .then(() => {
                    console.log('Database connected.');
                    resolve();
                })
                .catch((err) => {
                    console.log('Database can not be reached.');
                    console.error(err);
                    reject(new Error(ERRORS.DATABASE_ERROR));
                });
        });
});

export default checkServices;
