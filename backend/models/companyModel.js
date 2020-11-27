const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CompanySchema = new Schema({
    company_name: { type: String, required: true, unique: true },
    date_established: { type: Date },
    company_address: { type: String },
    date_created: { type: Date, default: Date.now }
});

module.exports = companyModel = mongoose.model('Company', CompanySchema);