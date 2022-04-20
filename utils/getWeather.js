var request = require('request-promise');
 
/** 
 * 
 * A function to retrieve the weather information of cities passed through an array
@param {Array} cities
*/

module.exports.getWeather = async (cities) => {
    var weather_data = []
    let apiKey = "dcaccc1d2127d31d43ab42106e163cb5" 
    try{
        for (var city_obj of cities) {
            var city = city_obj;
            var url = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=imperial&appid='+apiKey;
            var response_body = await request(url);
            var weather_json = JSON.parse(response_body);
            var weather = {
                city : city,
                temperature : Math.round(weather_json.main.temp),
                description : weather_json.weather[0].description,
                icon : weather_json.weather[0].icon
            };
             /**since we save forecasted weather information for bookmarked cities,                                                                //
              *weather_data would contain duplicate city weather info, so we 
              *remove those duplicates here with the if statement below and push just one to the array to be sent 
              */
            var i = weather_data.findIndex(e => e.city === weather.city)                                                                 //
            if(weather_data[i]){                                         
                weather_data[i] = weather                               
            }else{                                                      
                weather_data.push(weather);
            }
        }
        return weather_data;
    }catch(err){
        weather_data = null //nullify the array if there is any error
        return weather_data
    }
}
