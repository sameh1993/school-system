const db = require("../model/db").db;
const teacherModel = require("../model/teacher.model");
const classSchedule = require("../model/classSchedule.model");

exports.displayTeacherData = (req, res, next) => {
  db("select * from configeration").then((config) => {
    teacherModel.getTeacherById(+req.params.id).then((resault) => {
      // return console.log(resault)
      res.render("teacher-modules/data-teacher", {
        // configeration page
        title: "Search Page",
        activeTab: "teacher",
        SchoolName: config.recordset[0].school_name,
        currentUser: req.session.currentUser,
        controlLevel: req.session.controlLevel,
        // body page
        student: resault.recordset[0],
      });
    });
  });
};

exports.getTeacherHome = (req, res, next) => {
  db("select * from configeration").then((result) => {
    // return console.log(classes)
    res.render("teacher", {
      SchoolName: result.recordset[0].school_name,
      currentUser: req.session.currentUser,
      controlLevel: req.session.controlLevel,
      title: "معلم",
      activeTab: "teacher",
    });
  });
};

exports.postNewTeacher = (req, res, next) => {
  const image = req.file ? req.file.filename : "";
  teacherModel
    .addNewTeacher(req.body, image)
    .then((result) => {
      res.redirect("/teacher/" + req.body.teach_id);
    })
    .catch((err) => {
      res.redirect("/teacher/add");
      console.log(err);
    });
};

exports.getAddTeacherPage = (req, res, next) => {
  db("select * from configeration").then((result) => {
    res.render("teacher-modules/add-teacher", {
      // configeration page
      title: "Teacher Page",
      activeTab: "teacher",
      schoolName: result.recordset[0].school_name,
      currentUser: req.session.currentUser,
      controlLevel: req.session.controlLevel,
    });
  });
};

exports.postSearchTeacher = (req, res, next) => {
  db("select * from configeration").then((config) => {
    if (req.body.search == "ssn") {
      // return console.log('ssn')
      teacherModel
        .getTeacherById(+req.body.searchValue)
        .then((resault) => {
          console.log(resault.recordset[0]);
          res.redirect("/teacher/" + +req.body.searchValue);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      teacherModel
        .getTeacherByName(req.body.searchValue)
        .then((resault) => {
          res.render("teacher-modules/search-teacher", {
            // configeration page
            title: "Search Page",
            activeTab: "teacher",
            SchoolName: config.recordset[0].school_name,
            currentUser: req.session.currentUser,
            controlLevel: req.session.controlLevel,
            // body page
            students: resault.recordset,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

exports.getDeleteTeacher = (req, res, next) => {
  //  console.log(req.params.id)
  //  return console.log(req.body)
  teacherModel
    .deleteTeacherById(+req.params.id)
    .then(() => {
      fs.unlink(`../assets/image/teachers/${req.body.image}`, (err) => {
        if (!err) {
          res.redirect("/teacher");
        }
      });
    })
    .catch((err) => {
      res.redirect("/teacher/" + req.params.id);
    });
};

exports.getTeeacherSchedulePage = (req, res) => {
  const userid = req.params.userid || req.session.userid;
  classSchedule.getClassScheduleByTeacherId(userid).then((result) => {
    db("select * from configeration").then((config) => {
      db(`select teach_name from teachers where teach_id = ${userid}`).then(teach_name => {
        res.render("teacher-modules/teacher-schedule", {
          // configeration page
          title: "Search Page",
          activeTab: 'teacher',
          SchoolName: config.recordset[0].school_name,
          currentUser: req.session.currentUser,
          controlLevel: req.session.controlLevel,
          // body page
          dataSchedule: result.recordset,
          teachName : teach_name.recordset[0].teach_name
      })
      })
      
      
    });
  });
};
