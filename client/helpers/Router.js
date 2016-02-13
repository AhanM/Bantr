// Basic Routing

Router.route('/', function () {
    this.render('home');
},{
    name: 'home'
});

Router.route('/login');

Router.route('/about', function () {
    this.render('about');
});

Router.route('/contact', function () {
    this.render('contact')
});

Router.route('/friends', function() {
    this.render('friends')
});

Router.route('/hashtags', function() {
    this.render('hashtags')
});
