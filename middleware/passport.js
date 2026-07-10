const passport = require("passport");

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    req.user = user || null;
    res.locals.user = req.user;
    next();
  })(req, res, next);
};

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect("/login");
    }
    req.user = user;
    res.locals.user = user;
    next();
  })(req, res, next);
};

const ensureGuest = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) {
      return res.redirect("/");
    }
    next();
  })(req, res, next);
};

module.exports = { authenticateJWT, ensureAuthenticated, ensureGuest };
