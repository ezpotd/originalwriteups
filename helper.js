function vconvert(year, contest, problem, subject){
  var x = [];
  if(year != ""){
    year = parseInt(year);
    if(-1 < year && year < 50){
      year += 2000;
    }
    else if(year < 100){
        year += 1900;
    }
  }
  else{
    year = "XXXX"
  }
  contest = contest.toUpperCase();
  if(contest == "USAMO"){
    contest = "AMO";
  }
  else if(contest == "USAJMO"){
    contest = "JMO";
  }
  else if(contest == "ELMO"){
    contest = "ELM";
  }
  if(contest == ""){
    contest = "XXX"
  }
  if(contest != "ISL" && problem.length == 1){
    problem = "P" + problem;
  }
  problem = problem.toUpperCase();
  if(problem == ""){
    problem = "XX";
  }
  if(subject == ""){
    subject = "X";
  }
  else{
    subject = subject.toUpperCase();
    var sample = subject.slice(0,3);
    if(sample == "COM"){
      subject = "C";
    }
    if(sample == "GEO"){
      subject = "G";
    }
    if(sample == "ALG"){
      subject = "A";
    }
    if(sample == "NUM"){
      subject = "N";
    }
    if(subject.toUpperCase() == "NT"){
      subject = "N";
    }
  }
  x.push(year);
  x.push(contest);
  x.push(problem);
  x.push(subject);
  return x;
}
function parse(prob){
  var year = prob.slice(0,4);
  var contest = prob.slice(4,7);
  var problem = prob.slice(7,9);
  if(contest == "AMO"){
    contest = "USAMO";
  }
  else if(contest == "JMO"){
    contest = "USAJMO";
  }
  else if(contest == "ELM"){
    contest = "ELMO";
  }
  return year + " " + contest + " " + problem;
}
module.exports = {vconvert, parse};