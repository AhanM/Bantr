HashtagCollection = new Meteor.Collection("hashtagCollection");

if(HashtagCollection.find().count() == 0) {
    HashtagCollection.insert({
        hashtag: "MUvsMC",
        relevantPosts: 0
    });

    HashtagCollection.insert({
        hashtag: "FedvsNadal",
        relevantPosts: 0
    });

    HashtagCollection.insert({
        hashtag: "TestHashtag",
        relevantPosts: 0
    });
}

HashtagCollection.allow({
    'insert' : function(userId, doc) {
        return !! userId;
    },
    'update' : function(userId, doc) {
        return !! userId;
    }
});

Meteor.publish('hashtagCollection', function() {
    return HashtagCollection.find({});
});

Meteor.methods({
    'incRelevantPosts' : function(thisHashtag) {
        var user = Meteor.user();
        // ensure that the user is logged in
        if(!user)
            throw new Meteor.Error(401, "You need to login to Post");

        HashtagCollection.update(
            {hashtag: thisHashtag}, // Selector
            {$inc: {relevantPosts: 1}}  // Modifier
        );
    }
});
