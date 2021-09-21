const db = require("../model/db").db


exports.getTeacherById = (data) => {

    return new Promise((resolve, reject) => {
        db(`select * from teachers where teach_id=${data}`).then(result =>{
            resolve(result)
        }).catch(err =>{
            reject(err)
        })
    })
}

exports.getTeacherByName = (data) => {
    return new Promise((resolve, reject) => {
        db(`select * from teachers where teach_name like N'%${data}%'`).then(result =>{
            resolve(result)      
        }).catch(err =>{
            reject(err)
        })
    })
}

exports.addNewTeacher = (data, image) => {
    return new Promise((resolve, reject) => {
        db(`insert into teachers 
        ( teach_id, ssn, teach_name, address, sex, religion, b_date, natainality, phone_no, phone_no2, certificates, graduation_date, hiring_date, specialazition, image, teaching_subj)
        values ( ${+data.teach_id}, N'${data.ssn}', N'${data.teach_name}', N'${data.address}', ${+data.sex}, N'${data.religion}', N'${data.b_date}', N'${data.nationality}', N'${data.phone_no}', N'${data.phone_no2}', N'${data.certificate}', N'${data.grad_date}', N'${data.hiring_date}', N'${data.specialazition}', N'${image}', N'${data.teaching_subj}' )`).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })  
    })
}

exports.deleteTeacherById = (data) => {
    console.log(data)

   return new Promise((resolve, reject) => {
       db(`delete from teachers where teach_id=${data}`).then(result =>{
           resolve(result)
       }).catch(err =>{
           reject(err)
       })
   })
}