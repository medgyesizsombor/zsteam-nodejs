const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
//mongoose által felismert felhaszáló model
const userModel = mongoose.model('user');

// Felhasználó Get-ek
// Az összes felhasználó lekérése
router.route('/getAllUsers').get((req, res, next) => {
    if (req.query.username) {
        userModel
            .findOne({ username: req.query.username })
            .then(user => {
                console.log(res);
                if (user?.right === 'ADMIN') {
                    userModel
                        .find({})
                        .then(users => {
                            return res.status(200).send({ data: users, message: null });
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send({ data: null, message: 'Db error' });
                        });
                } else {
                    userModel
                        .find({ right: 'USER' })
                        .then(users => {
                            return res.status(200).send({ data: users, message: null });
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send({ data: null, message: 'Db error' });
                        });
                }
            })
            .catch(err => {
                return res.status(404).send({ data: null, message: 'Nem található felhasználó' });
            });
    } else {
        return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó Id-ja!' });
    }
});

// A felhasználó lekérése id alapján
router.route('/getUserById').get((req, res, next) => {
    if (req.query.id) {
        userModel
            .find({ id: req.query.id })
            .then(user => {
                return res.status(200).send({ data: user, message: null });
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ data: null, message: 'Db error' });
            });
    } else {
        return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó Id-ja!' });
    }
});

// A felhasználó lekérése felhasználónév alapján
router.route('/getUserByUsername').get((req, res, next) => {
    if (req.query.username) {
        userModel
            .find({ username: req.query.username })
            .then(user => {
                console.log(user)
                return res.status(200).send({ data: user, message: null });
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ data: null, message: 'Db error' });
            });
    } else {
        return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó Id-ja!' });
    }
});

// Felhasználó Post-ok
// Felhasználó hozzáadása
router.route('/createUser').post((req, res, next) => {
    if (
        req.body.user.id &&
        req.body.user.username &&
        req.body.user.firstName &&
        req.body.user.lastName &&
        req.body.user.email &&
        req.body.user.postalCode &&
        req.body.user.address &&
        req.body.user.password
    ) {
        userModel
            .findOne({ id: req.body.user.id })
            .then(user => {
                console.log(user);
                // Ha már létezik a felhasználó, akkor 400 hiba
                if (user) {
                    return res.status(400).send({ data: null, message: 'A felhasználó már létezik!' });
                } else {
                    const newUser = new userModel(req.body.user);
                    newUser
                        .save()
                        .then(result => {
                            console.log('valami');
                            return res.status(200).send({ data: result, message: null });
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send({ data: null, message: 'Hiba mentés közben!' });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ data: null, message: 'Db error' });
            });
    } else {
        if (!req.body.user.id) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó Id-ja!' });
        } else if (!req.body.user.username) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó felhasználóneve!' });
        } else if (!req.body.user.firstName) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó keresztneve!' });
        } else if (!req.body.user.lastName) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó vezetékneve!' });
        } else if (!req.body.user.email) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó emailje!' });
        } else if (!req.body.user.postalCode) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó irányítószáma!' });
        } else if (!req.body.user.address) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó címe!' });
        } else if (!req.body.user.password) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó jelszava!' });
        }
    }
});

// Felhasználó Put-ok
// Felhasználó szerkesztése
router.route('/editUser').put((req, res, next) => {
    if (
        req.body.user.id &&
        req.body.user.username &&
        req.body.user.firstName &&
        req.body.user.lastName &&
        req.body.user.email &&
        req.body.user.right &&
        req.body.user.postalCode &&
        req.body.user.address &&
        req.body.user.password
    ) {
        userModel
            .findOne({ id: req.body.user.id })
            .then(user => {
                console.log(user);
                // Ha már létezik a felhasználó, akkor 400 hiba
                if (user) {
                    user.username = req.body.user.username;
                    user.firstName = req.body.user.firstName;
                    user.lastName = req.body.user.lastName;
                    if (user.email !== req.body.user.email) {
                        user.email = req.body.user.email;
                    }
                    user.right = req.body.user.right;
                    user.postalCode = req.body.user.postalCode;
                    user.address = req.body.user.address;
                    user.password = req.body.user.password;

                    //console.log(editUser)
                    user.save()
                        .then(() => {
                            console.log('valami')
                            return res.status(200).send({ data: user, message: null });
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send({ data: null, message: 'Hiba mentés közben!' });
                        });
                } else {
                    return res.status(400).send({ data: null, message: 'A felhasználó még nem létezik!' });
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ data: null, message: 'Db error' });
            });
    } else {
        if (!req.body.user.username) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó felhasználóneve!' });
        } else if (!req.body.user.firstName) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó keresztneve!' });
        } else if (!req.body.user.lastName) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó vezetékneve!' });
        } else if (!req.body.user.email) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó emailje!' });
        } else if (!req.body.user.right) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó joga!' });
        } else if (!req.body.user.postalCode) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó irányítószáma!' });
        } else if (!req.body.user.address) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó címe!' });
        } else if (!req.body.user.password) {
            return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó jelszava!' });
        }
    }
});

// Felhasználó Delete-k
router.route('/deleteUser').delete((req, res, next) => {
    if (req.body.id) {
        userModel
            .findOne({ id: req.body.id })
            .then(user => {
                if (user) {
                    user.deleteOne()
                        .then(() => {
                            return res.status(200).send({ data: user, message: null });
                        })
                        .catch(err => {
                            return res.status(500).send({ data: null, message: 'Hiba törlés közben!' });
                        });
                } else {
                    return res.status(400).send({ data: null, message: 'A felhasználó még nem létezik!' });
                }
            })
            .catch(err => {
                console.log; //(err);
                return res.status(500).send({ data: null, message: 'Db error' });
            });
    } else {
        return res.status(400).send({ data: null, message: 'Hiányzik a felhasználó Id-ja!' });
    }
});

module.exports = router;
