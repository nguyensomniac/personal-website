if (Meteor.isServer) {
  Meteor.startup(function () {
      if(process.env.METEOR_SETTINGS) {
        Meteor.settings = process.env.METEOR_SETTINGS
      }
      console.log(process.env);
      console.log(Meteor.settings)
  });
}