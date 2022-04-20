const res = require('express/lib/response');
var request = require('request-promise');
 
/** 
 * 
 * A function that gets forecasted weather data for a city
@param {Array} cities
*/

module.exports.getWeatherForecast = async (cities) => {
    var weather_data = []
    let apiKey = "dcaccc1d2127d31d43ab42106e163cb5" 
    try{
        for (var city_obj of cities) {
            //console.log(cities)
            var city = city_obj;
            var url = 'http://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=imperial&appid='+apiKey;
            var response_body = await request(url);
            var weather_json = JSON.parse(response_body);
            for(var i =0; i<(5);i++){
                var weather = {
                    name : city,
                    date : weather_json.list[i].dt_txt,
                    temperature : Math.round(weather_json.list[i].main.temp),
                };
                weather_data.push(weather); //array that contains the weather information
            }
        }
        return weather_data;
    }catch(err){
        weather_data = null
        return weather_data               //return null if there's an error
    }
}
