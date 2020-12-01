const router = require('express').Router();
// helper function for error messages
const validation = require('../helper/validationHelper');

// import image model
const Image = require('../models/imageModel');
const Employee = require('../models/employeeModel')

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
  //console.log(req.file)

  const obj = {
    employee_id: req.file.originalname,
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
    //console.log(req.file)
    // find image if it exists, if not, return a flag indicating it doesn't exist.
    const findImg = await Image.findOne({employee_id: req.params.id});
    if (!findImg) return res.json({imgExist: false});

    const imgToUpdate = await Image.findOneAndUpdate({employee_id: req.params.id}, {
      employee_id: req.params.id,
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


module.exports = router;