module.exports = {
    server: {
        port: 80
    },
    giphyAPIKey: process.env.GIPHY_API_KEY || "dc6zaTOxFJmzC",
    giphyBaseURL: process.env.GIPHY_BASE_URL || "http://api.giphy.com/v1/gifs/random",
    applicationEnv: process.env.APPLICATION_ENV || "production"
};