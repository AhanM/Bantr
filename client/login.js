Template.login.events({
    "submit form": function(event) {
        event.defaultPrevented = true;
        console.log("Form submitted");

        var email = event.target.loginEmail.value;
        var pass = event.target.loginPassword.value;

        Meteor.loginWithPassword(email,pass);
    },
});
