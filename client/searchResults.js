var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};

var fields  = ['hashtag'];

HashtagSearch = new SearchSource('hashtags', fields, options);

Template.hashtags.helpers({
    getHashtags: function() {
        return HashtagSearch.getData({
            transform: function(matchText, regExp) {
                return matchText.replace(regExp, "<b>$&</b>")
            },
            sort: {isoScore: -1}
        });
    },

    isLoading: function() {
        return !HashtagSearch.getStatus().loaded;
    }
});

Template.hashtags.events({
    "keyup #search-box": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        HashtagSearch.search(text);
    }, 200)
});
