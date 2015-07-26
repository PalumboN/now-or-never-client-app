var FacebookStrategy, fakeSerialize, passport;

passport = require('passport');

FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: "984062531613818",
  clientSecret: "394008e2ad57e8deac45ca91d96afbfb",
  callbackURL: "http://localhost:5000/auth/facebook/callback",
  enableProof: false
}, function(accessToken, refreshToken, profile, done) {
  var laPosta;
  laPosta = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    profile: profile
  };
  return done(null, laPosta);
}));

fakeSerialize = function(user, done) {
  return done(null, user);
};

passport.serializeUser(fakeSerialize);

passport.deserializeUser(fakeSerialize);

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['user_status', 'user_about_me', 'user_birthday']
  }));
  return app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
  }), function(req, res) {
    console.log(req.user);
    res.cookie("user", JSON.stringify(req.user));
    return res.redirect('/');
  });
};
