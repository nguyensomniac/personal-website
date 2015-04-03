if(Meteor.isClient) {
  Template.home.helpers({
    posts: function() {
      return postList
    }
  });
};