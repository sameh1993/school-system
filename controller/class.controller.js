

const db = require("../model/db").db

const teachClassModel = require('../model/classTeacher.model')
const classScheduleModel = require("../model/classSchedule.model")
const classTeacher = require("../model/classTeacher.model")

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
    // return console.log(req.query)
    db(`select id, class_name from classes where id = ${+req.query.classId}`).then(className => {
        teachClassModel.getAllTeacherforClassbyClassId(+req.query.classId).then(langs => {
            db('select teach_id, teach_name, teaching_subj from teachers').then(teachers => {
                // return console.log(langs)
                res.render("class-module/class-lang-list", {
                    SchoolName: req.dataSchool.recordset[0].school_name,
                    currentUser: req.session.currentUser,
                    controlLevel: req.session.controlLevel,
                    title: "الفصل",
                    activeTab: 'class',
                    classDetails: className.recordset[0],
                    teachers: teachers.recordset,
                    classLangs: langs.recordset
                })

            })
        })
    })
}

exports.getClassSchedulePage = (req, res) => {
    // return console.log(req.query)
    db(`select id, class_name from classes where id = ${+req.query.classId}`).then(className => {
        classScheduleModel.getClassSchedulePageByClassId(+req.query.classId).then(classSchedule => {
            res.render("class-module/class-schedule-page", {
                SchoolName: req.dataSchool.recordset[0].school_name,
                currentUser: req.session.currentUser,
                controlLevel: req.session.controlLevel,
                title: "الفصل",
                activeTab: 'class',
                classDetails: className.recordset[0],
                classSchedule: classSchedule.recordset
            })
        })
        
    })
    
}

exports.getEditClassSchedulePage = (req, res) => {
    db(`select id, class_name from classes where id = ${+req.query.classId}`).then(className => {
        classScheduleModel.getClassSchedulePageByClassId(+req.query.classId).then(classSchedule => {
            classTeacher.getAllTeacherClassId(+req.query.classId).then(teacherClass => {
                // return console.log(teacherClass.recordset)
                res.render("class-module/edit-class-schedule", {
                    SchoolName: req.dataSchool.recordset[0].school_name,
                    currentUser: req.session.currentUser,
                    controlLevel: req.session.controlLevel,
                    title: "الفصل",
                    activeTab: 'class',
                    classDetails: className.recordset[0],
                    classSchedule: classSchedule.recordset,
                    teacherClass: teacherClass.recordset
                })
            })
        }) 
    })
}

exports.changeTeacher = (req, res) => {
    // return console.log(req.body)
    db(`update class_teacher set teacher_id=${+req.body.teachId} where class_id=${+req.body.classId} and subject_id=${+req.body.subjId}`).then(result => {
        res.json({ msg: "تم تحديث البيانات" })
    }).catch(error => {
        res.json({ err: "حدث خطا يرجى المحاله مره اخرى" })
    })
}



exports.postEditClassSchedule = (req, res) => {
        classScheduleModel.updateClassSchedule(req.body).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
}