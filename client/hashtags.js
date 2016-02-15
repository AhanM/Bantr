Template.hashtags.helpers({
    hashtagsList: function() {
        return HashtagCollection.find({}, {sort: {relevantPosts: -1}});
    }
});

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};

var fields  = ['hashtag'];

HashtagSearch = new SearchSource('hashtags', fields, options);

Template.hashtags.onCreated(function() {
    HashtagSearch.search('');
});

Template.hashtags.helpers({
    getHashtags: function() {
        return HashtagSearch.getData({
            transform: function(matchText, regExp) {
                return matchText.replace(regExp, "<b>$&</b>")
            },
            sort: {relevantPosts: -1}
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
