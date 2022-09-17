const mySecret = process.env['pass'];
const express = require("express");
const { check, validationResult } = require('express-validator');
const ezpotd = require("ezpotd");
const path = require("path");
const helper = require("./helper.js");
const app = express();
const port = process.env.PORT || "8000";
app.use('/static', express.static('static'));
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
var db = new ezpotd(["year", "contest", "problem", "subject", "solution"], "db");
db.boot();

app.get("/", (req, res) => {
  var results = db.last(7);
  var links = [];
  for(var i = 0; i < Math.min(7, results.length); i++){
    var result = results[i];
    var x = db.retrieve("year", result) + db.retrieve("contest", result) + db.retrieve("problem", result);
    var y = helper.parse(db.retrieve("year", result) + db.retrieve("contest", result) + db.retrieve("problem", result));
    links.push({"link": x, "title": y});
  }
  res.render("index", {links: links});
});

app.get("/invalid", (req, res) => {
  res.render("invalid");
});

app.post("/edit", check('year').isLength(4), check('contest').isLength(3), check('problem').isLength(2),check('subject').isLength(1), (req, res) => {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();
  if(hasErrors || req.body.password != mySecret){
    res.redirect("/invalid");
  }
  else{
    var x = db.query([req.body.year, req.body.contest, req.body.problem, req.body.subject], ["year", "contest", "problem", "subject"])
    if(x.length == 0){
      db.add([req.body.year, req.body.contest, req.body.problem, req.body.subject, req.body.solution]);
    }
    else{
      console.log(x);
      db.edit("solution", x[0], req.body.solution);
    }
    res.redirect("/sol/" + req.body.year + req.body.contest + req.body.problem);
  }
});

app.get("/sol/:prob", (req, res) => {
  var prob = req.params.prob;
  var year = prob.slice(0,4);
  var contest = prob.slice(4,7);
  var problem = prob.slice(7,9);
  var a = db.query([year, contest, problem], ["year", "contest", "problem"])[0];
  if(a > -1){
    var sol = db.retrieve("solution", a);
    var title = helper.parse(prob);
    res.render("sols", {title: title, sol: sol})
  }
  else{
    res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }
})
app.post("/search", (req, res) => {
  var x = helper.vconvert(req.body.year, req.body.contest, req.body.problem, req.body.subject);
  res.redirect("/query/" + x[0] + x[1] + x[2] + x[3]);
})

app.get("/query/:query", (req, res) => {
  var prob = req.params.query;
  var year = prob.slice(0,4);
  var contest = prob.slice(4,7);
  var problem = prob.slice(7,9);
  var subject = prob.slice(9,10);
  var vals = [];
  var fields = [];
  if(year != "XXXX"){
    vals.push(year);
    fields.push("year");
  }
  if(contest != "XXX"){
    vals.push(contest);
    fields.push("contest");
  }
  if(problem != "XX"){
    vals.push(problem);
    fields.push("problem");
  }
  if(subject != "X"){
    vals.push(subject);
    fields.push("subject");
  }
  var results = db.query(vals, fields);
  var links = [];
  for(var i = 0; i < results.length; i++){
    result = results[i];
    var x = db.retrieve("year", result) + db.retrieve("contest", result) + db.retrieve("problem", result)
    var y = helper.parse(db.retrieve("year", result) + db.retrieve("contest", result) + db.retrieve("problem", result));
    links.push({"link":x, "title":y});
  }
  
  res.render("results", {links: links});
})

app.get("/recents", (req,res) => {
  var results = db.last(40);
  var links = [];
  for(var i = 0; i < Math.min(40, results.length); i++){
    var result = results[i];
    var x = db.retrieve("year", result) + db.retrieve("contest", result) +   db.retrieve("problem", result);
    var y = helper.parse(db.retrieve("year", result) + db.retrieve("contest", result) + db.retrieve("problem", result));
    links.push({"link": x, "title": y});
  }
  res.render("recents", {links: links})
})
app.get('*', function(req, res){
  res.redirect("/");
});
app.listen(port, () => {});
