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
      return res.status(200).send(products);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send('Db error');
    });
});

// A termék lekérése id alapján
router.route('/getProductById').get((req, res, next) => {
  if (req.body.id) {
    productModel
      .find({ id: req.body.id })
      .then(product => {
        return res.status(200).send(product);
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send('Db error');
      });
  } else {
    return res.status(400).send('Hiányzik a termék Id-ja!');
  }
});

// Az összes deck lekérése
router.route('/getAllDecks').get((req, res, next) => {
  productModel
    .find({ category: 'DECK' })
    .then(decks => {
      return res.status(200).send(decks);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send('Db error');
    });
});

// Az összes játék lekérése
router.route('/getAllGames').get((req, res, next) => {
  productModel.find({ category: 'GAME' }).then(games => {
    return res.status(200).send(games);
  });
});

// Termékek Post-ok
// Új termék létrehozása
router.route('/product').post((req, res, next) => {
  if (req.body.id && req.body.name && req.body.price && req.body.category && req.body.image) {
    productModel
      .findOne({ id: req.body.id })
      .then(product => {
        // Ha már létezik a termék, akkor 400 hiba
        if (product) {
          return res.status(400).send('A termék már létezik!');
        } else {
          const product = new productModel({
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image,
            storage: req.body.storage ?? null
          });
          product
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
      return res.status(400).send('Hiányzik a termék Id-ja!');
    } else if (!req.body.name) {
      return res.status(400).send('Hiányzik a termék neve!');
    } else if (!req.body.price) {
      return res.status(400).send('Hiányzik a termék ára!');
    } else if (!req.body.category) {
      return res.status(400).send('Hiányzik a termék kategóriája!');
    } else if (!req.body.image) {
      return res.status(400).send('Hiányzik a termék képe!');
    }
  }
});

// Termékek Put-ok
// Termék szerkesztése
router.route('/editProduct').put((req, res, next) => {
  if (req.body.id && req.body.name && req.body.price && req.body.category && req.body.image) {
    productModel
      .findOne({ id: req.body.id })
      .then(product => {
        // Ha van termék
        if (product) {
          product.name = req.body.name;
          product.price = req.body.price;
          product.category = req.body.category;
          product.image = req.body.image;
          product.storage = req.body.storage ?? null;

          // Termék mentése
          product
            .save()
            .then(() => {
              return res.status(200).send('Sikeres mentés!');
            })
            .catch(err => {
              console.log(err);
              return res.status(500).send('Hiba mentés közben!');
            });
        } else {
          return res.status(400).send('A termék még nem létezik!');
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send('Db error');
      });
  } else {
    if (!req.body.id) {
      return res.status(400).send('Hiányzik a termék Id-ja!');
    } else if (!req.body.name) {
      return res.status(400).send('Hiányzik a termék neve!');
    } else if (!req.body.price) {
      return res.status(400).send('Hiányzik a termék ára!');
    } else if (!req.body.category) {
      return res.status(400).send('Hiányzik a termék kategóriája!');
    } else if (!req.body.image) {
      return res.status(400).send('Hiányzik a termék képe!');
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
            .then(() => {
              return res.status(200).send('Sikeres törlés!');
            })
            .catch(err => {
              return res.status(500).send('Hiba törlés közben!');
            });
        } else {
          return res.status(400).send('A termék még nem létezik!');
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send('Db error');
      });
  } else {
    return res.status(400).send('Hiányzik a termék Id-ja!');
  }
});

module.exports = router;
