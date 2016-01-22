Posts = new Meteor.Collection("posts");
Comments = new Meteor.Collection("comments");

if(Meteor.isServer) {
    function Facebook(accessToken) {
        this.fb = Meteor.npmRequire('fbgraph');
        this.accessToken = accessToken;
        this.fb.setAccessToken(this.accessToken);
        this.options = {
            timeout: 3000,
            pool: {maxSockets: Infinity},
            headers: {connection: "keep-alive"}
        }
        this.fb.setOptions(this.options);
    }
    Facebook.prototype.query = function(query, method) {
        var self = this;
        var method = (typeof method === 'undefined') ? 'get' : method;
        var data = Meteor.sync(function(done) {
            self.fb[method](query, function(err, res) {
                done(null, res);
            });
        });
        return data.result;
    }

    Facebook.prototype.getUserData = function() {
        return this.query('me');
    }
    Facebook.prototype.getFriendsData = function() {
        return this.query('/me/friendlists');
    }

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
        },
        getUserData: function() {
            var fb = new Facebook(Meteor.user().services.facebook.accessToken);
            var data = fb.getUserData();
            console.log(data);
            return data;
        },
        getFriendsData: function() {
            var fb = new Facebook(Meteor.user().services.facebook.accessToken);
            var data = fb.getFriendsData();
            console.log(data)
            return data;
        }
    });

    Meteor.publish('posts', function() {
        // Show newest posts at the top
        return Posts.find({},{sort:{time:-1}});
    });
    Meteor.publish('comments',function(){
        return Comments.find({});
    });

    Meteor.publish("getUserData", function () {
        return Meteor.users.find({_id: this.userId});
    });

    Meteor.publish("getFriendsData", function(){
        return Meteor.users.find({_id: this.userId});
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

    if(Comments.find().count()==0) {
        Comments.insert({
            // userId: Meteor.user()._id,
            postId: Posts.findOne()._id,
            // author: Meteor.user().profile.name,
            submitted: moment().format('MMMM Do YYYY, h:mm:ss a'),
            body: 'Interesting project Sacha, can I get involved?'
        });
        Comments.insert({
            postId: Posts.findOne()._id,
            // userId: Meteor.user()._id,
            // author: Meteor.user().profile.name,
            submitted: moment().format('MMMM Do YYYY, h:mm:ss a'),
            body: 'You sure can Tom!'
        });
    }
}
