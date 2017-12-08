// 1
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { JWT_SECRET } = require('./config/index');
const User = require('./models/user');

// 2
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = User.findById(payload.sub);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch(err) {
    done(err, false);
  }
}))

// 3
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {

  try {
    const user = await User.findOne({ email })

      if (!user) {
        return done(null, false)
      }

      const isMatch = await user.isValidPassword(password)

      if (!isMatch) {
        return done(null, false)
      }

      done(null, user)

  } catch (error) {
    done(error, false)
  }

}))
