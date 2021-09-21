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

const db = require("../model/db").db

exports.addNewStudentLang = (ssn, levelId) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if(!err) {
                const request = new mssql.Request()

                request.query(`insert into students_subjects ( student_id, subject_id ) select  ${+ssn}, id from subjects where sub_level = ${+levelId}`, (error, resault) => {
                    if(!error) {
                        resolve(resault)
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


exports.getexamsResault = (data) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, error => {
            if(!error) {
                const request = new mssql.Request()
                request.query(`select a.subject_id, a.total_resault, b.sitting_no, b.fullname, a.works_f_term, a.f_term_degree, a.works_l_term, a.l_term_degree, b.ssn from students_subjects a inner join committees b on a.student_id = b.ssn where a.subject_id = ${+data.subjectId}`, (err, recordset) => {
                    if(!err) {
                        resolve(recordset)
                    } else {
                        reject(err)
                    }
                })
            } else {
                reject(error)
            }
        })
    })
}

exports.insertOnDegreeFirstTerm = ( data ) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if(!err) {
                const request = new mssql.Request()
                request.query(`update students_subjects set works_f_term = ${+data.workFTerm}, f_term_degree = ${+data.ftermdegree} where student_id=${+data.ssn} and subject_id=${+data.subjectId}`, (err, resault) => {
                    if(!err) {
                        resolve(resault)
                    } else {
                        reject(err)
                    }
                }).catch
            }
        })
    })
}

exports.insertOnDegreeLastTerm = ( data ) => {
    
    return new Promise((resolve, reject) => {
        mssql.connect(config, error => {
            if(!error) {
                const request = new mssql.Request()
                request.query(`EXEC insertLastTermResault ${data.worklTerm}, ${data.ltermdegree}, ${data.ssn}, ${data.subjectId}`, (err, resault) => {
                    if(!err) {
                        resolve(resault)
                    } else {
                        reject(err)
                    }
                })
            } else {
                reject(error)
            }
        })
    })
}

exports.getTotalResault = (data) =>{
    return new Promise((resolve, reject) => {
        mssql.connect("config", err => {
            if(!err) {
                const request = new mssql.Request()
                request.query(`select total_resault from students_subjects where student_id = ${data.ssn} and subject_id = ${data.subjectId}`, (error, resault) =>{
                    if(!error) {
                        resolve(resault.recordset[0])
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

exports.printExamsResult = (data) =>{
    return new Promise((resolve, reject) => {
        db(`select a.sub_name, b.f_term_degree, b.l_term_degree, b.student_id, status_subject from subjects a inner join students_subjects b on a.id = b.subject_id where a.sub_level = ${+data.levelId}`).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
        
    })
}


exports.deleteStudentBySsn = (data) => {
    return new Promise((resolve, reject) => {
        db(`delete from students_subjects where student_id=${data}`).then(() => {
            resolve('good')
        }).catch(err => {
            reject(err)
        })
    })
}

