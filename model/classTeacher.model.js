

const db = require("./db").db

// for edit class schedule page getAllTeacherClassId
exports.getAllTeacherClassId = (id) => {
    return new Promise((resolve, reject) => {
        db(`select *, ( select teach_name from teachers where teach_id = teacher_id ) as teach_name, ( select sub_name from subjects where id = subject_id ) as sub_name from class_teacher where teacher_id is not null and class_id = ${+id}`).then(result => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}

exports.getAllTeacherforClassbyClassId = (id) => {
    return new Promise((resolve, reject) => {
        db(`select *, ( select teach_name from teachers where teach_id = teacher_id ) as teach_name, ( select sub_name from subjects where id = subject_id ) as sub_name from class_teacher where class_id = ${+id}`).then(result => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}


exports.getAllClassesForByTeahcherid = (id) => {
    return new Promise((resolve, reject) => {
        db(`select class_id, (select class_name from classes where id = class_id) as class_name from class_teacher where teacher_id=${id}`).then(result => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}