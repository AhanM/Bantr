Posts = new Meteor.Collection("posts");

Template.home.helpers({
    posts: function () {
        return Posts.find({},{sort:{time:-1}});
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
    }
});

Template.home.events({
    "submit form": function (event) {
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
                time: new Date(), // current time
                createdAt : moment().format('MMMM Do YYYY, h:mm:ss a')
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
    }
});

Template.LoginHeader.helpers({
    UserName: function() {
        return Meteor.user().profile.name;
    }
});
