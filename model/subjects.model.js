

const db = require("./db").db



exports.getSubjectsByClassId  = (id) => {
    return new Promise((resolve, reject ) => {
        db(`select *, (select sub_name from subjects where id = subject_id) as sub_name from class_teacher where class_id = ${id}`).then(result => {
            resolve(result)   
        }).catch(err => {
            reject(err)
        })
    })
}