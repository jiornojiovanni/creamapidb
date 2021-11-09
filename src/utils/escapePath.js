import path from 'path';

function escapePath(execPath) {
    const execParsed = path.win32.parse(execPath);
    /* Replace Windows separator with Unix one
        and add slash at the start of the string if necessary.
    */
    const gamepath = (execParsed.root === execParsed.dir) ? '/' : `/${execParsed.dir.replace(/\\/g, '/').replace(/^\//g, '')}/`;
    return gamepath;
}

export default escapePath;
