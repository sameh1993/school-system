
const db = require("../model/db").db

exports.getLangaugeForClass = (data) => {
    return new Promise((resolve, reject) => {
        db(`select * , (select sub_name from subjects where id = subject_id)  as 'subj_name'  from teacher_class tc where class_id = ${data}`).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    })
}