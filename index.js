const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const app = express();

const port = process.env.PORT || 3000;
const dbUrl = 'mongodb+srv://zsombor:zItJFiKFYORzdmRg@zsteam-cluster.arnlvcj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbUrl);

mongoose.connection.on('connected', () => {
    console.log('Kapcsolódva!');
});

mongoose.connection.on('error', err => {
    console.log('Error', err);
});

require('./models/product.model');
require('./models/user.model');

const userModel = mongoose.model('user');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));

let originsWhitelist = ['http://localhost:4200'];

let corsOptions = {
    origin: function (origin, callback) {
        let isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
};

app.use(cors(corsOptions));

passport.use(
    'local',
    new localStrategy(function (username, password, done) {
        userModel
            .findOne({ username })
            .then(user => {
                // Ha nincs user
                if (!user) {
                    return done('Nincs ilyen felhasználónév!', null);
                }

                // Jelszó összehasonlítása
                user.comparePasswords(password, function (err, success) {
                    if (err) {
                        return done('Hiba történt az összehasonlítás közben!', false);
                    }

                    if (!success) {
                        return done('Nem egyezik meg a két jelszó!', false);
                    }

                    return done(null, user);
                });
            })
            .catch(err => {
                return done('Hiba a lekérés során!', null);
            });
    })
);

// Bejelentkeztetésnél
passport.serializeUser(function (user, done) {
    if (!user) {
        return done('Nincs megadva beléptethető felhasználó!', null);
    }

    return done(null, user);
});

// Kiléptetésnél
passport.deserializeUser(function (user, done) {
    if (!user) {
        return done('Nincs user, akit kiléptethetnénk', null);
    }

    return done(null, user);
});

app.use(
    expressSession({
        secret: 'topSecretForPrfBeadando2023',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index.html'));

app.use('/products', require('./routes/products.routes.js'));
app.use('/users', require('./routes/users.routes'));
app.use('/authenticate', require('./routes/authenticate.routes'));

//Error handler
app.use((req, res, next) => {
    res.status(404).send('A kért erőforrás nem található!');
});

app.listen(port, () => {
    console.log(`A szerver fut a ${port}-on!`);
});
