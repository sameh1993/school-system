// import modules
const router = require("express").Router()
const studentController = require("../controller/student.controller")
const guideAuth = require("../views/parts/guide.auth")

// import libarary
const multer = require("multer");
const bodyParser = require("body-parser")
const check = require("express-validator").check

router.get("/", studentController.getStudentPage)

router.get("/add", guideAuth.isAuth, studentController.getPageAddNewPage)

router.post("/add",
multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'assets/image/students')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname )
    }
  })
}).single('image'),
// check("f_name").not().isEmpty().withMessage("the field is required").not().isAlphanumeric().withMessage('you must be charcters'),
// check("l_name").not().isEmpty().withMessage("the field is required").not().isAlpha().withMessage('you must be charcters'),
// check("nationality").not().isEmpty().withMessage("the field is required").not().isAlpha().withMessage('you must be charcters'),
// check("sex").not().isEmpty().withMessage("the field is required").not().isAlphanumeric().withMessage('you must be charcters'),

 studentController.postAddNewStudent)
  
 router.get("/search", bodyParser.urlencoded({ extended: false }), studentController.searchStudentData)

 router.post("/delete", bodyParser.urlencoded({ extended: true }), studentController.postDeleteStudentBySsn)

 router.get("/classlist", bodyParser.urlencoded({ extended: true }), studentController.postClassList )

 router.get("/level-convert", bodyParser.urlencoded({extended:true}), studentController.getLevelAndClasses)

 router.get("/:id", bodyParser.urlencoded({extended: true}), studentController.getStudentBySsn)

 // Student Apis

 router.post("/convert-level", bodyParser.json(), studentController.postconvertLevelAndClass)

module.exports = router