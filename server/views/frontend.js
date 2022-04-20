$(document).ready(function () {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var unit = ''
    var symbol = ''
    var temp = localStorage.getItem('inlineRadioOptions');                   //to retrieve selected option when page refreshes

    if(temp == 'option1'){                                                   //store temperature preference
        unit = 'metric'
        symbol = 'C'
    }else{
        unit = 'imperial'
        symbol = 'F'
    }

    if((location.href.split("/").slice(-1) == 'user.html')||(location.href.split("/").slice(-1) == 'guest.html')){
        const timeEl = document.getElementById('time');
        const dateEl = document.getElementById('date');
        const timezone = document.getElementById('time-zone');
        const countryEl = document.getElementById('country');

        //for the time and date of the user/guest page
        setInterval(() => {
            const time = new Date();
            const month = time.getMonth();
            const date = time.getDate();
            const day = time.getDay();
            const hour = time.getHours();
            const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
            const minutes = time.getMinutes();
            const ampm = hour >=12 ? 'PM' : 'AM'

            timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

            dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

        }, 1000);


        //get users current position
        navigator.geolocation.getCurrentPosition(success, error);

        function success(position) {
            console.log(position.coords.latitude)
            console.log(position.coords.longitude)
            countryEl.innerHTML =  'Latitude: '+ position.coords.latitude + ', Longitude: ' + position.coords.longitude

            var url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unit}&appid=dcaccc1d2127d31d43ab42106e163cb5`
            $.getJSON(url).done(async function(w) {
        
                var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&key=AIzaSyCre3IgfruKPdJyWxTsd8sUkeCZreZxvvY';
            
                $.getJSON(GEOCODING).done(function(location) {
                    console.log(location)
                    timezone.innerHTML =location.results[0].address_components[3].long_name + ' : '+ Math.round(w.main.temp) +'&#176;'+symbol
                    
                })
                
            })

        }

        function error(err) {
            console.log(err)
        }
    }

    //get bookmarks, if there are, when a logged in user loads the homepage
    if(location.href.split("/").slice(-1) == 'user.html'){
        $.ajax({
            url: '/user',
            type: 'GET',
            contentType: 'application/json',                      
            success: async function(response){
                console.log(response)
                if(response.length!=0){
                    for(var i=0; i < response.length;i++){
                        if(unit=='metric'){
                            var temperature = Math.round((response[i].temperature - 32)*(5/9))
                        } else{
                            var temperature = response[i].temperature
                        }
                            await $("#city").append(
                                `
                                <div id="result">
                                <div class="flex2">
                                    <h2 class="city">Weather in ${response[i].city}</h2>
                                    <button id="delete" type="button" formaction="/delete" value="${response[i].city}" class="btn btn-danger" ><i class="bi bi-trash"></i></button>
                                    </div>
                                    <div class=flex2>
                                    <h1 class="temp">${temperature}&#176;${symbol}</h1>
                                    <button id="forecast-info" type="button" value="${response[i].city}" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#Modal"><i class="bi bi-info"></i></button>
                                    </div>
                                    <div class="flex">
                                        <img src="http://openweathermap.org/img/w/${response[i].icon}.png" alt="" class="icon" />
                                        <div class="description">${response[i].description}</div>
                                    </div>
                                </div>`
                            )
                    }
                }else{
                    return
                }
            },
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }


    //button events
    $("#choice").on('change', function(event){
        window.location.href=window.location.href
    });

    $("#search").on('click', function(event){
        getCity()
    });

    $("#logoutButton").on('click', function(event){
        logOut()
    });

    $(document).on('click','#forecast-info',function(event){
        $(".modal-body").empty()
        getForecast($(this).attr('value'))
    
    });


    $("#bookmark").on('click',function(event){
        bookmark()
    });

    $("#register").on('click',function(event){
        register()
    });

    $(document).on('click','#delete',function(event){
        deleteBookmark($(this).attr('value'))
        window.location.href=window.location.href
       
    });

    //search function
    function getCity(){
        let data= $("#name").val()
        $.ajax({
            url: '/search',
            type: 'POST',
            contentType: 'application/json',      
            data: JSON.stringify({city_name: data}),                   
            success: async function(response){
                console.log(response)
                if(unit=='metric'){
                    var temperature = Math.round((response[0].temperature - 32)*(5/9))
                } else{
                    var temperature = response[0].temperature
                }
                if(response!="Not a valid city to search"){
                    $("#city").children().remove();
                        if(location.href.split("/").slice(-1) == 'user.html'){
                        await $("#city").append(
                            `
                            <div id="result">
                                <div class="flex2">
                                    <h2 class="city">Weather in ${response[0].city}</h2>
                                    <button id="delete" type="button" formaction="/delete" value="${response[0].city}" class="btn btn-danger" ><i class="bi bi-trash"></i></button>
                                    </div>
                                    <div class=flex2>
                                    <h1 class="temp">${temperature}&#176;${symbol}</h1>
                                    <button id="forecast-info" type="button" value="${response[0].city}" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#Modal"><i class="bi bi-info"></i></button>
                                    </div>
                                    <div class="flex">
                                        <img src="http://openweathermap.org/img/w/${response[0].icon}.png" alt="" class="icon" />
                                        <div class="description">${response[0].description}</div>
                                    </div>
                                </div>
                              
                        `
            
                        )
                      
                    }else{
                        await $("#city").append(
                            `
                            <div id="result">
                                <div class="flex2">
                                    <h2 class="city">Weather in ${response[0].city}</h2>
                                    </div>
                                    <div class=flex2>
                                    <h1 class="temp">${temperature}&#176;F</h1>
                                    </div>
                                    <div class="flex">
                                        <img src="http://openweathermap.org/img/w/${response[0].icon}.png" alt="" class="icon" />
                                        <div class="description">${response[0].description}</div>
                                    </div>
                                </div>
                        `
                        )
                    }
                }else if(response == "Not a valid city to search") {
                    alert(response)
                }
            },
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }


    //bookmark function
    function bookmark(){
        let data= $("#name").val()
        $.ajax({
            url: '/bookmark',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({city_name: data}),                         
            success: function(response){
                console.log(response) 
                if(response!="Not a valid city to bookmark"){
                    window.location.href = window.location.href
                }else{
                    alert(response)
                }
            },
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }
    
    //delete bookmark function
    function deleteBookmark(value){
        $.ajax({
            url: '/delete',
            type: 'DELETE',
            contentType: 'application/json', 
            data: JSON.stringify({city_name: value}),                        
            success: function(response){
                console.log(response);
                alert(response)      
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }

    //get weather forecast and display in modal box
    function getForecast(value){
        var urlToGetCityCoordinates = `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=imperial&appid=dcaccc1d2127d31d43ab42106e163cb5`
        $.getJSON(urlToGetCityCoordinates).done(async function(w) {
            var urlToGetCityForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${w.coord.lat}&lon=${w.coord.lon}&exclude=hourly,minutely&units=${unit}&appid=dcaccc1d2127d31d43ab42106e163cb5`
            $.getJSON(urlToGetCityForecast).done(async function(t) {
                if( t.hasOwnProperty('alerts')){
                    $(".modal-body").append(
                    `
                    <div id="result">
                    <div class = "alerts"> Weather Alerts: <b>${t.alerts[0].event}</b></div>
                    <p class= "warning"><b>${t.alerts[0].description}</b></p>
                    </div>
                    `
                    )
                }
                t.daily.forEach((day, idx) => {
                    if(idx!=0){
                        d = new Date(day.dt * 1000);
                        dayName = days[d.getDay()];
                        $(".modal-body").append(
                        `
                        <div id="result">
                        <div class="day">${dayName}</div>
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                        <div class="temp">Night Temperature : ${Math.round(day.temp.night)}&#176;${symbol}</div>
                        <div class="temp">Day Temperature : ${Math.round(day.temp.day)}&#176;${symbol}</div>
                        </div>
                        `
                        )
                    }
                })

            })
        })
    }

    function assembleUser(){
        let c = {};
        c.email = $("#email").val();
        c.password= $("#password").val();
        return c;
    }

    //function for registering a user
    function register() {
        let user = assembleUser()
        $.ajax({
            url: '/register',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(user),
            success: async function(response){
                console.log(response)
                if(response == 'User was succesfully registered.'){
                    alert(response)
                    window.location.href = "http://localhost:3000/index.html"    //go to login page if user registration was successful
                }else{
                    alert(response)                                            //alert that registration was not successful 
                }
            },
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ':' + xhr.statusText
                alert('Error -' + errorMessage)
            }
        })
    }

    //clears the loggedUser database since theres no active user
    if(location.href.split("/").slice(-1) == 'index.html'){
        logOutBackup()
    }
        
    //logs out a logged in user
    function logOut(){
        $.ajax({
            url: '/logout', 
            type: 'POST',
            contentType: 'application/json',  
            success: async function(response){
                console.log(response);
                alert(response)  
                window.location.href = "http://localhost:3000/index.html"    
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            } 
        });
    }

    //clears loggedUser database if on login page
    function logOutBackup(){
        $.ajax({
            url: '/logout', 
            type: 'POST',
            contentType: 'application/json',  
            success: async function(response){
                console.log(response);   
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            } 
        });
    }

})




















