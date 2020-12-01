/**
 * Helper functions
 */

/**
 * This method will switch between which condition should be run
 * @param {string} type 
 *      = a string of the type of condition
 * @param {async variable} res
 */ 
module.exports = validationHelper = (type, res) => {
  switch (type) {
    // register/login
    case ("missingEntry"):
      return res.status(400).json({
        msg: "Please Enter all the required fields."
      });
    
    case ("invalidDeptID"):
      return res.status(400).json({
        msg: "Invalid Department Id."
      });
    
    case ("invalidCompID"):
      return res.status(400).json({
        msg: "Invalid Company Id."
      });

    case ("existingEmployee"):
      return res.status(400).json({
        msg: "An Employee with this email already exists."
      });

    case ("existingCompany"):
      return res.status(400).json({
        msg: "A company with this name already exists."
      });

    case ("existingDepartment"):
      return res.status(400).json({
        msg: "A department with this name in the company already exists."
      });
    
    // for image
    case ("duplicateEmpId"):
      return res.status(400).json({
        msg: "This employee already has an existing image, would you like to replace it?"
      });
    // for image
    case ("empDoesNotExist"):
      return res.status(400).json({
        msg: "This employee does not exist."
      });
    // for image
    case ("invalidImgDel"):
      return res.status(400).json({
        msg: "Image could not be deleted."
      });

    case ("invalidDelete"):
      return res.status(400).json({
        msg: "Delete invalid."
      });

    case ("invalidUpdate"):
      return res.status(400).json({
        msg: "Update invalid."
      });

    default:
      return console.log(type + " helper!!!!");
  }
}