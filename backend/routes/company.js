const router = require('express').Router();
// Item Model
const Company = require('../models/companyModel');
const Employee = require('../models/employeeModel');
const Department = require('../models/departmentModel');
const Image = require('../models/imageModel');
const validation = require('../helper/validationHelper');

/**
 * @route   GET company/all-company
 * @desc    GET All companies from the database
 * @access  Public
 * */
router.get('/all-company', async (req, res) => {
  try {
    const allCompany = await Company.find().sort({ company_name: 1 });
    const allEmps = await Employee.find().populate('department_id');
    const allComps = [];
    
    // loop through all companies and count the departments existing in each company
    for (comps of allCompany) {
      const temp = await Department.countDocuments({company_id: comps._id});
      let numEmps = 0;
      // loop through all employee list and count the employees in every department of a company
      for (emps of allEmps) {
        if(emps.department_id.company_id.toString().trim() === comps._id.toString().trim()) {
          numEmps++;
        }        
      }
      allComps.push({
        _id: comps._id,
        company_name: comps.company_name,
        date_established: comps.date_established,
        company_address: comps.company_address,
        date_created: comps.date_created,
        num_depts: temp,
        num_emps: numEmps
      })
    }
    res.json(allComps);
  } catch (err) {return res.status(500).json({error: err.message})}
});

/**
 * @route   GET company/:id
 * @desc    GET info of company by id
 * @access  Public
 * */
router.get('/:id', async (req, res) => {
  try{
    //console.log("Hello", typeof(req.params.id), req.params.id);
    //if (!mongoose.Types.ObjectId.isValid(req.params.id)) return validation('invalidID', res);
    const compById = await Company.findById(req.params.id);
    res.json(compById);    
  } catch (err) { return res.status(500).json({error: err.message})}
})

/**
 * @route   POST api/employee
 * @desc    create an employee
 * @access  Public (will be private when authentication is written)
 * */
router.post('/addcompany', async (req, res) => {
  try {
    const {company_name} = req.body;
    let {date_established, company_address} = req.body;
    
    if (!company_name) return validation('missingEntry', res);

    const existingCompany = await Company.findOne({company_name: company_name});
    if(existingCompany) return validation('existingCompany', res);

    if(!date_established) date_established = null;
    if(!company_address) company_address = 'N/A';

    const newCompany = new Company({
      company_name,
      date_established,
      company_address
    });
  
    const savedCompany = await newCompany.save();
    res.json(savedCompany);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

/**
 * DELETE company by company id
 * deletes everything from company to its departments to its employees and to its employee images
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    // check if department exists
    const compExists = await Company.findById(req.params.id);
    if (!compExists) return validation('compDoesNotExist', res);

    // find departments that has matching company id to delete
    const dept = await Department.find({company_id: req.params.id});

    const deptsArray = [];
    const empsArray = [];
    const imgArray = [];

    // if there is a department to delete, delete the employees first then the department
    // otherwise, skip this step and delete the company    
    if (dept) {
      // iterate through departments
      for (const deptItem of dept) {
        // find employees in current iterated department
        const emp = await Employee.find({department_id: deptItem._id});
        if (!emp) continue; // if no employee in department, skip
        // iterate through employees of department
        for (const empItem of emp) {
          // find/delete image of employee
          const delImg = await Image.deleteMany({employee_id: empItem._id})
          if (!delImg) continue;
          imgArray.push(delImg)
        }
        // delete employees here
        const delEmp = await Employee.deleteMany({department_id: deptItem._id})
        empsArray.push(delEmp)
      }
      // delete departments here by their company id
      const delDept = await Department.deleteMany({company_id: req.params.id})
      deptsArray.push(delDept)
    }

    // delete company here
    const delComp = await Company.findByIdAndDelete(req.params.id)
    
    res.json({msg: 'Company successfully deleted!', comp: delComp, dept: deptsArray, emps: empsArray, imgs: imgArray})

  } catch (err) { res.status(500).json({error: err.message}) }
})

module.exports = router;