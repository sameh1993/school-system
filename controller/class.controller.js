

const db = require("../model/db").db

const teachClassModel = require('../model/teach.class.model')

exports.getClassesHomePage = (req, res) => {
    db('select * from configeration').then(result => {
        db("select id, class_name from classes").then(classes => {
            res.render("class", {
                SchoolName: result.recordset[0].school_name,
                currentUser: req.session.currentUser,
                controlLevel: req.session.controlLevel,
                title: "الفصل",
                activeTab: 'class',
                classList: classes.recordset
            })
        })
    })
}


exports.getLanguageForClass = (req, res, next) => {
    db(`select class_name from classes where id = ${req.query.classId}`).then(className => {
        teachClassModel.getLangaugeForClass(+req.query.classId).then(langs => {
            db('select teach_id, teach_name, teaching_subj from teachers').then(teachers => {
                res.render("class-module/class-lang-list", {
                    SchoolName: req.dataSchool.recordset[0].school_name,
                    currentUser: req.session.currentUser,
                    controlLevel: req.session.controlLevel,
                    title: "الفصل",
                    activeTab: 'class',
                    className: className.recordset[0].class_name,
                    teachers: teachers.recordset,
                    classLangs: langs.recordset
                })
            })
        })
    })
}


exports.changeTeacher = (req, res) => {
    db(`update teacher_class set teach_id=${req.body.teachId} where class_id=${req.body.classId} and subject_id=${req.body.subjId}`).then(result => {
        console.log(result)
    }).catch(error => {
        console.log(error)
    })
}