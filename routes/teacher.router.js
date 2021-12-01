
const router = require("express").Router()
const teacherController = require("../controller/teacher.controller")
const multer = require("multer")
const bodyParser = require("body-parser").urlencoded({ extended: true })

router.get("/", teacherController.getTeacherHome)


router.get('/add', teacherController.getAddTeacherPage)

router.get("/teacher-schedule", teacherController.getTeeacherSchedulePage)

router.post('/add',
multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'assets/image/teachers')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname )
    }
  })
}).single('image'),
teacherController.postNewTeacher)

router.post("/search", bodyParser, teacherController.postSearchTeacher)

router.post("/delete/:id", bodyParser, teacherController.getDeleteTeacher)

router.get("/teacher-schedule/:userid", bodyParser, teacherController.getTeeacherSchedulePage)

router.get("/:id", teacherController.displayTeacherData)

module.exports = router