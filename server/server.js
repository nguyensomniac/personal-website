if (Meteor.isServer) {
  Meteor.startup(function () {
      if(process.env.METEOR_ENV = 'production') {
        Meteor.settings = settings;
      }
      console.log()
      console.log(process.env);
      console.log(Meteor.settings)
  });
}