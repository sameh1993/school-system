
// const db = require("../model/db").db
const authModel = require("../model/auth.model")
const validatorResult = require("express-validator").validationResult

exports.getLogin = (req, res, next) => {
    res.render("login", {
        // login configration
        title: "Login Page",
        // page date
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationError")
    })
}

exports.postLogin = (req, res, next) => {
    if (validatorResult(req).isEmpty()) {
        authModel.loginUser(req.body).then(result => {
            res.redirect("/")
            req.session.userid = result.id
            req.session.currentUser = {
                name : result.name,
                image: result.image
            }
            req.session.controlLevel = result.isAdmin
            req.session.save()
            console.log(result)
        }).catch(err => {
            req.flash("authError", err)
            res.redirect("/auth/login")
        })
    } else {
        req.flash("validationError", validatorResult(req).array())
        res.redirect("/auth/login")
    }

}

exports.getRegister = (req, res, next) => {
    // console.log(req.flash("registerMsg")[0])
    res.render("register", {
        authError: req.flash("authRegistErrors")[0],
        validatErrors: req.flash("validregisterErrors"),
        registeMsg: req.flash("registerMsg")[0]
    })
}

exports.postRegister = (req, res, next) => {

    if (validatorResult(req).isEmpty()) {
        authModel.RegisterNewUSer(req.body).then(result => {
            res.redirect("/auth/register")
            req.flash("registerMsg", result)
        }).catch(err => {
            req.flash("authRegistErrors", err)
            res.redirect("/auth/register")
        })
    } else {
        req.flash("validregisterErrors", validatorResult(req).array())
        res.redirect("/auth/register")
    }

}

exports.logOut = (req, res, next) => {
    req.session.destroy(function (err) {
        res.redirect('/auth/login'); //Inside a callback… bulletproof!
    });
}