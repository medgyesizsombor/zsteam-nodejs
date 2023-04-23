const express = require('express');
const router = express.Router();
const passport = require('passport');

// Bejelentkezés
router.route('/login').post((req, res, next) => {
    if (req.body.username && req.body.password) {
        passport.authenticate('local', function (error, user) {
            if (error) {
                return res.status(500).send(error);
            }

            req.login(user, function (err) {
                if (err) {
                    console.log; //(err);
                    return res.status(500).send({ data: null, message: err });
                }

                console.log; //('valami');
                //console.log//(req.isAuthenticated())
                return res.status(200).send({ data: true, message: null });
            });
        })(req, res, next);
    } else {
        if (!req.body.username) {
            return res.status(400).send({ data: null, message: 'Nincs megadva username!'});
        } else {
            return res.status(400).send({ data: null, message: 'Nincs megadva jelszó!'});
        }
    }
});

// Kijelentkezés
router.route('/logout').post((req, res, next) => {
    // Mivel middleware-re van bekötve, nem kell tokent keresni,
    // Be van már autentikálva
    if (req.isAuthenticated()) {
    //req.logOut();
    //return res.status(200).send('Kijelentkezve')
    req.logout({}, function (err) {
      if (err) {
        return res.status(500).send(err);
      }

      return res.status(200).send({message: 'Sikeres kijelentkezés!'});
    });
  } else {
    return res.status(403).send('Nincs bejelentkezett felhasználó!');
  }
});

router.route('/status').get((req, res, next) => {
    //console.log//(req.isAuthenticated())
    if (req.isAuthenticated()) {
        return res.status(200).send({ data: req.session.passport, message: null });
    } else {
        return res.status(403).send({ data: null, message: 'Nincs bejelentkezett felhasználó!'});
    }
});

module.exports = router;
