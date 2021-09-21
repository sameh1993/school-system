const committeesModel = require("../model/committees.model")
const studentsSubjects = require("../model/stu_subj.model")
const studentModel = require("../model/students.model")
const db = require("../model/db").db

exports.getResaultPage = (req, res, next) => {

    db(`select count(*) as counter from committees`).then(resault => {
        db(`select * from subjects`).then(subjects => {
            res.render("exam", {
                // configeration page
                title: "Exams Page",
                activeTab: 'exam',
                SchoolName: req.dataSchool.recordset[0].school_name,
                currentUser: req.session.currentUser,
                // body page
                committeesCount: resault.recordset[0].counter,
                controlLevel : req.session.controlLevel === 'admin',
                subjects: subjects.recordset
            })
        })
    })
}

exports.getCreateCommittees = (req, res, next) => {
    committeesModel.createCommittees().then(() => {
        res.redirect("/exam")
    })
}

exports.postCommittees = (req, res, next) => {
    committeesModel.getCommitteesByLevelAndSex(req.body).then(resault => {
        db('select * from configeration').then(config => {
            res.render("exams-module/committees", {
                // configeration page
                title: "Exams Page",
                activeTab: 'exam',
                SchoolName: req.dataSchool.recordset[0].school_name,
                currentUser: req.session.currentUser,
                controlLevel : req.session.controlLevel === 'admin',
                // body page
                committees: resault.recordset,
                config: config.recordset[0]
            })
        })
    })
}


exports.enterExamResault = (req, res, next) => {
    // return console.log(req.query)
    studentsSubjects.getexamsResault(req.query).then(resault => {
        db(`select sub_name, (select level_name from levels where level_id = a.sub_level) as level_name from subjects a where id = +${req.query.subjectId}`).then(subj_name => {
            res.render("exams-module/add-mark-term", {
                // configeration page
                title: "Exams Page",
                activeTab: 'exam',
                SchoolName: req.dataSchool.recordset[0].school_name,
                currentUser: req.session.currentUser,
                controlLevel : req.session.controlLevel === 'admin',
                // body page
                subjects: resault.recordset,
                detials: subj_name.recordset[0]
            })
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.enterExamResaultLastTerm = (req, res, next) => {
    // return console.log(req.query)
    studentsSubjects.getexamsResault(req.query).then(resault => {
        db(`select sub_name, exam_degree, success_parcent , (select level_name from levels where level_id = a.sub_level) as level_name from subjects a where id = ${req.query.subjectId}`).then(subj_name => {

            res.render("exams-module/add-mark-last-term", {
                // configeration page
                title: "صفحه الامتحانات",
                activeTab: 'Exams',
                SchoolName: req.dataSchool.recordset[0].school_name,
                currentUser: req.session.currentUser,
                controlLevel : req.session.controlLevel === 'admin',
                // body page
                subjects: resault.recordset,
                detials: subj_name.recordset[0]
            })
        })
    }).catch(err => {
        console.log(err)
    })
}


exports.getPrintResultFirstTerm = (req, res, next) => {
    studentModel.getStudentsByLevelId(req.query).then(students => {
        studentsSubjects.printExamsResult(req.query).then(examsresult => {
            res.render("result/print-result-f-term", {
                // page configeration
                title: "نتيجه الترم الاول",
                activeTab: "exam",
                dataSchool: req.dataSchool.recordset[0],
                currentUser: req.session.currentUser,
                controlLevel : req.session.controlLevel === 'admin',
                // body page
                students: students.recordset,
                examsresult: examsresult.recordset,
                levelID: req.query.levelId
            })
        })
    })

}

exports.getPrintResultLastTerm = (req, res, next) => {

    studentModel.getStudentsByLevelId(req.query).then(students => {
        studentsSubjects.printExamsResult(req.query).then(examsresult => {
            res.render("result/print-result-l-term", {
                // page configeration
                title: "نتيجه الترم الثانى",
                activeTab: "exam",
                dataSchool: req.dataSchool.recordset[0],
                currentUser: req.session.currentUser,
                controlLevel : req.session.controlLevel,
                // body page
                students: students.recordset,
                examsresult: examsresult.recordset,
                levelID: req.query.levelId
            })
        })
    })

}