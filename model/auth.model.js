
// const db = require("../model/db").db
const bycrpt = require("bcrypt")
const mssql = require("mssql")
const db = require("./db").db


exports.RegisterNewUSer = (data) => {
    return new Promise((Resolve, reject) => {
        const request = new mssql.Request()
        request.input('teachId', mssql.Int(), data.teachId)
        request.input('control', mssql.NVarChar(50), data.control)
        request.query(`select * from teachers where teach_id = @teachId`).then(result => {
            if(result.rowsAffected[0] == 1) {
                return bycrpt.hash(data.password, 10, function(err, hash) {
                    db(`update teachers set password = N'${hash}', control_level=N'${data.control}' where teach_id = ${data.teach_id}`).then(info => {
                        Resolve('the User is registered')
                    }).catch(error => {
                        reject(error)
                    })
                });
                
            } else {
                reject("this teacher id is not found")
            }
        }).catch(err => {
            reject(err)
        })
    })
}




exports.loginUser = (data) => {
    return new Promise((resolve, reject) => {
        const request = new mssql.Request()
        request.input("teachID", mssql.Int(), data.teachId)
        request.input("control", mssql.NVarChar, data.control)
        request.query('select * from teachers where teach_id=@teachID').then((resault) => {
            if(resault.recordset.length > 0) {
                bycrpt.compare(data.password, resault.recordset[0].password).then(same => {
                    if(same) {
                        resolve({
                            id: resault.recordset[0].teach_id,
                            name :resault.recordset[0].teach_name,
                            isAdmin: resault.recordset[0].control_level,
                            image: resault.recordset[0].image
                        })
                    } else {
                        reject("incorrect password")
                    }
                })
            } else {
               reject('this account not found')
            }
        })
    })
}