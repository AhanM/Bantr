Posts = new Meteor.Collection("posts");

Meteor.methods({
    upvote: function(postId) {
        var user = Meteor.user();
        // ensure that the user is logged in
        if(!user)
            throw new Meteor.Error(401, "You need to login to upvote");

        Posts.update({
            _id: postId,
            upvoters: {$ne: user._id}},
            {$addToSet: {upvoters: user._id},
            $inc: {points:1}
        });
    }
});

Meteor.publish('posts', function() {
    // Show newest posts at the top
    return Posts.find({},{sort:{time:-1}});
});

Posts.allow({
    'insert' : function(userId, doc) {
    // only allow posting if you are logged in
     return !! userId;
    },
    'update' : function(userId,doc) {
        return !! userId;
    }
});
