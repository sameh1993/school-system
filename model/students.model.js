const mssql = require("mssql")

var config = {
    user: 'sa',
    password: 'admin123456',
    server: 'localhost',
    database: 'schoolDB',
    options: {
        trustServerCertificate: true
    },
}

const db = require("./db").db

exports.addNewStudent = (data, image) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if (!err) {
                const request = new mssql.Request()
                const dateFormat = data.b_date.split("-")
                request.query(`insert into students values ( ${+data.ssn}, ${+data.student_id}, N'${data.f_name}', N'${data.l_name}', N'${data.address}', ${+data.sex}, N'${data.religion}', '${dateFormat[2]}-${dateFormat[1]}-${dateFormat[0]}', N'${data.nationality}', N'${data.home_no}', N'${data.parent_no}', N'${data.student_status}', ${+data.class}, ${+data.level}, N'${image}')`, (err, recordset) => {
                    if(!err) {
                       resolve(recordset) 
                    } else {
                        reject(err)
                    }
                })
            } else {
                reject(err)
            }
        })
    })
}

exports.searchStudentBySsn = (data) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if(!err) {
                const request = new mssql.Request()
                request.query(`select *, (select class_name from classes s where s.id = a.class_id  ) as class_name from students a where ssn = ${data}`, (error, recordset) => {
                    if(!error) {
                        resolve(recordset)
                    } else {
                       reject(error)
                    }
                })
            } else {
                reject(err)
            }
        })
    })
}

exports.seatchStudentByName = (data) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if(!err) {
                const request = new mssql.Request()
                request.query(`select a.ssn, a.f_name +' '+ a.l_name as fullName, b.class_name, a.parent_no, image from students a inner join classes b on a.class_id = b.id where a.f_name +' '+ l_name like N'%${data}%'`, (error, recordset) => {
                    if(!error) {
                        resolve(recordset)
                    } else {
                        reject(error)
                    }
                })
            } else {
                reject(err)
            }
        })
    })
}

exports.getClassListOfStudent = (data) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if(!err) {
                const  request = new mssql.Request()
                request.query(`select f_name, l_name, b_date, sex from students where level_id = ${+data.level} and class_id = ${+data.class}`, (err, resault) => {
                   if(!err) {
                    resolve(resault)
                   } else {
                       reject(err)
                   }
                })
            } else {
                reject(err)
            }
        })
    })
}

exports.getStudentsByLevelId = (data) => {
    return new Promise((resolve, reject) => {
        db(`select ssn, f_name, l_name, (select sitting_no from committees where ssn = a.ssn) as sitting_no from students a where level_id = ${+data.levelId}`).then(result => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}


exports.deleteStudentBySsn = (ssn) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if(!err) {
                const  request = new mssql.Request()
                request.query(`EXEC DeleteStudentById ${ssn}`).then(resault => {
                    resolve(resault)
                }).catch(err => {
                    reject(err)
                })
            }
        }) 
    })
}


/* ===========================================
=============  start student Api ========== */

exports.editLevelClassBySsn = (data) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if(!err) {
                const request = new mssql.Request()
                request.query(`update students set level_id='${data.level}', class_id=${data.class} where ssn=${data.ssn}`).then(resault => {
                    resolve(resault)
                }).catch(err => {
                    reject(err)
                })
            }
        })
    })
}

