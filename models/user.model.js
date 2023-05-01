const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, lowercase: true },
        username: { type: String, unique: true, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        right: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
        postalCode: { type: Number, required: true },
        address: { type: String, required: true },
        password: { type: String, required: true }
    },
    { collection: 'user' }
);

userSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, function (error, salt) {
            // Ha hiba van a salt generálása során
            if (error) {
                console.log('Hiba', error);
                return next(error);
            }

            bcrypt.hash(user.password, salt, function (err, hash) {
                // Ha hiba van a hashelés során
                if (err) {
                    console.log('Hiba', error);
                    return next(error);
                }

                user.password = hash;
                return next();
            });
        });
    } else {
        return next();
    }
});

// Jelszó összehasonlítás
userSchema.methods.comparePasswords = function (password, next) {
    bcrypt.compare(password, this.password, function (err, success) {
        next(err, success);
    });
};

mongoose.model('user', userSchema);
