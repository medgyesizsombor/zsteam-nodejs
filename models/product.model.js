const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, lowercase: true },
        name: { type: String, unique: true, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true, enum: ['GAME', 'DECK'], default: 'GAME' },
        image: { type: String, required: true },
        storage: { type: String, enum: ['64 GB', '256 GB', '512 GB'], default: '64 GB' }
    },
    { collection: 'product' }
);

mongoose.model('product', productSchema);
