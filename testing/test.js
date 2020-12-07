import { expect } from 'chai';
import getSteamSearch from '../src/helpers/steam-search';
import searchSteamCMD from '../src/helpers/steam-cmd';
import { STEAM } from '../src/config/constants';

describe("Testing Steam Search...", () => {
    it("Is it correctly returning only the maximum amount of elements from Steam-CMD?", async () => {
        const res = await getSteamSearch("counter strike");
        expect(res.length).to.equal(STEAM.MAX_RESULTS);
    });

    it("Is it returning an empty result when searching gibberish?", async () => {
        const res = await getSteamSearch(".");
        expect(res).to.be.empty;
    });

})

describe("Testing Steam-CMD...", () => {
    it("Is it correctly parsing data from Steam-CMD?", async () => {
        const TEST2 = {
            id: 10,
            name: "Counter-Strike",
            path: "/"
        }
        const res = await searchSteamCMD(TEST2.id);
        expect(res).to.deep.equal(TEST2);
    });

    it("Is it throwing an error when searching for a game without the appropriate information?", async () => {
        try {
            //CSGO does not have correct information, so when called should always fail.
            await searchSteamCMD(730);
            throw new Error("Did not correctly throw inside the function.");
        } catch (e) {
            return expect(e.message).to.equal('Missing config in game infos.');
        }
    })
})