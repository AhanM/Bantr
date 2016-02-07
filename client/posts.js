Posts = new Meteor.Collection("posts");
Comments = new Meteor.Collection("comments");

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
    }
});

Template.home.events({
    "submit .new-post": function (event) {
        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        var text = event.target.text.value;

        if(text!= "" && Meteor.user()){
            // Insert a post into the collection
            Posts.insert({
                text: text,
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
