const router = require("express").Router()

const bodyParser = require("body-parser")
const check = require("express-validator").check
const authController = require("../controller/auth.controller")
const guideControl = require("../views/parts/guide.auth")

router.get("/register", guideControl.isAdmin, authController.getRegister)

router.post("/register",
    bodyParser.urlencoded({ extended: true }),
    check("teachId")
        .not().isEmpty().withMessage("this Field is Required")
        .isInt().withMessage("you must enter a integer")
        .trim().escape(),
    check("confirmPass")
        .custom((value, { req }) => {
            if (value === req.body.confirmPass) return true
            else throw 'passwords are not match'
        })
        .trim().escape(),
    check("control")
        .not().isEmpty().withMessage("this field is requested")
        .trim().unescape(),
    authController.postRegister)

router.get("/login", guideControl.notAuth, authController.getLogin)

router.post("/login",
    bodyParser.urlencoded({ extended: true }),
    check("teachId")
        .not().isEmpty().withMessage("this Field is Required")
        // .isInt().withMessage("you must enter a integer")
        .trim().escape(),
    check("password")
        .isLength({ min: 6 }).withMessage('this field must be at least 6 letter')
        .trim().escape()
    , authController.postLogin)


router.get("/logout", authController.logOut)

module.exports = router



