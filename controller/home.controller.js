

const db = require("../model/db").db

exports.getHomePage = (req, res, next) => {
    db('select sex, level_id from students').then(resault => {
        db("select count(*) as teacherCount from teachers").then(teaccherCount => {
            res.render("index", {
                // configeration page
                title: "Home Page",
                schoolName: req.dataSchool.recordset[0].school_name,
                activeTab : 'home',
                currentUser: req.session.currentUser,
                controlLevel : req.session.controlLevel,
                // data Page
                students: resault.recordset,
                teacherCount : teaccherCount.recordset[0].teacherCount
            })
        })
    })
}