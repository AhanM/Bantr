Template.login.events({
    "submit form": function(event) {
        event.defaultPrevented = true;
        console.log("Form submitted");

        var email = event.target.loginEmail.value;
        var pass = event.target.loginPassword.value;

        Meteor.loginWithPassword(email,pass);
    },
});

Template.login.onCreated(function() {
    Meteor.call("getFriendsData", function(error, userData) {
        if(error) {
            console.log(error)
        } else {
            Session.set('userData', userData)
        }
    });
});

Template.login.helpers({
    emailAddr: function(){
        return Meteor.user().services.facebook.email;
    },
    gender: function(){
        return JSON.stringify(Meteor.user().services.facebook.gender).toLocaleUpperCase();
    },
    userData: function(){
        return Session.get("userData")
    }
});

Template.friends.onCreated(function() {
    Meteor.call("getFriendsData", function(error, friends) {
        if (error) {
            console.log(error);
        } else {
            Session.set('friends', friends);
        }
    });
});

Template.friends.helpers({
   friendlist: function() {
       return Session.get('friends');
   }
});
