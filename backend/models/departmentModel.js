const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanyModel = require('./companyModel');

// Create Schema
const DepartmentSchema = new Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    department_name: { type: String, required: true },
    date_created: { type: Date, default: Date.now }    
});

module.exports = departmentModel = mongoose.model('Department', DepartmentSchema);