import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {googleLogin} from "../services/google.service";
import dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await googleLogin(accessToken, refreshToken, profile);
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }
));

// serializar usuario (necesario para Passport pero no se usa con JWT)
passport.serializeUser((user: any, done) => {
    done(null, user);
});

// deserializar usuario (necesario para Passport pero no se usa con JWT)
passport.deserializeUser((user: any, done) => {
    done(null, user);
});