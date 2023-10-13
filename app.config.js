module.exports = () => {
    if (process.env.APP_ENV === 'release') {
        return require('./app.release.json');
    }

    return require('./app.beta.json');
};
