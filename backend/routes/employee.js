const router = require('express').Router();
// Item Model
const Employee = require('../models/employeeModel');
const Department = require('../models/departmentModel');
const Image = require('../models/imageModel');
const validation = require('../helper/validationHelper');

/**
 * Gets employees by department id
 */
router.get('/department/:id', async (req, res) => {
  try {    
    const empsInDept = await Employee.find({department_id: req.params.id})
      .populate({path: 'department_id', populate: {path: 'company_id'} })
    res.json({elems: empsInDept})
  } catch (err) {res.status(500).json({error: err.message});}
})

/**
 * @route   GET api/items
 * @desc    GET List of all employees and their departments + company
 * @access  Public
 * */
router.get('/allemployees', (req, res) => {
  Employee.find()
    .populate({path: 'department_id', populate: {path: 'company_id'} })
    .exec()
    .then(emps => {
      res.status(200).json({
        elems: emps.map(emp => {
          return {
            _id: emp._id,
            department_id: emp.department_id,
            emp_name: emp.emp_name,
            emp_email: emp.emp_email,
            emp_contact_no: emp.emp_contact_no,
            interview_date: emp.interview_date,
            hire_date: emp.hire_date,
            start_date: emp.start_date,
            termination_date: emp.termination_date,
            emp_address: emp.emp_address            
          }
        })
      })
    })
    .catch(err=>{res.status(500).json({error: err.message})});
});

/**
 * @route   POST api/employee
 * @desc    create an employee
 * @access  Public (will be private when authentication is written)
 * */
router.post('/addemployee', async (req, res) => {
  try {
    const {department_id, 
      emp_name,
      emp_email,
      emp_contact_no,
      interview_date,
      hire_date,
      start_date,
      emp_address} = req.body;

    let {termination_date} = req.body;

    // if department id doesn't exist in departments list
    const deptExists = await Department.findOne({_id: department_id})
      if(!deptExists) return validation('invalidDeptID', res);

    // if missing entry field
    if (!department_id || !emp_name || !emp_contact_no || !emp_contact_no ||
      !interview_date || !hire_date || !start_date || !emp_address)
      return validation('missingEntry', res);

    // if employee already exists
    const existingEmployee = await Employee.findOne({emp_email: emp_email})
      .populate({path: 'department_id', populate: {path: 'company_id'} });

    if (existingEmployee) return validation('existingEmployee', res);
    /* console.log(existingEmployee.department_id.company_id.company_name);
    const deptComp = await Employee.findOne({department_id: department_id})
      .populate({path: 'department_id', populate: {path: 'company_id'} });
      console.log(deptComp.department_id.company_id.company_name);
    const flag = true;
    //if (existingEmployee) return validation('existingEmployee', res);
    if (existingEmployee.department_id.company_id._id == deptComp.department_id.company_id._id) return validation('existingEmployee', res); */

    // if no termination date:
    if (!termination_date) termination_date = null;
  
    const newEmployee = new Employee({
      department_id, 
      emp_name,
      emp_email,
      emp_contact_no,
      interview_date,
      hire_date,
      start_date,
      termination_date,
      emp_address
    });
  
    const savedEmployee = await newEmployee.save();
    res.json(savedEmployee);
  } catch (err) {res.status(500).json({error: err.message});}
});

/**
 * @route   GET employee/:id
 * @desc    get an employee by id
 * */
router.get('/:id', async (req, res) => {
  try {
    const empById = await Employee.findById(req.params.id)
      .populate({path: 'department_id', populate: {path: 'company_id'} });
    res.json(empById);
  } catch (err) {res.status(500).json({error: err.message})}

})


/**
 * @route   GET employee/?key=value&key=value
 * @desc    get an employee by query
 * */
router.get('/', async (req, res) => {
  try {
    const {emp_email, department_id} = req.query;
    
    const empByQuery = await Employee.findOne({emp_email: emp_email, department_id: department_id})
      .populate({path: 'department_id', populate: {path: 'company_id'} });
    
    // get employee id and check if id exists in image schema/model
    const findImg = await Image.findOne({employee_id: empByQuery._id});
    if (!findImg) empByQuery.imgExists = false 
    else empByQuery.imgExists = true

    res.json({emp: empByQuery, imgExists: empByQuery.imgExists});
  } catch (err) {res.status(500).json({error: err.message})}

})

/**
 * @route   GET employee/emp-id/:id
 * @desc    same as get an employee by query but with employee id
 * */
router.get('/emp-id/:id', async (req, res) => {
  try {
    const empByQuery = await Employee.findById(req.params.id)
      .populate({path: 'department_id', populate: {path: 'company_id'} });
    // get employee id and check if id exists in image schema/model
    const findImg = await Image.findOne({employee_id: req.params.id});
    if (!findImg) empByQuery.imgExists = false 
    else empByQuery.imgExists = true

    res.json({emp: empByQuery, imgExists: empByQuery.imgExists});
  } catch (err) {res.status(500).json({error: err.message})}

})

/**
 * @route   POST employee/:id
 * @desc    Update an employee by id
 * */
router.post('/update/:id', async (req, res) => {
  try {
    const {department_id, 
      emp_name,
      emp_email,
      emp_contact_no,
      interview_date,
      hire_date,
      start_date,
      emp_address} = req.body;
    
    //console.log(department_id, emp_name);
    // if department id doesn't exist in departments list
    const deptExists = await Department.findOne({_id: department_id})
      if(!deptExists) return validation('invalidDeptID', res);

    // if missing entry field
    if (!department_id || !emp_name || !emp_contact_no || !emp_contact_no ||
      !interview_date || !hire_date || !start_date || !emp_address)
      return validation('missingEntry', res);

    // if employee already exists
    const existingEmployee = await Employee.findOne({emp_email: emp_email})
      .populate({path: 'department_id', populate: {path: 'company_id'} });

    if (existingEmployee) return validation('existingEmployee', res);
    
    // if no termination date:
    let termination_date = req.body.termination_date;
    if (!termination_date) termination_date = null;

    const empToUpdate = await Employee.findOneAndUpdate({_id: req.params.id}, {
      department_id: department_id,
      emp_name: emp_name,
      emp_email: emp_email,
      emp_contact_no: emp_contact_no,
      emp_address: emp_address,
      interview_date: Date.parse(interview_date),
      hire_date: Date.parse(hire_date),
      start_date: Date.parse(start_date),
      termination_date: termination_date !== null ? Date.parse(termination_date) : null
    }, {useFindAndModify: false});
    /* console.log(empToUpdate)
    console.log('termination date:', termination_date) */
    res.send({msg: 'update successful!', emp: empToUpdate})
  
  } catch (err) {res.status(500).json({error: err.message})}
})

router.delete('/delete/:id', async (req, res) => {
  try {
    // delete employee image
    const delEmpImg = await Image.deleteMany({employee_id: req.params.id});
    const delEmployee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!delEmployee) return validation('invalidDelete', res)
    
    res.json({msg: 'Employee deleted!', emp: delEmployee, img: delEmpImg});

  } catch (err) { res.status(500).json({error: err.message}) }
})

module.exports = router;