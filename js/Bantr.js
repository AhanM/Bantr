Posts = new Mongo.Collection("posts");
// Make sure you've added these packages to your meteor app:
// - 'acccounts-password'
// - 'iron:router'

Router.route('/',{
    template: 'home',
    name: 'home'
});

if (Meteor.isClient) {
 // This code only runs on the client

  Template.home.helpers({
        posts: function () {
            // Show newest posts at the top
            return Posts.find({},{sort:{time:-1}});
        }
    });

    Template.home.events({
        "submit form": function (event) {
            // Prevent default browser form submit
            event.preventDefault();
            // Get value from form element
            var text = event.target.text.value;
            var user = event.target.user.value;

            if(text!= ""){
            // Insert a task into the collection
            Posts.insert({
                text: text,
                user: user,
                points: 0,
                // current time
                time: new Date(),
                createdAt : (new Date().toLocaleTimeString())+
                " "+(new Date().toLocaleDateString())
                });
            }
            // Clear form
            event.target.text.value = "";
        },

        "click .upvote" : function(event) {
            event.preventDefault();

            Posts.update(this._id,
            {$set: {points : this.points+10}}
            );

        },

        "click .downvote" : function(event) {
            event.preventDefault();

            Posts.update(this._id,
                {$set: {points: this.points-10}}
            );
        }
    });
}

if(Meteor.isServer){
    // Server Code
}
