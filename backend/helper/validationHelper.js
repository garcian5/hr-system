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
    
    case ("deptDoesNotExist"):
      return res.status(400).json({
        msg: "This Department does not exist."
      });

    case ("compDoesNotExist"):
      return res.status(400).json({
        msg: "This Company does not exist."
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
    // for image
    case ("imgNotExist"):
      return res.status(400).json({
        msg: "Image does not exist."
      });
    // for image
    case ("invalidMimeType"):
      return res.status(400).json({
        msg: "Invalid file type. Please Select an image file with the extension of 'png', 'jpg', or 'jpeg'."
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