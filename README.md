# trueWeather
A weather forecast application created with MEN (Mongo, Express, Node). 

Models:
---
We have a user model which possesses the attributes of user which includes the 
username, password, and favourite cities. This model is important for our application because we 
are building a guest-user based application. 

Routes and Controllers:
---

The following are the paths involved in our application. We created custom modules for 
each of these paths to access when the appropriate HTTP request is called.

Route: / 

Controller: guest()
This controller takes the user to the guest home page where they can get weather information on 
different places or log in

Route: /user 
Controller: user()
Thus controller takes the user to a user home page, provided that they have an account, and this 
home page comes with perks like forecasts and bookmarking.

Route: /search
Controller: search()
This controller retrieves weather information on the search city to be displayed

Route: /boomark 
Controller: bookmark()
This controller saves a favorite city to the database to be displayed on the users home page

Route: /delete 
Controller: deleteBookmark()
This controller removes a city from the database

Route: /register
Controller: registerUser():
This controller creates a new user object from our User.js model, and then saves the email and 
password of the User in the ‘users’ collection of our Mongo db. Currently password is being 
stored as the exact string entered. We are aware this could be a safety concern in the future and 
are looking into encrypting the password using bcrypt or passport.

Route: /login
Controller: loginUser():
This controller reads the mongoDB ‘users’ collection and checks that if the email entered on 
client side exists in the database, and then checks if the password entered on client-side matches 
that in the database. If successful, it will bring the logged in user to the dashboard view, if 
unsuccessful, will return user an error message.



Views:
-- 
guest.html:
	This is the view of a guest user with no log in account. This view is necessary because it allows one to access weather information without an account, although some perks are lost. In this view, one can only do basic weather tasks. The following are possible:
Search a city – When the search button is clicked, it calls on the getCity function in the JS script file which sends a POST request to the server to retrieve weather information on the given city. There are restrictions in place to not allow a wring city search.
Temperature change – When a temperature is selected from the given options, the page is refreshed to update the current temperature unit to the selected one. The default is Celsius.
In this view, the location of the user is automatically retrieved and the weather information for the user’s location is displayed along with the current time.

index.html 
	This is the view on initial connection to the server. In this view, the user can enter their registered information into the required fields. When the login button is pressed, it calls on the login function and sends a POST request to the server to verify if credentials exist in the database. Once verified, the user gets redirected to their user dashboard.
If the user has no account, they can click the ‘Don’t have an account?’ button to redirect the user to the registration page, where they can create new user credentials. 
If the user does not wish to create an account, they can select the ‘Login as guest’ button to access the guest dashboard.

register.html
	This is the view of the registration page. In this view, the user can enter registration credentials into the required fields, which calls the register function and makes a POST request to the server to store the field values in our database collection. The register function allows only unique emails to be stored, so no duplicates can exist in the database. 
The email field can only be submitted if the string contains an ‘@’ symbol. 
The password field is validated by having a minimum length, in our case: 6.
The register view is necessary for our application because registration allows users to relog into the application and not lose their data.

user.html:
	This is the view of a logged in user. This view is necessary because it gives users with an account more benefits. In this view, apart from the functionalities one can do with the guest.html view, one can do the following:
Bookmark a city – When the bookmark button is clicked on a bookmarked item, it calls on the bookmark function in the JS script file which sends a POST request to the server to store the given city in the database. The page then refreshes to display the bookmarked city. There are restrictions in place to not allow a wring city bookmark and not bookmark duplicates.

Delete a bookmarked city – When the delete button is clicked on a bookmarked item, it calls on the deleteBookmark function in the JS script file which sends a DELETE request to the server to remove the bookmarked city from the database. The page also refreshes to update the view.
Get forecast information over a few days for a bookmarked city (info button)– When the info button is clicked on a bookmarked item, it calls on the getForecast function in the script file which retrieves forecast info on the bookmarked city and then displays it in a modal.
Log out Button – This logs out the current user from the session. 

Elements used in assembling the client side:
---
In our client side we have different elements being used. On the user, guest, register and login page, the buttons and what they achieve from the backend are explained in the views section. The libraries being used on the user/guest page are the following:
Google geocoding API - This helps us get the current location of the user to display their current weather temperature.
Google Places API – This helps the user when searching up a city to get weather information on. It displays guesses of what the user is typing under the search input field.
Darkmode.js – This helps the logged in user switch between dark/light mode for easy readability. It is commented out at the bottom of the user.html file because it switches the background color to white/black and we had a background image we’d like to use. You can uncomment it and the feature will be available!
OpenWeather API – This helps us deliver weather information to the user.

Animation effects:
---
We used setInterval() to implement an in-built clock. It repeats a set of code to always give the current time of the user.

Tests:
---
We used Mocha for testing our potential usage scenarios. We tested the user registration/login API calls and the weather-related API calls. 

The following tests were covered for the user registration/login API calls: 

1. SUCCESS 1. POST - Registered new user successfully'
This test takes in a valid email, and valid password and posts the object to our ‘users’ collection.

2. SUCCESS 2. POST - Login user successfully
This test takes the registered email and password from the previous test and checks if it exists in 
our ‘users’ collection. 

3. FAIL 1. POST - Fail to register user with invalid email
This test tries to register with an invalid email. In this case, the email object is an integer so the 
test does not pass the valid email test and returns that user must enter a valid email. 

4. Fail 2. POST - Fail to login user with invalid email
This test looks for a specific email address in our ‘users’ collection, but since the email entered 
does not currently exist in the collection, it fails to login.

5. Fail 3. POST - Fail to login user with invalid password
This test finds an existing matching email in the ‘users’ collection, but since the password 
entered does not match that of the object of entered email, it returns that the user must enter a 
valid password.

The following tests were covered for the weather-related API calls: 

1. Success 1. GET - / (Test getting the guest home page)
This test gets the home page of a guest, and it returns the expected response.

2. Success 2. GET - /home (Test getting home page with no bookmarks)
This test gets the home page of a user with no bookmarks. There isn’t really a failure scenario for
this, so we have just a success step.

3. Fail 1. POST - /search (Test invalid city name search)
This test tries to search for an invalid city which is a common failure case with this type of app,
and it returns the expected response.

4. Fail 2. POST - /bookmark (Test invalid city bookmark)
This test tries to bookmark an invalid city, and it returns the expected response.

5. Fail 3. DELETE - /delete (Test invalid city bookmark deletion)
This test tries to delete a city that is not bookmarked in the database, and it returns the expected 
response.

6. Success 3. POST - /search (Test valid city name search)
This test searches up a city with a valid city name and it returns the expected response.

7. Success 4. POST - /bookmark (Test valid city bookmark)
This test bookmarks a valid city name and it returns the expected response.

8. Success 5. GET - /home (Test getting home page with bookmarks)
This test gets the home page of a user with bookmarks, and it returns the expected response.

9. Success 6. DELETE - /delete (Test valid city bookmark deletion)
This test deletes the bookmark of a valid city in the database, and it returns the expected
response

How to run code:
---
Run the following commands from VS code project terminal:<br/>
npm init -y <br/>
npm install <br/>
cd server <br/>
node app.js <br/>
Go to http://localhost:3000/


