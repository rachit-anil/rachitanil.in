const mongoose = require('mongoose');

// Define a new Mongoose schema
const Schema = mongoose.Schema;

// Create a new schema object
const carSchema = new Schema({
    VIN: { type: String, required: true },
    pictures: { type: [String], required: true },
});

// Create a Mongoose model based on the schema
const CarModel = mongoose.model('Car', carSchema); // atrangi is like a table

// Export the model to use it elsewhere in your application
module.exports = CarModel;