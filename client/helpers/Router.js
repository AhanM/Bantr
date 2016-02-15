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

Router.route('/hashtags/:hashtag', function() {
    var self = this;

    Template.Topic.helpers({
        RelevantPosts: function() {
            return Posts.find({hashtags: self.params.hashtag},{sort: {points: -1}});
        },
        hashtag: function() {
            return self.params.hashtag;
        }
    });

    this.render('Topic');
});
