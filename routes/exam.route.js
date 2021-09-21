const router = require("express").Router()
const examController = require("../controller/exam.controller")
const bodyParser = require("body-parser").json()
const bodyParser_mw = require("body-parser").urlencoded({ extended: true })

router.get("/", examController.getResaultPage)

router.get("/create-committees", examController.getCreateCommittees)

router.post("/get-committees", bodyParser_mw, examController.postCommittees)

router.get("/enter-f-term", bodyParser_mw, examController.enterExamResault)

router.get("/enter-l-term", bodyParser_mw, examController.enterExamResaultLastTerm)

router.get("/first-term-result", bodyParser_mw, examController.getPrintResultFirstTerm)

router.get("/last-term-result", bodyParser_mw, examController.getPrintResultLastTerm)

// start api 

const studentSubjectModel = require("../model/stu_subj.model")

router.post('/first-term/add-degree', bodyParser, (req,res, next) => {
    studentSubjectModel.insertOnDegreeFirstTerm(req.body).then(resault => {
        console.log(resault)
    }).catch(err => {
        console.log(err)
    })

})

router.post('/last-term/add-degree', bodyParser, (req,res, next) => {
    console.log(req.body)
    studentSubjectModel.insertOnDegreeLastTerm(req.body).then(() => {
        studentSubjectModel.getTotalResault(req.body).then(resault =>{
            res.json(resault)
        })
    }).catch(err => {
        console.log(err)
    })

})

module.exports = router