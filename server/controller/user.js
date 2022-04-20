//Create user
const User = require('../models/user').User;
const client = require('./../../utils/db');


async function _get_user_collection (){
  let db = await client.getDb();
  return await db.collection('users');
};

async function _get_loggedUser_collection (){
  let db = await client.getDb();
  return await db.collection('loggedUser');
};

//Register user to DB 
module.exports.registerUser = async (req, res) => {
    //console.log(req.body);
      let email = req.body.email;
      let password = req.body.password;
      let collection = await _get_user_collection();
      let newUser = new User(email, password);
      var valid = await newUser.isValid()
      await collection.find({"email":email}).toArray((err, items)=>{
        if (err) throw err;
        if(items.length==0){    
          if(valid){
            collection.insertOne(newUser, (err, obj) => {
              if(err) throw err;
              console.log('User successfully registered.')
              res.send('User was succesfully registered.')
            })
          } else {
            console.log('User was not registered.');
            res.send('User was not registered.')
          }
        }else{
          console.log('User was not registered.');
          res.send('User was not registered.')
        }
      })
  };


//Read user
module.exports.loginUser = async (req, res) => {
    let collection = await _get_user_collection();
    let collection2 = await _get_loggedUser_collection();
    let emailToMatch = req.body.email
    //Check if entered email exists within the database
    collection.findOne({"email": emailToMatch}, (err, obj)=>{
        if (err) throw err;
        //If email exists
        if (obj){
          //compare client password with db password
          if (req.body.password === obj.password){
            let data = {
              "id":1,
              "email": emailToMatch
            }
            collection2.insertOne(data, (err, obj) => {
              if(err) throw err;
            })
            //res.send("Logged in successfully");
            console.log('Logged in successfully!')
            //res.send('Logged in successfully')
            return res.redirect('/user.html')
          } else {
            res.send('Wrong password')
          }
          //res.send({msg: "User successfully retrieved", data: obj});
        }else{
            res.send("Please enter a valid email address");
        }
    });
  };

/**
 * A function to drop the logged in user
 * @param {*} req  
 * @param {*} res 
 */ 
 module.exports.logOut = async (req, res) => {
  let collection2 = await _get_loggedUser_collection ();
  collection2.deleteMany({})
  res.send("Logged out successfully")

}
