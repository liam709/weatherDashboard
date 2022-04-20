const getWeather = require('./../../utils/getWeather');
const client = require('./../../utils/db');
const getWeatherForecast = require('./../../utils/getWeatherForecast')


async function _get_weather_collection (){
    let db = await client.getDb();
    return await db.collection('trueWeather');
};

async function _get_loggedUser_collection (){
let db = await client.getDb();
return await db.collection('loggedUser');
};
  
async function _get_user_collection (){
let db = await client.getDb();
return await db.collection('users');
};
/**
 * A function to display the home page and weather bookmarks if available
 * @param {*} req 
 * @param {*} res 
 */

module.exports.user = async (req,res) => {
    let weatherCollection = await _get_weather_collection();
    let loggedUserCollection = await _get_loggedUser_collection();
    let usersCollection = await _get_user_collection();

    await loggedUserCollection.find({}).toArray((err, items)=>{
        if (err) throw err;   
        var user = items[0].email
 
    usersCollection.find({"email":user}).toArray((err, items)=>{
        if (err) throw err;
        console.log(items) 
        var cities = items[0].cities
        console.log(cities)
        if(cities.length == 0){                                                     //if the database is empty, just render the home page without bookmarked cities
            console.log('Database is empty');
        }else{
            getWeatherForecast.getWeatherForecast(cities).then(function(results){  //get weather forecast of bookmarked cities and update the current one in the database 
                weatherCollection.deleteMany({})
                weatherCollection.insertMany(results, (err, obj) => {
                    if (err) throw err;
                    console.log((cities.length) + ' City(ies) updated in the database');
                });
            }) 
            getWeather.getWeather(cities).then(function(results) {
                console.log("Home page retrieved with bookmarks")
                res.send(results)
            });
        }
    });
});
}


/**
 * A function to save the user's bookmarked cities in the database
 * @param {*} req 
 * @param {*} res 
 */

module.exports.bookmark = async (req,res) => { 
    let weatherCollection = await _get_weather_collection();
    let loggedUserCollection = await _get_loggedUser_collection();
    let usersCollection = await _get_user_collection();
    var new_city = req.body.city_name
    var  city = []
    city.push(new_city)
    getWeatherForecast.getWeatherForecast(city).then(function(results){
    if(results!=null){
        loggedUserCollection.find({}).toArray((err, items)=>{
            if (err) throw err;   
            var user = items[0].email

            usersCollection.find({"email":user}).toArray((err, items)=>{
                if (err) throw err;
                var city1 = items[0].cities
                if(!(city1.includes(new_city))){
                    city1.push(new_city)
                }
                usersCollection.updateOne({"email":user},{$set:{"cities":city1}})
            })
        });  
        getWeatherForecast.getWeatherForecast(city).then(function(results){
            weatherCollection.insertMany(results, (err, obj) => {
                if (err) throw err;
                console.log('1 City was inserted in the database');
                res.send("City bookmarked")
            });
        })
    }else{
        res.send("Not a valid city to bookmark")
    }
    })
}

/**
 * A function to display weather information of a searched city
 * @param {*} req 
 * @param {*} res 
 */

module.exports.search = async (req,res) =>{
    // if(req.body.city_name != null){
        var city = []
        city.push(req.body.city_name)
        getWeather.getWeather(city).then(function(results) { 
            if(results!=null){
                console.log(results)
                console.log("City weather information retrieved")
                res.send(results) 
            }else{
                console.log("Not a valid city to search")
                res.send("Not a valid city to search")
            }
        });
}

/**
 * A function to delete a bookmarked city
 * @param {*} req  
 * @param {*} res 
 */ 
 module.exports.deleteBookmark = async (req, res) => {
    let weatherCollection = await _get_weather_collection();
    let loggedUserCollection = await _get_loggedUser_collection();
    let usersCollection = await _get_user_collection();
    let city_to_delete = req.body.city_name;
    await loggedUserCollection.find({}).toArray((err, items)=>{
        if (err) throw err;   
        user = items[0].email

    usersCollection.find({"email":user}).toArray((err, items)=>{
        if (err) throw err;
        var city = items[0].cities
        var index = city.indexOf(city_to_delete)
        if (index > -1) {
            city.splice(index, 1);
            usersCollection.updateOne({"email":user},{$set:{"cities":city}})
        }
    })
});  
    weatherCollection.deleteMany({'name': city_to_delete}, (err, obj) => {
        if (err) throw err;
        if (obj.deletedCount > 0){
            console.log("1 city deleted");
            res.send("City deleted")
        } else { 
            console.log("City not found")
            res.send("City not found")
        } 
    });
}; 
  