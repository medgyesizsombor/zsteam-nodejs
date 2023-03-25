const express = require('express');
const router = express.Router();
const passport = require('passport');

const mongoose = require('mongoose');
//mongoose által felismert felhaszáló model
const userModel = mongoose.model('user');

// Bejelentkezés
router.route('/login').post((req, res, next) => {
    if (req.body.username && req.body.password) {
        passport.authenticate('local', function (error, user) {
            if (error) {
                return res.status(500).send(error);
            }

            req.logIn(user, function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err);
                }

                return res.status(200).send('Sikeres bejelentkezés!');
            });
        })(req, res);
    } else {
        if (!req.body.username) {
            return res.status(400).send('Nincs megadva username!');
        } else {
            return res.status(400).send('Nincs megadva jelszó!');
        }
    }
});

router.route('/logout').post((req, res, next) => {
    // Mivel middleware-re van bekötve, nem kell tokent keresni,
    // Be van már autentikálva
    if (req.isAuthenticated()) {
        req.logout({}, function(err) {
            if (err) {
                return res.status(500).send(err);
            }

            return res.status(200).send('Sikeres kijelentkezés!');
        });
    } else {
        return res.status(403).send('Nincs bejelentkezett felhasználó!');
    }
});

router.route('/status').get((req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(200).send(req.session.passport);
    } else {
        return res.status(403).send('Nincs bejelentkezett felhasználó!');
    }
});

module.exports = router;
