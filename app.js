var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');

app.set('view engine', 'ejs');
var fileName = 'data/jsonarrusers.json';

if (!fs.existsSync("./data")) { // Can't write if(!fs.exists("./files")) because will return true all the time because it is async and thus won't wait till the check complete and will alwasy enter the if.
	fs.mkdirSync("./data"); // Can write fs.mkdir("./files"); but won't be good because it is async, so if file will be written before directory is created - it will crash.
}

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/list_user', function(req, res) {
  if(req.body.age=="" || req.body.name==""){
    var reply ='<h1 align ="center"><strong>Name or age is emty. Please enter all data.<strong></h1>';
     res.send(reply); 
     return 0;
  }

  var tmp = false;
  if(req.body.gridRadiosGender === "male")  tmp = true;

  var person = {
    name: req.body.name.trim().toString(),
    age:req.body.age.trim(),
    isMale:tmp,
    country:req.body.country
  };

  var arreyUsers = [];
  fs.readFile('data/jsonarrusers.json', 'utf8', function (err, data) {
    if (err) throw err;
    arreyUsers = JSON.parse(data);

     if(testName( req.body.name, arreyUsers) != 1){
      console.log("Err 1 if");
      var reply ='<h1 align ="center"><strong>Name already exist. Please try another name.<strong></h1>';
         res.send(reply); 
        return 0;
     }  
     if(testLenght( req.body.name) != 1){
      console.log("Err 2 if");
      var reply ='<h1 align ="center"><strong>Name must be 3-15 characters long<strong></h1>';
         res.send(reply); 
        return 0;
     }
     if(testAge( req.body.age) != 1){
      console.log("Err 3 if");
      var reply ='<h1 align ="center"><strong>Age must be 1-120 <strong></h1>';
       res.send(reply); 
      return 0;
 }
    arreyUsers.push(person);
    fs.writeFile(fileName, '', function(){console.log('done')});
    fs.appendFileSync(fileName, JSON.stringify(arreyUsers));
    res.sendFile(__dirname + '/list_user.html');
  });

});

app.get('/list_user', function(req, res, next){
  var arreyUsers = [];
  var answer="";
  fs.readFile('data/jsonarrusers.json', 'utf8', function (err, data) {
    if (err) throw err;
    arreyUsers = JSON.parse(data);
       answer='<ul class="list-group list-group-flush"> <strong>';
       arreyUsers.forEach( function(user) {
          console.log("*** ");
          answer += "<li class='list-group-item'> Name: " + user.name+"</p> ";
          answer += "Age: " + user.age+", ";
          answer += "Gender: " + user.isMale+", "; 
          answer += "Country: " + user.country;
          answer += '</li> <hr class="my-6">';
         }); 
         answer +="</strong></ul>";
         res.send(""+answer);
  });

});

//start page
app.get('/', function(req, res, next){
  res.sendFile(__dirname+'/index.html');
});

function testLenght(newUserName){
  var userName = newUserName;
  var flag = 1;
   if(newUserName.length==0){  flag = 4; } 
   if(newUserName.length<=2 || newUserName.length>=16){  flag = 3; } 
    return flag;
};

function testAge(newUserAge){
  if(newUserAge.length==0)  return 1;  
  if(newUserAge>0 && newUserAge<=120) return 1;
  return 0;
};

function testName(newUserName, arreyUsers){ 
  var userName = newUserName;
  var flag = 1;
  var newname = newUserName.trim().toString();
   if(arreyUsers!=null){
       arreyUsers.forEach( function(user) {
        console.log("userName "+userName);
        console.log("user.name "+user.name);
        var name = ""+user.name;
        if(newname.toLowerCase() === name.toLowerCase()){
          console.log("Equals");
          flag = 0;
          }
    });
   }  
    return flag;
};
// Run server: 
app.listen(process.env.PORT || 4578);
console.log("YA RABOTAU");