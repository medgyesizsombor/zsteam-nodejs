const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
//mongoose által felismert termék model
const productModel = mongoose.model('product');

// Termékek Get-ek
// Az összes termék lekérése
router.route('/getAllProducts').get((req, res, next) => {
    productModel
        .find({})
        .then(products => {
            return res.status(200).send({ data: products, message: null });
        })
        .catch(err => {
            console.log; //(err);
            return res.status(500).send({ data: null, message: 'Db error' });
        });
});

// A termék lekérése id alapján
router.route('/getProductById').get((req, res, next) => {
    if (req.body.id) {
        productModel
            .find({ id: req.body.id })
            .then(products => {
                return res.status(200).send({ data: products, message: null });
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ data: null, message: 'Db error' });
            });
    } else {
        return res.status(400).send({ data: null, message: 'Hiányzik a termék Id-ja!' });
    }
});

// Az összes deck lekérése
router.route('/getAllDecks').get((req, res, next) => {
    productModel
        .find({ category: 'DECK' })
        .then(decks => {
            return res.status(200).send({ data: decks, message: null });
        })
        .catch(err => {
            console.log; //(err);
            return res.status(500).send({ data: null, message: 'Db error' });
        });
});

// Az összes játék lekérése
router.route('/getAllGames').get((req, res, next) => {
    productModel
        .find({ category: 'GAME' })
        .then(games => {
            return res.status(200).send({ data: games, message: null });
        })
        .catch(err => {
            return res.status(404).send({ data: null, message: 'Nem található játék!' });
        });
});

// Termékek Post-ok
// Új termék létrehozása
router.route('/createProduct').post((req, res, next) => {
    if (req.body.product.id && req.body.product.name && req.body.product.price) {
        productModel
            .findOne({ id: req.body.product.id })
            .then(product => {
                // Ha már létezik a termék, akkor 400 hiba
                if (product) {
                    return res.status(400).send({ data: null, message: 'A termék már létezik!' });
                } else {
                    const product = new productModel({
                        id: req.body.product.id,
                        name: req.body.product.name,
                        price: req.body.product.price,
                        category: req.body.product.category,
                        storage: req.body.product.storage ?? 'NULL'
                    });
                    product
                        .save()
                        .then(() => {
                            return res.status(200).send({ data: null, message: 'Sikeres mentés!' });
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
        if (!req.body.product.id) {
            return res.status(400).send({ data: null, message: 'Hiányzik a termék Id-ja!' });
        } else if (!req.body.product.name) {
            return res.status(400).send({ data: null, message: 'Hiányzik a termék neve!' });
        } else if (!req.body.product.price) {
            return res.status(400).send({ data: null, message: 'Hiányzik a termék ára!' });
        }
    }
});

// Termékek Put-ok
// Termék szerkesztése
router.route('/editProduct').put((req, res, next) => {
    console.log(req.body)
    if (req.body.product.id && req.body.product.name && req.body.product.price && req.body.product.category) {
        productModel
            .findOne({ id: req.body.product.id })
            .then(product => {
                // Ha van termék
                if (product) {
                    product.name = req.body.product.name;
                    product.price = req.body.product.price;
                    product.category = req.body.product.category;
                    product.storage = req.body.product.storage;

                    console.log(product)

                    // Termék mentése
                    product
                        .save()
                        .then(product => {
                            return res.status(200).send({ data: product, message: null });
                        })
                        .catch(err => {
                            console.log; //(err);
                            return res.status(500).send({ data: null, message: 'Hiba mentés közben!' });
                        });
                } else {
                    return res.status(400).send({ data: null, message: 'A termék még nem létezik!' });
                }
            })
            .catch(err => {
                console.log; //(err);
                return res.status(500).send({ data: null, message: 'Db error' });
            });
    } else {
        if (!req.body.product.id) {
            return res.status(400).send({ data: null, message: 'Hiányzik a termék Id-ja!' });
        } else if (!req.body.product.name) {
            return res.status(400).send({ data: null, message: 'Hiányzik a termék neve!' });
        } else if (!req.body.product.price) {
            return res.status(400).send({ data: null, message: 'Hiányzik a termék ára!' });
        } else if (!req.body.product.category) {
            return res.status(400).send({ data: null, message: 'Hiányzik a termék képe!' });
        }
    }
});

// Termékek Delete-k
router.route('/deleteProduct').delete((req, res, next) => {
    if (req.body.id) {
        productModel
            .findOne({ id: req.body.id })
            .then(product => {
                if (product) {
                    product
                        .deleteOne()
                        .then(product => {
                            return res.status(200).send({ data: product, message: null });
                        })
                        .catch(err => {
                            return res.status(500).send({ data: null, message: 'Hiba törlés közben!' });
                        });
                } else {
                    return res.status(400).send({ data: null, message: 'A termék még nem létezik!' });
                }
            })
            .catch(err => {
                console.log; //(err);
                return res.status(500).send({ data: null, message: 'Db error' });
            });
    } else {
        return res.status(400).send({ data: null, message: 'Hiányzik a termék Id-ja!' });
    }
});

module.exports = router;
