const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const User =require('../model/User')
const LocalStrategy=require("passport-local")


//passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID ,
    clientSecret:process.env.CLIENT_SECRET ,
    callbackURL: '/login/google/redirect',
    scope: [ 'profile','email' ]
  },(accessToken, refreshToken, profile, done) => {
    // check if user already exists in our own db
    User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
    
}));