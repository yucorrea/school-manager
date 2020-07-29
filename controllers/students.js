const fs = require("fs");
const data = require("../data.json");
const { age, graduation, date } = require("../utils");

//create
exports.post = (req,res) => {

  const keys = Object.keys(req.body);

  keys.forEach(key =>  {
    if(req.body[key] == "") {
      return res.send("Please, fill all fields");
    }
  });

  req.body.birth = Date.parse(req.body.birth);
  req.body.created_at = Date.now();
  req.body.id = data.students.length + 1;

  data.students.push(req.body);

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {

    if(err) return res.send("Write file error")

    return res.redirect("/students");
  })

}

// show 
exports.show = (req, res) => {

  const { id } = req.params;

  const findTeacher = data.students.find(student => student.id == id);

  if(!findTeacher){
    return res.send("Teacher not found")
  }
  
  const student = {
    ...findTeacher,
    age: age(findTeacher.birth),
    services: findTeacher.services.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(findTeacher.created_at)
  }
  return res.render("students/show", { student });
}

// edit 
exports.edit = (req, res) => {

  const { id } = req.params;

  const findTeacher = data.students.find(student => student.id == id);

  if(!findTeacher){
    return res.send("Teacher not found")
  }

  const student = {
    ...findTeacher,
    degree: graduation(findTeacher.degree),
    birth: date(findTeacher.birth)
  }

  return res.render("students/edit", { student });
}

// update
exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0

  const findTeacher = data.students.find((student, foundIndex) => {
    if(student.id == id){
      index = foundIndex;
      return true
    }
  });

  if(!findTeacher){
    return res.send("Teacher not found")
  }

  const student = {
    ...findTeacher,
    ...req.body,
    birth: Date.parse(req.body.birth)
  }

  data.students[index] = student

  fs.writeFile("data.json", JSON.stringify(data, null,2),(err) => {
    if(err) return res.send("Write file error!");

    return res.redirect(`/students/${id}`)
  })


}

// delete

exports.delete = function (req, res) {

  const { id } = req.body;

  const filterTeachers = data.students.filter(student => student.id != id);

  data.students = filterTeachers;

  fs.writeFile("data.json", JSON.stringify(data, null,2),(err) => {
    if(err) return res.send("Write file error!");

    return res.redirect(`/students`)
  })

}