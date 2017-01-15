module.exports = {
    server: {
        port: 80
    },
    giphyAPIKey: process.env.GIPHY_API_KEY || "dc6zaTOxFJmzC",
    giphyBaseURL: "http://api.giphy.com/v1/gifs/random"
};