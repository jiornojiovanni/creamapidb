const getPath = (json) => {
    let i = 0;
    while (json.config.launch.hasOwnProperty(i.toString()) === false) i++;
    return json.config.launch[i.toString()].executable.replace(/\\\\/g, '\\');
};

export default getPath;
