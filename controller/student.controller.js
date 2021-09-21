const studentModel = require("../model/students.model");
const classesModel = require("../model/classes.model");
const sub_student = require("../model/stu_subj.model");
const committeesModel = require("../model/committees.model")
const fs = require('fs')
const db = require("../model/db").db
const studentValidator = require("express-validator").validationResult

exports.getStudentPage = (req, res, next) => {
    db("select * from levels").then(levelList => {
        classesModel.getAllClasses().then(classList => {
            const userid = req.session.userid
            if (userid) {
                res.render('students', {
                    classList: classList.recordset,
                    levels: levelList.recordset,
                    title: "Student Page",
                    activeTab: 'student',
                    SchoolName: req.dataSchool.recordset[0].school_name,
                    currentUser: req.session.currentUser,
                    controlLevel: req.session.controlLevel,
                })
            } else {
                db(`select class_id from teacher_class where teach_id=${userid}`).then(classes => {
                    // res.render('students', {
                    //     classList: classList.recordset,
                    //     levels: levelList.recordset,
                    //     title: "Student Page",
                    //     activeTab: 'student',
                    //     SchoolName: req.dataSchool.recordset[0].school_name,
                    //     currentUser: req.session.currentUser,
                    //     controlLevel: req.session.controlLevel,
                    //     arrowedClasses: classes.recordset
                    // })
                    console.log(classList.recordset)
                    console.log(classes.recordset)
                })
            }
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
    studentModel.searchStudentBySsn(+req.params.id).then(resault => {
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
    if (req.query.search == 'ssn') {
        studentModel.searchStudentBySsn(+req.query.searchValue).then(resault => {
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
    } else {
        studentModel.seatchStudentByName(req.query.searchValue).then(resault => {
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
    }
}




exports.postClassList = (req, res, next) => {

    studentModel.getClassListOfStudent(req.query).then(resault => {
        db('select * from configeration').then(config => {
            db(`select class_name from classes where id = ${+req.query.class}`).then(classRes => {
                db(`select level_name from levels where level_id = ${+req.query.level}`).then(levelRes => {
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
                        levelName: levelRes.recordset[0].level_name
                    })
                })
            })
        })

    }).catch(err => {
        console.log(err)
    })
}


exports.postDeleteStudentBySsn = (req, res) => {

    // return console.log(req.body)
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
                result: "لم يتم تحويل الطالب يرجى المحاله ثانيه"
            })
        }

    }).catch(err => {
        console.log(err)
    })
}