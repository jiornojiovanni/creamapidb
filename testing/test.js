import { expect } from 'chai';
import getSteamSearch from '../src/helpers/steam-search';
import searchSteamCMD from '../src/helpers/steam-cmd';
import buildZip from '../src/helpers/zip-builder';
import { STEAM, ERRORS } from '../src/config/constants'

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

    const TEST3 = {
        id: 10,
        name: "Counter-Strike",
        path: "/"
    }

    it("Is it correctly parsing data from Steam-CMD?", async () => {
        const res = await searchSteamCMD(TEST3.id);
        expect(res).to.deep.equal(TEST3);
    });

    it("Is it throwing an error when searching for a game without the appropriate information?", async () => {
        try {
            //CSGO does not have correct information, so when called should always fail.
            await searchSteamCMD(730);
            throw new Error("Did not correctly throw inside the function.");
        } catch (e) {
            return expect(e.message).to.equal(ERRORS.MISSING_DATA);
        }
    });
})

describe("Testing Zip generation...", () => {

    const TEST5 = {
        id: 559650,
        path: "/WitchIt/Binaries/Win64/"
    }

    it("Is it correctly generating zip files?", async () => {
        const path = await buildZip(TEST5);
        expect(path).to.exist;
    });
})