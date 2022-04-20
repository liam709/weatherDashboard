var express = require('express');
const bodyParser = require('body-parser');
var app = express();
const port = 3000
const mongo = require('../utils/db');
const weather = require('./controller/trueWeather'); //import weather operations
const userController = require('./controller/user') // import user controller
app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
    
async function loadDBClient() {       
    await mongo.connectToDB();       
  };       
  loadDBClient();   
     
//trueWeather resource paths   
// app.get('/', weather.guest)
app.get('/user', weather.user)    
app.post('/search', weather.search) 
app.post('/bookmark', weather.bookmark)  
app.delete('/delete', weather.deleteBookmark)
app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);   
app.post('/logout', userController.logOut);        
         
    
 
//create server
server = app.listen(port, () => { 
    console.log('Example app listening at http://localhost:%d', port);
  });  
 
process.on('SIGINT', () => { 
    console.info('SIGINT signal received.');      
    console.log('Closing Mongo Client.');    
    mongo.closeDBConnection();     
    server.close(() => {
    console.log('Http server closed.');
    });
});   
 