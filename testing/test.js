/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import getSteamSearch from '../src/helpers/steam-search';
import searchSteamCMD from '../src/helpers/steam-cmd';
import getZip from '../src/helpers/zip';
import getDLCs from '../src/helpers/dlcs';
import { STEAM, ERRORS } from '../src/config/constants';

describe('UNIT TESTS', () => {
    describe('Testing Steam Search...', () => {
        it('Is it correctly returning only the maximum amount of elements from SteamCMD?', async () => {
            const res = await getSteamSearch('counter strike');
            expect(res.length).to.equal(STEAM.MAX_RESULTS);
        });

        it('Is it returning a null result when searching gibberish?', async () => {
            const res = await getSteamSearch('.');
            expect(res).to.be.null;
        });
    });

    describe('Testing Steam-CMD...', () => {
        const TEST3 = {
            appid: 10,
            name: 'Counter-Strike',
            path: '/',
        };

        it('Is it correctly parsing data from Steam-CMD?', async () => {
            const res = await searchSteamCMD(TEST3.appid);
            expect(res).to.deep.equal(TEST3);
        });

        it('Is it throwing an error when searching for a game without the appropriate information?', async () => {
            try {
                // CSGO does not have correct information, so when called should always fail.
                await searchSteamCMD(730);
                return '';
            } catch (e) {
                return expect(e.message).to.equal(ERRORS.MISSING_DATA);
            }
        });
    });

    describe('Testing Zip generation...', () => {
        const TEST5 = {
            appid: 559650,
            name: 'Witch It',
            path: '/WitchIt/Binaries/Win64/',

        };

        const TEST5OPTS = {
            dlcs: true,
            wrapper: false,
        };

        it('Is it correctly generating zip files?', async () => {
            const { path } = await getZip(TEST5, TEST5OPTS);
            expect(path).to.exist;
        });
    });

    describe('Testing DLC generation...', () => {
        const TEST6 = {
            yesdlc: 203770,
            nodlc: 10,
        };

        it('Is is correctly retrieving DLCs from Steam?', async () => {
            // It's literally impossible for Crusader Kings 2 to not have DLCs.
            const res = await getDLCs(TEST6.yesdlc);
            expect(res).to.not.be.empty;
        });

        it('Is it returning a null result for games with no DLCs?', async () => {
            const res = await getDLCs(TEST6.nodlc);
            expect(res).to.be.null;
        });
    });
});
