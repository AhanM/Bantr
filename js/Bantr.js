Posts = new Mongo.Collection("posts");
// Make sure you've added these packages to your meteor app:
// - 'acccounts-password'
// - 'iron:router'
// - 'accounts-facebook'
// - 'accounts-ui-unstyled'

Router.route('/', function () {
    this.render('home');
},{
    name: 'home'
});

Router.route('/about', function () {
    this.render('about');
});

Router.route('/contact', function () {
    this.render('contact')
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

            if(text!= ""){
            // Insert a task into the collection
            Posts.insert({
                text: text,
                username: Meteor.user().username || Meteor.user().profile.name,
                points: 0,
                votedUp : false,
                votedDown : false,
                time: new Date(), // current time
                createdAt : (new Date().toLocaleTimeString())+
                " "+(new Date().toLocaleDateString())
                });
            }
            // Clear form
            event.target.text.value = "";
        },

        "click .upvote" : function(event) {
            event.preventDefault();

            if(!this.votedUp && Meteor.user() != null){
                Posts.update(this._id,
                {$set: {points : this.points+10}}
                );
            }

            if(this.votedUp == false){
                Posts.update(this._id,
                {$set: {votedUp : true}}
                );

                Posts.update(this._id,
                {$set: {votedDown : false}}
                );
            }
        },

        "click .downvote" : function(event) {
            event.preventDefault();

            if(!this.votedDown && Meteor.user() != null) {
                Posts.update(this._id,
                    {$set: {points: this.points-10}}
                );
            }

            if(this.votedDown == false){
                Posts.update(this._id,
                {$set: {votedDown : true}}
                );

                Posts.update(this._id,
                {$set: {votedUp : false}}
                );
            }
        }
    });
}

if(Meteor.isServer){
    // Server Code
}
