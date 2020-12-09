const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DepartmentModel } = require('./departmentModel');

// Create Schema
const EmployeeSchema = new Schema({
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    image_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    emp_name: { type: String, required: true },
    emp_email: { type: String, required: true },
    emp_contact_no: { type: String, required: true },
    interview_date: { type: Date, required: true },
    hire_date: { type: Date, required: true },
    start_date: { type: Date, required: true },
    termination_date: { type: Date },
    emp_address: { type: String, required: true },
    date_created: { type: Date, default: Date.now }
});

module.exports = employeeModel = mongoose.model('Employee', EmployeeSchema);