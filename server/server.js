if (Meteor.isServer) {
  Meteor.startup(function () {
      if(process.env.METEOR_ENV = 'production') {
        var settings = require('/app/settings.json');
        Meteor.settings = settings;
      }
      console.log()
      console.log(process.env);
      console.log(Meteor.settings)
  });
}