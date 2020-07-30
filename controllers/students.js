const fs = require("fs");
const data = require("../data.json");
const { age,  date } = require("../utils");

//index
exports.index = (req,res) => {
  const students = data.students
  return res.render("students/index", { students });
}

//post
exports.post = (req,res) => {

  const keys = Object.keys(req.body);

  keys.forEach(key =>  {
    if(req.body[key] == "") {
      return res.send("Please, fill all fields");
    }
  });

  req.body.birth = Date.parse(req.body.birth);
  req.body.id = data.students.length + 1;

  data.students.push(req.body);

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {

    if(err) return res.send("Write file error")

    return res.redirect("/students");
  })

}

//create
exports.create = (req,res) => {
  return res.render("students/create");
}
// show 
exports.show = (req, res) => {

  const { id } = req.params;

  const findStudent = data.students.find(student => student.id == id);

  if(!findStudent){
    return res.send("Student not found")
  }
  
  const student = {
    ...findStudent,
    birth: date(findStudent.birth).birthDay,
    created_at: new Intl.DateTimeFormat("pt-BR").format(findStudent.created_at)
  }
  return res.render("students/show", { student });
}

// edit 
exports.edit = (req, res) => {

  const { id } = req.params;

  const findStudent = data.students.find(student => student.id == id);

  if(!findStudent){
    return res.send("Student not found")
  }

  const student = {
    ...findStudent,
    birth: date(findStudent.birth).iso
  }

  return res.render("students/edit", { student });
}

// update
exports.put =  (req, res) => {
  const { id } = req.body;
  let index = 0

  const findStudent = data.students.find((student, foundIndex) => {
    if(student.id == id){
      index = foundIndex;
      return true
    }
  });

  if(!findStudent){
    return res.send("Student not found")
  }

  const student = {
    ...findStudent,
    ...req.body,
    id: Number(findStudent.id),
    birth: Date.parse(req.body.birth)
  }

  data.students[index] = student

  fs.writeFile("data.json", JSON.stringify(data, null,2),(err) => {
    if(err) return res.send("Write file error!");

    return res.redirect(`/students/${id}`)
  })


}

// delete

exports.delete =  (req, res) => {

  const { id } = req.body;

  const filterStudents = data.students.filter(student => student.id != id);

  data.students = filterStudents;

  fs.writeFile("data.json", JSON.stringify(data, null,2),(err) => {
    if(err) return res.send("Write file error!");

    return res.redirect(`/students`)
  })

}