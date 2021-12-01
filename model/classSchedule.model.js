
const db = require("./db").db

exports.getClassSchedulePageByClassId = (id) => {
    return new Promise((resolve, reject) => {
        db(`select *, ( select sub_name from subjects where id = (select subject_id from class_teacher where id = clssch.subject_teacher_id) ) as sub_name , ( select teach_name from teachers where teach_id = (select teacher_id from class_teacher where id = clssch.subject_teacher_id) ) as teach_name from class_schedule clssch where clssch.class_id = ${id}`).then(result => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}

exports.updateClassSchedule = (data) => {
    // return console.log(data)
    return new Promise((resolve, reject) => {
        db(`update class_schedule set subject_teacher_id = ${+data.teacher_subject_id} where section_id = ${+data.id} `).then(() => {
            resolve({ msg: "تم تحديث البيانات" })
        }).catch(err => {
            reject({ err: err })
        })
    })
}

exports.getClassScheduleByTeacherId = (id) => {
    // return console.log(id)
    return new Promise((resolve, reject) => {
        db(`select section_name, day_id, ( select sub_name from subjects where id = subject_id ) as sub_name, ( select class_name from classes where id = clt.class_id ) as class_name from class_schedule clssch join class_teacher clt on clssch.subject_teacher_id = clt.id where clt.teacher_id = 200320`).then(result => {
            resolve(result)
        }).catch(err => {
            reject({ err: err })
        })
    })
}



