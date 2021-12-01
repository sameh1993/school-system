// import models 
const studentModel = require("../model/students.model");
const classesModel = require("../model/classes.model");
const sub_student = require("../model/stu_subj.model");
const committeesModel = require("../model/committees.model")
const classTeacher = require("../model/classTeacher.model")

const fs = require('fs')
const db = require("../model/db").db
const studentValidator = require("express-validator").validationResult

exports.getStudentPage = (req, res, next) => {
    db("select * from levels").then(levelList => {
        classesModel.getAllClasses().then(classList => {
            const userid = req.session.userid
            classTeacher.getAllClassesForByTeahcherid(userid).then(classesForTeacher => {
                res.render('students', {
                    classList: classList.recordset,
                    levels: levelList.recordset,
                    title: "Student Page",
                    activeTab: 'student',
                    SchoolName: req.dataSchool.recordset[0].school_name,
                    currentUser: req.session.currentUser,
                    controlLevel: req.session.controlLevel,
                    teacherClasses: userid ? classesForTeacher.recordset : ""
                })
            })
        })
    })

}

exports.getPageAddNewPage = (req, res, next) => {
    classesModel.getAllClasses().then(resault => {
        db(`select * from levels`).then(levels => {
            res.render('add-student', {
                // configeration page
                title: "Student Page",
                activeTab: 'student',
                SchoolName: req.dataSchool.recordset[0].school_name,
                currentUser: req.session.currentUser,
                // body page
                classList: resault.recordset,
                levels: levels.recordset,
                controlLevel: req.session.controlLevel,
                errorValidator: req.flash('validError')
            })
        })
    }).catch(err => {
        console.log(err)
    })


}

exports.postAddNewStudent = (req, res, next) => {
    if (studentValidator(req).isEmpty()) {
        const image = req.file ? req.file.filename : ''
        studentModel.addNewStudent(req.body, image).then(() => {
            sub_student.addNewStudentLang(req.body.ssn, req.body.level).then(() => {
                res.redirect(`/student/${+req.body.ssn}`)
            }).catch(error => {
                console.log(error)
            })
        }).catch(error => {
            console.log(error)
        })
    } else {
        req.flash('validError', studentValidator(req).array())
        res.redirect("/student/add")
    }

}

exports.getStudentBySsn = (req, res, next) => {
    studentModel.searchStudentBySsn({searchValue : +req.params.id}).then(resault => {
        res.render("student-module/data-student", {
            // configeration page
            title: "Data Student",
            activeTab: 'student',
            SchoolName: req.dataSchool.recordset[0].school_name,
            currentUser: req.session.currentUser,
            controlLevel: req.session.controlLevel,
            // body page
            student: resault.recordset[0]
        })
    })
}


exports.searchStudentData = (req, res, next) => {
    // return console.log(req.query) 
    if (req.query.search == 'name') {
        
        studentModel.seatchStudentByName(req.query).then(resault => {
            res.render("student-module/search-resault", {
                // configeration page
                title: "Search Page",
                activeTab: 'student',
                SchoolName: req.dataSchool.recordset[0].school_name,
                currentUser: req.session.currentUser,
                controlLevel: req.session.controlLevel,
                // body page
                students: resault.recordset
            })
        }).catch(err => {
            console.log(err)
        })
    } else {
        studentModel.searchStudentBySsn(req.query).then(resault => {
            res.render("student-module/data-student", {
                // configeration page
                title: "Search Page",
                activeTab: 'student',
                SchoolName: req.dataSchool.recordset[0].school_name,
                currentUser: req.session.currentUser,
                controlLevel: req.session.controlLevel,
                // body page
                student: resault.recordset[0]
            })
        }).catch(err => {
            console.log(err)
        })
    }
}




exports.getClassList = (req, res, next) => {
    // return console.log(req.query)
    studentModel.getClassListOfStudent(req.query).then(resault => {
        db('select * from configeration').then(config => {
            db(`select class_name, ( select level_name from levels where level_id = a.level_id ) as levelName from classes a where id = ${+req.query.class}`).then(classRes => {
                    res.render("student-module/class-list", {
                        // configeration page
                        title: "Student Page",
                        activeTab: 'student',
                        SchoolName: req.dataSchool.recordset[0].school_name,
                        currentUser: req.session.currentUser,
                        controlLevel: req.session.controlLevel,
                        // body page
                        students: resault.recordset,
                        config: config.recordset[0],
                        className: classRes.recordset[0].class_name,
                        levelName : classRes.recordset[0].levelName
                    })
            })
        })

    }).catch(err => {
        console.log(err)
    })
}


exports.postDeleteStudentBySsn = (req, res) => {
    committeesModel.deleteStudentBySsn(+req.body.ssn).then(() => {
        sub_student.deleteStudentBySsn(+req.body.ssn).then(() => {
            studentModel.deleteStudentBySsn(+req.body.ssn).then(resault => {
                fs.unlink(`assets/image/students/${req.body.image}`, err => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    res.redirect("/student")
                })
            }).catch(err => {
                console.log(err)
            })
        }).catch(error => {
            res.redirect("/student")
        })
    })

}

exports.getLevelAndClasses = (req, res, next) => {
    db("select * from levels").then(levelList => {
        classesModel.getAllClasses().then(classList => {
            db(`select ssn, f_name, l_name from students where ssn = ${req.query.ssn}`).then(dataStudent => {
                res.render("student-module/level-convert", {
                    // configeration page
                    title: "convert student level",
                    activeTab: 'student',
                    SchoolName: req.dataSchool.recordset[0].school_name,
                    currentUser: req.session.currentUser,
                    controlLevel: req.session.controlLevel,
                    // data page
                    levelList: levelList.recordset,
                    classList: classList.recordset,
                    dataStudent: dataStudent.recordset
                })
            })
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.postconvertLevelAndClass = (req, res, next) => {
    studentModel.editLevelClassBySsn(req.body).then(result => {
        if (result.rowsAffected[0] == 1) {
            res.json({
                result: "تم تحويل الطالب"
            })
        } else {
            res.json({
                err: "لم يتم تحويل الطالب يرجى المحاله ثانيه"
            })
        }

    }).catch(err => {
        console.log(err)
    })
}