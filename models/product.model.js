const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, lowercase: true },
        name: { type: String, unique: true, required: true },
        price: { type: Number, required: true },
        category: { type: String, enum: ['GAME', 'DECK'], default: 'GAME' },
        storage: { type: String, enum: ['64 GB', '256 GB', '512 GB', 'NULL'], default: 'NULL' }
    },
    { collection: 'product' }
);

mongoose.model('product', productSchema);
