if (Meteor.is_server) {
  Meteor.startup(function () {
      if(process.env.METEOR_SETTINGS) {
        Meteor.settings = process.env.METEOR_SETTINGS
      }
  });
}