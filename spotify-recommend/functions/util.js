/**
 * taken from https://github.com/spotify/web-api-auth-examples/blob/master/implicit_grant/public/index.html
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * taken from https://github.com/spotify/web-api-auth-examples/blob/master/implicit_grant/public/index.html
 * Obtains parameters from the hash of the URL
 * @return Object
 */
const getHashParamsFromUrl = (url) => {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g;
    while ( e = r.exec(url)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

/**
 * Obtains parameters from the hash of the URL
 *
 * @return Object
 */
const getAccessTokenFromUrl = (url) => {
    return getHashParamsFromUrl(url).accessToken;
}

module.exports.generateRandomString = generateRandomString;
module.exports.getAccessTokenFromUrl = getAccessTokenFromUrl;