const router = require('express').Router();
// Item Model
const Department = require('../models/departmentModel');
const Company = require('../models/companyModel');
const Employee = require('../models/employeeModel');
const Image = require('../models/imageModel');
const ObjectId = require('mongodb').ObjectID;
const validation = require('../helper/validationHelper');

const countEmps = async (dept_id) => {
  const a = await Employee.countDocuments({department_id: dept_id});
  //console.log(a)
  return a;
}

/**
 * @route   GET department/getdept
 * @desc    gets all department info
 * */
router.get('/getdept', async (req, res) => {
  try {
    const allDepts = await Department.find().populate({ path: 'company_id' })
    const finalDepts = [];
    for(depts of allDepts) {
      const temp = await Employee.countDocuments({department_id: depts._id});
      finalDepts.push({
        _id: depts._id,
        company_id: depts.company_id,
        department_name: depts.department_name,
        date_created: depts.date_created,
        num_emps: temp
      })
    }
    
    //console.log(finalDepts)
    res.json({elems: finalDepts})
  } 
  catch (err) {res.status(500).json({error: err.message})}
  /* Department.find()
    .populate({ path: 'company_id' })
    .sort({company_id: 1})
    .exec()
    .then(depts => {
      res.status(200).json({
        elems: depts.map(dept => {          
          return {
            _id: dept._id,
            company_id: dept.company_id,
            department_name: dept.department_name,
            date_created: dept.date_created
          }
        })
      })
    })
    .catch(err=>{res.status(500).json({error: err.message})}); */
});

/**
 * @route   GET department/company/:id
 * @desc    GET departments by company id
 * @access  Public
 * */
router.get('/company/:id', async (req, res) => {
  try {
    const allDepts = await Department.find().populate({ path: 'company_id' })
    const finalDepts = [];
    for(depts of allDepts) {
      if(depts.company_id._id == req.params.id) {        
        const temp = await Employee.countDocuments({department_id: depts._id});
        finalDepts.push({
          _id: depts._id,
          company_id: depts.company_id,
          department_name: depts.department_name,
          date_created: depts.date_created,
          num_emps: temp
        })
      }
    }
    res.json({elems: finalDepts})
  } 
  catch (err) {res.status(500).json({error: err.message})}
  /* Department.find().populate({ path: 'company_id' })
    .exec()
    .then(depts => {      
      res.status(200).json({        
        elems: depts.filter(dept => {
          if(dept.company_id._id == req.params.id) {
            return {
              _id: dept._id,
              company_id: dept.company_id,
              department_name: dept.department_name,
              date_created: dept.date_created
            }
          }
        })
      })
    })
    .catch (err => res.status(500).json({error: err.message})) */
})

/**
 * @route   GET department/:id
 * @desc    GET info of department by id
 * @access  Public
 * */
router.get('/:id', async (req, res) => {
  try{
    const deptById = await Department.findById(req.params.id).populate({ path: 'company_id' })
    res.json(deptById);
  } catch (err) { return res.status(500).json({error: err.message})}
})

/**
 * @route   POST api/employee
 * @desc    create an employee
 * @access  Public (will be private when authentication is written)
 * */
router.post('/adddept', async (req, res) => {
  try {
    const {company_id, department_name} = req.body;

    // if company id doesn't exist in companies list
    const compExists = await Company.findOne({_id: company_id})
    if(!compExists) return validation('invalidCompID', res);
    
    // if required fields aren't entered, send error msg
    if (!department_name || !company_id) return validation('missingEntry', res);

    // if object id is invalid, send error msg
    if (!ObjectId.isValid(company_id)) return validation('invalidCompID', res);

    // if the name exists in the company, send error message
    const existingDeptName = await Department.findOne({department_name: department_name, company_id: company_id});      
    if(existingDeptName) return validation('existingDepartment', res);    
    
    const newDepartment = new Department({
      company_id,
      department_name
    });
  
    const savedDepartment = await newDepartment.save();
    res.json(savedDepartment);
  } catch (err) {res.status(500).json({error: err.message});}
});

/**
 * @route   POST department/update/:id
 * @desc    update a department
 * @access  Public
 * */
router.post('/update/:id', async (req, res) => {
  try {
    const {company_id, department_name} = req.body;

    // if company id doesn't exist in companies list
    const compExists = await Company.findOne({_id: company_id})
    if(!compExists) return validation('invalidCompID', res);
    
    // if required fields aren't entered, send error msg
    if (!department_name || !company_id) return validation('missingEntry', res);

    // if object id is invalid, send error msg
    if (!ObjectId.isValid(company_id)) return validation('invalidCompID', res);

    const updateDept = await Department.findOneAndUpdate({_id: req.params.id}, {
      company_id: company_id,
      department_name: department_name
    }, {useFindAndModify: false});
    
    res.send({msg: 'update successful!', emp: updateDept})
  } catch (err) {res.status(500).json({error: err.message});}
});

router.delete('/delete/:id', async (req, res) => {
  try {
    // check if department exists
    const deptExists = await Department.findById(req.params.id);
    if (!deptExists) return validation('deptDoesNotExist', res);

    // delete image first; find employees within department
    const findEmpsInDept = await Employee.find({department_id: req.params.id});

    // this array is used to record deleted images
    const delImgArray = [];

    // if findEmpsInDept is not empty, iterate through the array and begin deleting images
    if (findEmpsInDept) {
      for (const item of findEmpsInDept) {
        const findImg = await Image.deleteMany({employee_id: item._id});
        if (!findImg) continue; // if no employee img, skip it
        delImgArray.push(findImg)
      }
    }

    // delete employee(s) second
    const delEmpInDept = await Employee.deleteMany({department_id: req.params.id});
    // finally, delete department
    const delDept = await Department.findByIdAndDelete(req.params.id);
    
    if (!delDept) return validation('invalidDelete', res)
    res.json({msg: 'Department deleted!', dept: delDept, emp: delEmpInDept, img: delImgArray});

  } catch (err) { res.status(500).json({error: err.message}) }
})

module.exports = router;