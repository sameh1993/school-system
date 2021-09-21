const router = require("express").Router()
const guideAuth = require("../views/parts/guide.auth")
const HomeController = require("../controller/home.controller")

router.get("/", guideAuth.isAuth, HomeController.getHomePage)

module.exports = router