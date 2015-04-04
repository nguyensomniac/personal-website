if (Meteor.isServer) {
  Meteor.startup(function () {
      if(process.env.METEOR_ENV = 'production') {
        var settings = Meteor.http.get(Meteor.absoluteUrl("/app/settings.json")).data;
        Meteor.settings = settings;
      }
      console.log()
      console.log(process.env);
      console.log(Meteor.settings)
  });
}