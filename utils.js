module.exports = {
  age: function (timestamp) {

    const today = new Date();
    const birthDate = new Date(timestamp);
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
  
    if(month < 0 || month == 0 && today.getDate() < birthDate.getDate()){
      age = age -1
    }
  
    return age
  },
  graduation: function(degree){

    const resumeGraduation = degree.split(" ");

    if(resumeGraduation.length > 1) {
      return resumeGraduation[1]
    }

    return degree
    
  },
  date: function(timestamp){

    const birthDay = new Date(timestamp);

    const day = `0${birthDay.getUTCDate()}`.slice(-2);
    const month = `0${birthDay.getUTCMonth() + 1}`.slice(-2);
    const year = birthDay.getUTCFullYear();

    return `${year}-${month}-${day}`;
    
  }
}