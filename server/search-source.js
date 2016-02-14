SearchSource.defineSource('hashtags', function(searchText, options) {
    var options = {sort: {isoScore: -1}, limit: 20};

    console.log("the search text is :-");
    console.log(searchText);

    if(searchText) {
        var regExp = buildRegExp(searchText);
        var selector = {hashtag: regExp};
        return HashtagCollection.find(selector, options).fetch();
    } else {
        return HashtagCollection.find({}, options).fetch();
    }
});


function buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
        return "(?=.*" + word + ")";
    });
    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
}
