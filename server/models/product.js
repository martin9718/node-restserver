const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let productSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    unitPrice: { type: Number, required: [true, 'Unit price is required'] },
    description: { type: String, required: false },
    img: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Product', productSchema);