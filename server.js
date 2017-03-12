var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var Pool = require('pg').Pool;
//var http = require('http');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
  //host: 'localhost',
  user: 'bala-arunachalam',
  database: 'bala-arunachalam',
  host: 'db.imad.hasura-app.io',
  //path: '/database.php?pgsql=localhost%3A5432',
  port: '5432',
  password: 'db-bala-arunachalam-70572' //process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
//JSON content goes into req.body using bodyParser in express framework
app.use(bodyParser.json());
app.use(session({
    secret :'someRandomSecretValue',
    cookie :{maxAge :1000 * 60 * 60 * 24 * 30},
    resave: true,
    saveUninitialized: true
}));

function createTemplate (data) {
var title=data.title;
var date=data.date;
var heading=data.heading;
var content=data.content;

var htmlTemplate = `
<html>
    <head>
        <title>${title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
    </head>
<body>

    <div class="container">
        <div>
        <a href="/">Home</a>
        </div>
    <hr/>
        <h3>
         ${heading}
         </h3>
         <div>
          ${date.toDateString()}
         </div>
         <div>
          ${content}
         </div>
                      <hr/>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
          </div>
//          <script type="text/javascript" src="/ui/article.js"></script>
</body>
</html>
`;
return htmlTemplate;
}

var pool = new Pool(config);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
    
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
   return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res){
   //How do we create a hashtag
   var hashedString = hash(req.params.input,'this-is-a random-data');
   res.send(hashedString);
   
});

app.post('/create-user',function(req,res){
    //username and password
    //JSON content gives username and password
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt); 
   pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
      
      if (err){
           res.status(500).send(err.toString());
       } else{
           res.send('User Successfully Created');
             }  
   });
});

app.post('/login',function(req,res){
   
    var username = req.body.username;
    var password = req.body.password;
    
    //var dbString = hash(password,salt); 
    pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){
      
      if (err){
           res.status(500).send(err.toString());
       } else{
           if (result.rows.length === 0){
               res.status(403).send('Invalid Username/Password ');
           }
           else{
            //Match the password
            var dbString = result.rows[0].password;
            var salt = dbString.split('$')[2];
            var hashedPassword = hash(password,salt); //creating hashedPassword based on the password submitted and original salt value;
            if(hashedPassword === dbString)
            {
        //Set Seession
            req.session.auth = {userid :result.rows[0].id};
            //Set cookie with session id
            //internally on the server side it maps the session id to an object
            //{auth :{userid}}
            //
            res.send('Credentials are Correct');
            }
            else{
                res.status(403).send('Invalid Username/Password ');
            }
           }
       }  
       
   }); 
});
app.get('/check-login',function(req,res){
   if (req.session && req.session.auth && req.session.auth.userId){
       res.send('You are logged in as ' + req.session.auth.userId.toString());
   } else {
       res.send('You are not lgged in');
   }
});

app.get('/logout',function(req,res){
   delete req.session.auth;
   res.send('Logged Out');
});

app.get('/test-db', function(req,res) {
  //make a select request
    pool.query('SELECT * FROM test',function(err,result){
       if (err){
           res.status(500).send(err.toString());
       } else{
           res.send(JSON.stringify(result.rows));
    }
    });
  //return a response
});

var counter = 0;
app.get('/counter', function(req,res) {
    counter = counter +1;
    res.send(counter.toString());
});


var names = [];
app.get('/submit-name', function(req, res) { //URL: /submit-name?name-xxxxx
    //Get the name from the request
    var name = req.query.name;
        names.push(name);
    //JSON JS Obj Notation
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req, res) {
    //articleName == article-one
    //articles[articleName] == {} content object for article one
//    pool.query("SELECT * from article where title = '"+ ';DELETE from article where 'a'='a +"'", function(err, result) {   
    pool.query("SELECT * from article where title = $1", [req.params.articleName] , function(err, result) {
//    pool.query("SELECT * from article where title = 'article-one'", function(err, result) {
        if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
          res.status(404).send('Article not found');
      } else {
          var articleData = result.rows[0];
            res.send(createTemplate(articleData));
      }
      }
    });
  });


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
