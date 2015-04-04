if (Meteor.isServer) {
  Meteor.startup(function () {
      console.log(Meteor.settings)
  });
}