

const db = require("../model/db").db
exports.getHomePage = (req, res, next) => {
    db('select sex, level_id from students').then(resault => {
        res.render("index", {
            // configeration page
            title: "Home Page",
            schoolName: req.dataSchool.recordset[0].school_name,
            activeTab : 'home',
            currentUser: req.session.currentUser,
            controlLevel : req.session.controlLevel,
            // data Page
            students: resault.recordset
        })
    })
}