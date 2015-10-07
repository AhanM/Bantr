Router.route('/login');

if(Meteor.isClient) {
    Template.register.events({
        "submit form": function(event) {
            event.defaultPrevented = true;

            console.log("Form submitted");
            var email = event.target.registerEmail.value;
            var pass = event.target.registerPassword.value;

            Accounts.createUser({
                email:email,
                password:pass
            });
        }
    });

    Template.login.events({
        "submit form": function(event) {
            event.defaultPrevented = true;
            console.log("Form submitted");

            var email = event.target.loginEmail.value;
            var pass = event.target.loginPassword.value;

            Meteor.loginWithPassword(email,pass);
        },
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

}
