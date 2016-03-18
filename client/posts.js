Posts = new Meteor.Collection("posts");
Comments = new Meteor.Collection("comments");
HashtagCollection = new Meteor.Collection("hashtagCollection");

Template.home.helpers({
    posts: function () {
        return Posts.find({}, {sort: {time: -1}});
    }
});

Template.Post.helpers({
    upvotedClass: function(){
        var userId = Meteor.userId();
        if(userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvoteable';
        } else {
            return 'disabled';
        }
    },
    comments: function(){
        return Comments.find({postId:this._id},{sort:{time:-1}});
    },
    commentsCount: function() {
        return Comments.find({postId:this._id}).count();
    },
    isUpvoted: function () {

        upvoters = this.upvoters;
        userId = Meteor.userId();

        if(userId && _.include(upvoters, userId)) {
            return 'Upvoted';
        }
        else {
            return 'Upvote';
        }

    }
});

Template.home.events({
    "submit .new-post": function (event) {
        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        var text = event.target.text.value;

        var hashtagArray = [];
        // aquiring hashtags from text
        for(var i=0; i < text.length; i++) {
            if(text.charAt(i) == '#') {
                 for(var j = i+1; j < text.length; j++) {
                     if(text.charAt(j) == ' ' || text.indexOf(text.substring(j, j+1)) == text.length - 1) {
                           hashtagArray.push(text.slice(i+1,j));
                           console.log(text.slice(i+1,j));
                           i = j;
                           break;
                     }
                 }
            }
        }

        // add hashtags to the HashtagCollection if they arent already there
        for(var i = 0; i < hashtagArray.length; i++) {
            if(HashtagCollection.find({hashtag: hashtagArray[i]}).count() == 0)
            {
                HashtagCollection.insert({
                    hashtag: hashtagArray[i],
                    text: '#'+hashtagArray[i],
                    relevantPosts: 1
                });
            }
            else {
                Meteor.call('incRelevantPosts', hashtagArray[i]);
            }
        }

        if(text!= "" && Meteor.user()){
            // Insert a post into the collection
            Posts.insert({
                text: text,
                hashtags : hashtagArray,
                username: Meteor.user().username || Meteor.user().profile.name,
                points: 0,
                votedUp : false,
                upvoters : [],
                createdAt : moment().format('MMMM Do YYYY, h:mm:ss a'),
                time : new Date().getTime()
            });
        }
        // Clear form
        event.target.text.value = "";
    }
});

Template.Post.events({
    "click .upvoteable" : function(event) {
        event.preventDefault();
        Meteor.call('upvote', this._id);
    },

    "submit .insertComment": function (event) {
        event.preventDefault();

        var text = event.target.text.value;

        if(text!= "" && Meteor.user()) {
            Comments.insert({
                body: text,
                postId: this._id,
                userId: Meteor.user()._id,
                author: Meteor.user().username || Meteor.user().profile.name,
                submitted: moment().format('MMMM Do YYYY, h:mm:ss a'),
                time: new Date().getTime()
            });
        }

        event.target.text.value = "";
    }
});

Template.LoginHeader.helpers({
    UserName: function() {
        return Meteor.user().profile.name;
    }
});
