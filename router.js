Router.configure({
  layoutTemplate: 'main'
});
Router.route('/', function()  {
  this.render('home');
});
Router.route('/work', function()  {
  this.render('workall');
});
Router.route('/work/:_id', function() {
  //render work template if it exists, else 404
  this.render('work', {
    data: {'worknum': 'work-' + this.params._id}
  });
})
Router.route('/about', function()  {
    this.render('about');
});
//server side API calls
Router.route('/lastfm', function(){
  var last = Meteor.http.get('http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&period=7day&user=ieely&limit=5&api_key=' + Meteor.settings.private.lastfm.apiKey + '&format=json');
  this.response.write(JSON.stringify(last.data));
  this.response.end();
}, {where: 'server'});
Router.route('/ig', function(){
  var insta = Meteor.http.get('https://api.instagram.com/v1/users/583125553/media/recent/?client_id=' + Meteor.settings.private.instagram.clientId);
  this.response.write(JSON.stringify(insta.data));
  this.response.end();
}, {where: 'server'});