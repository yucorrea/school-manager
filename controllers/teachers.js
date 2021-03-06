const fs = require("fs");
const data = require("../data.json");
const { graduation, date } = require("../utils");

//index

exports.index = (req,res) => {

  const teacher = data.teachers; 

  return res.render("teachers/index", {teachers: teacher});
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
  req.body.created_at = Date.now();
  req.body.id = data.teachers.length + 1;

  data.teachers.push(req.body);

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {

    if(err) return res.send("Write file error")

    return res.redirect("/teachers");
  })

}

//create
exports.create = (req,res) => {
  return res.render("teachers/create");
}
// show 
exports.show = (req, res) => {

  const { id } = req.params;

  const findTeacher = data.teachers.find(teacher => teacher.id == id);

  if(!findTeacher){
    return res.send("Teacher not found")
  }
  
  const teacher = {
    ...findTeacher,
    age: date(findTeacher.birth).birthDay,
    services: findTeacher.services.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(findTeacher.created_at)
  }
  return res.render("teachers/show", { teacher });
}

// edit 
exports.edit = (req, res) => {

  const { id } = req.params;

  const findTeacher = data.teachers.find(teacher => teacher.id == id);

  if(!findTeacher){
    return res.send("Teacher not found")
  }

  const teacher = {
    ...findTeacher,
    degree: graduation(findTeacher.degree),
    birth: date(findTeacher.birth).iso
  }

  return res.render("teachers/edit", { teacher });
}

// update
exports.put =  (req, res) => {
  const { id } = req.body;
  let index = 0

  const findTeacher = data.teachers.find((teacher, foundIndex) => {
    if(teacher.id == id){
      index = foundIndex;
      return true
    }
  });

  if(!findTeacher){
    return res.send("Teacher not found")
  }

  const teacher = {
    ...findTeacher,
    ...req.body,
    id: Number(req.body.id),
    birth: Date.parse(req.body.birth)
  }

  data.teachers[index] = teacher

  fs.writeFile("data.json", JSON.stringify(data, null,2),(err) => {
    if(err) return res.send("Write file error!");

    return res.redirect(`/teachers/${id}`)
  })


}

// delete

exports.delete =  (req, res) => {

  const { id } = req.body;

  const filterTeachers = data.teachers.filter(teacher => teacher.id != id);

  data.teachers = filterTeachers;

  fs.writeFile("data.json", JSON.stringify(data, null,2),(err) => {
    if(err) return res.send("Write file error!");

    return res.redirect(`/teachers`)
  })

}