const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
//mongoose által felismert felhaszáló model
const userModel = mongoose.model('user');

// Felhasználó Get-ek
// Az összes felhasználó lekérése
router.route('/').get((req, res, next) => {
    userModel
        .find({})
        .then(users => {
            return res.status(200).send(users);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send('Db error');
        });
});

// A felhasználó lekérése id alapján
router.route('/getUserById').get((req, res, next) => {
    if (req.body.id) {
        userModel
            .find({ id: req.body.id })
            .then(user => {
                return res.status(200).send(user);
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send('Db error');
            });
    } else {
        return res.status(400).send('Hiányzik a felhasználó Id-ja!');
    }
});

// Felhasználó lekérése Id alapján
router.route('/').get((req, res, next) => {
    userModel
        .find({})
        .then(users => {
            return res.status(200).send(users);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send('Db error');
        });
});

// Felhasználó Post-ok
// Felhasználó hozzáadása
router.route('/users').post((req, res, next) => {
    if (
        req.body.id &&
        req.body.username &&
        req.body.firstName &&
        req.body.lastName &&
        req.body.email &&
        req.body.postalCode &&
        req.body.address &&
        req.body.password &&
        req.body.image
    ) {
        userModel
            .findOne({ id: req.body.id })
            .then(user => {
                // Ha már létezik a felhasználó, akkor 400 hiba
                if (user) {
                    return res.status(400).send('A felhasználó már létezik!');
                } else {
                    const newUser = new userModel({
                        id: req.body.id,
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        right: req.body.right,
                        postalCode: req.body.postalCode,
                        address: req.body.address,
                        password: req.body.password,
                        image: req.body.image
                    });
                    newUser
                        .save()
                        .then(() => {
                            return res.status(200).send('Sikeres mentés!');
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send('Hiba mentés közben!');
                        });
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send('Db error');
            });
    } else {
        if (!req.body.id) {
            return res.status(400).send('Hiányzik a felhasználó Id-ja!');
        } else if (!req.body.username) {
            return res.status(400).send('Hiányzik a felhasználó felhasználóneve!');
        } else if (!req.body.firstName) {
            return res.status(400).send('Hiányzik a felhasználó keresztneve!');
        } else if (!req.body.lastName) {
            return res.status(400).send('Hiányzik a felhasználó vezetékneve!');
        } else if (!req.body.email) {
            return res.status(400).send('Hiányzik a felhasználó emailje!');
        } else if (!req.body.postalCode) {
            return res.status(400).send('Hiányzik a felhasználó irányítószáma!');
        } else if (!req.body.address) {
            return res.status(400).send('Hiányzik a felhasználó címe!');
        } else if (!req.body.password) {
            return res.status(400).send('Hiányzik a felhasználó jelszava!');
        } else if (!req.body.image) {
            return res.status(400).send('Hiányzik a felhasználó képe!');
        }
    }
});

// Felhasználó Put-ok
// Felhasználó szerkesztése
router.route('/editUser').put((req, res, next) => {
    if (
        req.body.id &&
        req.body.username &&
        req.body.firstName &&
        req.body.lastName &&
        req.body.email &&
        req.body.right &&
        req.body.postalCode &&
        req.body.address &&
        req.body.password &&
        req.body.image
    ) {
        userModel
            .findOne({ id: req.body.id })
            .then(user => {
                // Ha már létezik a felhasználó, akkor 400 hiba
                if (user) {
                    user.username = req.body.username;
                    user.firstName = req.body.firstName;
                    user.lastName = req.body.lastNam;
                    user.email = req.body.email;
                    user.right = req.body.right;
                    user.postalCode = req.body.postalCode;
                    user.address = req.body.address;
                    user.password = req.body.password;
                    user.image = req.body.image;
                    user.save()
                        .then(() => {
                            return res.status(200).send('Sikeres mentés!');
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send('Hiba mentés közben!');
                        });
                } else {
                    return res.status(400).send('A felhasználó még nem létezik!');
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send('Db error');
            });
    } else {
        if (!req.body.username) {
            return res.status(400).send('Hiányzik a felhasználó felhasználóneve!');
        } else if (!req.body.firstName) {
            return res.status(400).send('Hiányzik a felhasználó keresztneve!');
        } else if (!req.body.lastName) {
            return res.status(400).send('Hiányzik a felhasználó vezetékneve!');
        } else if (!req.body.email) {
            return res.status(400).send('Hiányzik a felhasználó emailje!');
        } else if (!req.body.right) {
            return res.status(400).send('Hiányzik a felhasználó joga!');
        } else if (!req.body.postalCode) {
            return res.status(400).send('Hiányzik a felhasználó irányítószáma!');
        } else if (!req.body.address) {
            return res.status(400).send('Hiányzik a felhasználó címe!');
        } else if (!req.body.password) {
            return res.status(400).send('Hiányzik a felhasználó jelszava!');
        }else if (!req.body.image) {
            return res.status(400).send('Hiányzik a felhasználó képe!');
        }
    }
});

// Felhasználó szerkesztése
router.route('/editUser').put((req, res, next) => {
    if (
        req.body.id &&
        req.body.username &&
        req.body.firstName &&
        req.body.lastName &&
        req.body.email &&
        req.body.right &&
        req.body.postalCode &&
        req.body.address &&
        req.body.password
    ) {
        userModel
            .findOne({ id: req.body.id })
            .then(user => {
                // Ha már létezik a felhasználó, akkor 400 hiba
                if (user) {
                    (user.username = req.body.username),
                        (user.firstName = req.body.firstName),
                        (user.lastName = req.body.lastName),
                        (user.email = req.body.email),
                        (user.right = req.body.right),
                        (user.postalCode = req.body.postalCode),
                        (user.address = req.body.address),
                        (user.password = req.body.password);
                    user.save()
                        .then(() => {
                            return res.status(200).send('Sikeres mentés!');
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send('Hiba mentés közben!');
                        });
                } else {
                    return res.status(400).send('A felhasználó még nem létezik!');
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send('Db error');
            });
    } else {
        if (!req.body.username) {
            return res.status(400).send('Hiányzik a felhasználó felhasználóneve!');
        } else if (!req.body.firstName) {
            return res.status(400).send('Hiányzik a felhasználó keresztneve!');
        } else if (!req.body.lastName) {
            return res.status(400).send('Hiányzik a felhasználó vezetékneve!');
        } else if (!req.body.email) {
            return res.status(400).send('Hiányzik a felhasználó emailje!');
        } else if (!req.body.right) {
            return res.status(400).send('Hiányzik a felhasználó joga!');
        } else if (!req.body.postalCode) {
            return res.status(400).send('Hiányzik a felhasználó irányítószáma!');
        } else if (!req.body.address) {
            return res.status(400).send('Hiányzik a felhasználó címe!');
        } else if (!req.body.password) {
            return res.status(400).send('Hiányzik a felhasználó jelszava!');
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
                            return res.status(200).send('Sikeres törlés!');
                        })
                        .catch(err => {
                            return res.status(500).send('Hiba törlés közben!');
                        });
                } else {
                    return res.status(400).send('A felhasználó még nem létezik!');
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send('Db error');
            });
    } else {
        return res.status(400).send('Hiányzik a felhasználó Id-ja!');
    }
});

module.exports = router;
