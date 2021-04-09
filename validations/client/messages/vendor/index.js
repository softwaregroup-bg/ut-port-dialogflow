
module.exports = joi => ({
    text: require('./text')(joi),
    image: require('./image')(joi),
    quickReplies: require('./quickReplies')(joi),
    card: require('./card')(joi),
    simpleResponses: require('./simpleResponses')(joi),
    basicCard: require('./basicCard')(joi),
    suggestions: require('./suggestions')(joi),
    linkOutSuggestion: require('./linkOutSuggestion')(joi),
    listSelect: require('./listSelect')(joi),
    carouselSelect: require('./carouselSelect')(joi)
});
