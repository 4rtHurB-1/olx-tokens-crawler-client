const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getScreenName = (login, screenName) => `${login.split('@')[0]}&${screenName}.png`;
const getScreenPath = (login, screenName) => `screens/${getScreenName(login, screenName)}`;

module.exports = {
    delay, getScreenPath, getScreenName
}