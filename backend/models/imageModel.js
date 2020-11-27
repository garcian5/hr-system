const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ImageSchema = new Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },
    // our image data type is a buffer
    // allows us to store our img as data in array forms
    image: {
      data: Buffer,
      contentType: String
    }
});

module.exports = imageModel = mongoose.model('Image', ImageSchema);

//https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/