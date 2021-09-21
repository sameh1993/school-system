const router = require("express").Router()
const classController = require("../controller/class.controller")

const bodyParser = require("body-parser")

router.get("/", classController.getClassesHomePage)

router.get("/class-list", bodyParser.urlencoded({ extended: true }), classController.getLanguageForClass)

router.post("/change-teacher", bodyParser.json(), classController.changeTeacher)

module.exports = router