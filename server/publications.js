Posts = new Meteor.Collection("posts");

Meteor.publish('posts', function() {
    // Show newest posts at the top
    return Posts.find({},{sort:{time:-1}});
});

Posts.allow({
    'insert' : function(userId, doc) {
    // only allow posting if you are logged in
     return !! userId;
    }
});
