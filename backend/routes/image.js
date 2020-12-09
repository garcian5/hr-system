const router = require('express').Router();
// helper function for error messages
const validation = require('../helper/validationHelper');

// import image model
const Image = require('../models/imageModel');
const Company = require('../models/companyModel');
const Department = require('../models/departmentModel');
const Employee = require('../models/employeeModel');

// import file system and middleware multer for uploading images
// import path so we can define path of the image we are uploading
const fs = require('fs');
const path = require('path');
const multer = require('multer');

/**
 * BUILDING MIDDLEWARE
 */
// SET STORAGE ENGINE
const storage = multer.diskStorage({
  // destination will have request and file variables as well as a callback function
  // destination is where we want our files uploaded to
  destination: (req, file, cb) => {    
    // this callback function will execute if the file is valid if file invalid it will not upload
    // we can add an error message in here but we are going to put null right now.
    cb (null, 'client/public/uploads');
  },
  // filename is gonna be a function that takes in these parameters with a callback function
  filename: (req, file, cb) => {
    // the filename has to be unique which is why we're putting a timestamp into the filename
    // like in destination, if this fails, it will not upload the file
    // path.extname will extract the extension of the file (we need this so we can add the extension name of the file)
    cb (null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

// INIT UPLOAD
const upload = multer({storage: storage}).single('image')

router.post('/', upload, async (req, res, next) => {
  // object destructuring
  //const {employee_id, img_name} = req.body;
  // if the submitted type is not of image and/or is a gif, send error message
  
  if (!req.file.mimetype.match('^image') || req.file.mimetype === 'image/gif') {
    return validation('invalidMimeType', res)
  }
  const obj = {
    image: {
      data: fs.readFileSync(path.join('client/public/uploads/' + req.file.filename)),
      contentType: 'image/png' || 'image/jpeg' || 'image/jpg'
    }
  }

  /* const duplicateEmp = await Image.findOne({employee_id: req.file.originalname});
  const existingEmp = await Employee.findOne({_id: req.file.originalname});
  // if the employee has an image already
  if (duplicateEmp) return validation('duplicateEmpId', res)
  // if the employee does not exist in the database, return an error message saying employee doesn't exist
  if (existingEmp) return validation('empDoesNotExist', res) */
  //console.log('img obj:', obj)
  const savedImg = await Image.create(obj)
  //console.log(savedImg);
  await savedImg.save();

  res.json({msg: 'image uploaded!', img: {savedImg}, file: req.file});
})

/**
 * @route   POST image/:emp_id
 * @desc    Update an image by id
 * */
router.post('/update/:id', upload, async (req, res) => {
  try {
    
    // if the submitted type is not of image and/or is a gif, send error message
    if (!req.file.mimetype.match('^image') || req.file.mimetype === 'image/gif') {
      return validation('invalidMimeType', res)
    }
    // find image if it exists, if not, return a flag indicating it doesn't exist.
    const findImg = await Image.findOne({employee_id: req.params.id});
    if (!findImg) return res.json({imgExist: false});

    const imgToUpdate = await Image.findOneAndUpdate({employee_id: req.params.id}, {
      image: {
        data: fs.readFileSync(path.join('client/public/uploads/' + req.file.filename)),
        contentType: 'image/png' || 'image/jpeg' || 'image/jpg'
      }
    }, {useFindAndModify: false});
  /* console.log(empToUpdate)
  console.log('termination date:', termination_date) */
  res.send({msg: 'update successful!', imgExist: true, img: imgToUpdate})
  
  } catch (err) {res.status(500).json({error: err.message})}
})

/**
 * ROUTES
 */
router.get('/emp-id-only', async (req, res) => {
  const getImgs = await Image.find({}).select('employee_id');
  res.json(getImgs)
})

/**
 * Get image by image id
 */
router.get('/:id', async(req, res) => {
  try {
    const findImg = await Image.findById(req.params.id)
      .populate({path: 'employee_id', populate: {path: 'department_id', 
                populate: 'company_id'} });
    res.json(findImg);
  } catch (err) {res.status(500).json({error: err.message})}
})

/**
 * Get image by employee id
 */
router.get('/emp-img/:id', async(req, res) => {
  try {
    //console.log(req.params.id)
    const findImg = await Image.findOne({employee_id: req.params.id})
      .populate({path: 'employee_id', populate: {path: 'department_id', populate: 'company_id'} });
    res.json(findImg);
  } catch (err) {res.status(500).json({error: err.message})}
})

/**
 * @route   POST images/by-company/:id
 * @desc    Get employees & images by company id
 * */
router.get('/by-company/:id', async (req, res) => {
  try {
    const depts = await Department.find({company_id: req.params.id});
    const countDepts = await Department.countDocuments({company_id: req.params.id});
    const employees = [];
    const empByCompWImg = [];
    let empCount = 0;

    // iterate through departments and find employees by every department id of depts
    for(const dept of depts){
      const emps = await Employee.find({department_id: dept._id})
        .populate({path: 'department_id', populate: {path: 'company_id'}});
      empCount += await Employee.countDocuments({department_id: dept._id});   
      
      // if emps is empty, skip
      if (emps.length === 0) continue;

      // iterate through emps and find images by every employee id of emps
      for (const emp of emps) {        
        const img = await Image.findOne({employee_id: emp._id})
          .populate({path: 'employee_id', populate: {path: 'department_id', populate: 'company_id'} });
        if (!img) {
          // store emps in array if it doesn't have image
          employees.push(emp);
          continue;
        };
        empByCompWImg.push(img);
      }
      // store emps in array
      //employees.push(emps);      
    }

    res.json({depts: depts, deptCount: countDepts, emps: employees, empCount: empCount, empsWimg: empByCompWImg});
  } catch (error) {res.status(500).json({error: error.message})}
})

/**
 * Delete image by image id
 */
router.delete('/del-image/:id', async (req, res) => {
  try {
    const imgExists = await Image.findById(req.params.id);
    if (!imgExists) return validation('imgNotExist', res);

    const delImg = await Image.findByIdAndDelete(req.params.id);

    res.json({msg: 'Image deleted!', img: delImg})
  } catch (err) {res.status(500).json({error: err.message})}
})


module.exports = router;