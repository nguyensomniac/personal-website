if (Meteor.isServer) {
  Meteor.startup(function () {
      if(process.env.METEOR_ENV = 'production') {
        Meteor.settings = process.env.METEOR_SETTINGS;
      }
      console.log()
      console.log(process.env);
      console.log(Meteor.settings)
  });
}