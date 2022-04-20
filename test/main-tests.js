var assert = require('assert');
const request = require('request');
let validator = require('validator')


describe('Test API calls', function(){
    describe('Weather', async function(){
        var myurl = "http://localhost:3000" 
        it('Success 1. GET - / (Test getting the guest home page)', function(done){
            request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/',   
            }, function(error, response, body){
                assert.strictEqual(body, 'Guest home page retrieved');
                done()
            });
        });

        it('Success 2. GET - /user (Test getting home page with no bookmarks)', function(done){
            request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/user',   
            }, function(error, response, body){
                assert.strictEqual(body, 'Home page retrieved with no bookmarks');
                done()
            });
        });

        it('Fail 1. POST - /search (Test invalid city name search)', function(done){
            let city = {city_name: "london2"}
            request.post({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/search',
                    body:    JSON.stringify(city)        
            }, function(error, response, body){
                assert.strictEqual(body, 'Not a valid city to search');
                done()
            });
        });

        it('Fail 2. POST - /bookmark (Test invalid city bookmark)', function(done){
            let city = {city_name: "sydney%"}
            request.post({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/bookmark',
                    body:    JSON.stringify(city)        
            }, function(error, response, body){
                assert.strictEqual(body, 'Not a valid city to bookmark');
                done()
            });
        });

        it('Fail 3. DELETE - /delete (Test invalid city bookmark deletion)', function(done){
            let city = {city_name: "london"}
            request.delete({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/delete',
                    body:    JSON.stringify(city)        
            }, function(error, response, body){ 
                assert.strictEqual(body, 'City not found');
                done()
            });
        });

        var myurl = "http://localhost:3000"           
        it('Success 3. POST - /search (Test valid city name search)', function(done){
            let city = {city_name: "london"}
            request.post({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/search',
                    body:    JSON.stringify(city)        
            }, function(error, response, body){
                assert.strictEqual(body, 'City weather information retrieved');
                done()
            });
        });

        it('Success 4. POST - /bookmark (Test valid city bookmark)', function(done){
            let city = {city_name: "sydney"}
            request.post({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/bookmark',
                    body:    JSON.stringify(city)        
            }, function(error, response, body){
                assert.strictEqual(body, 'City bookmarked');
                done()
            });
        });

        it('Success 5. GET - /user (Test getting home page with bookmarks)', function(done){
            request.get({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/user',   
            }, function(error, response, body){
                assert.strictEqual(body, 'Home page retrieved with bookmarks');
                done()
            });
        });


        it('Success 6. DELETE - /delete (Test valid city bookmark deletion)', function(done){
            let city = {city_name: "sydney"}
            request.delete({
                    headers: {'content-type': 'application/json'},
                    url:     myurl+'/delete',
                    body:    JSON.stringify(city)        
            }, function(error, response, body){ 
                assert.strictEqual(body, 'City deleted');
                done()
            });
        });

    })
})


describe('Testing User Registration and Login API Calls', function(){
    describe('User', async function(){
    var myurl = 'http://localhost:3000';           
    //Register valid user
    it('SUCCESS 1. POST - Registered new user successfully', function(){
            let data = {
                email: 'test@test.com',
                password: 'password'
            }
        request.post({
                headers: {'content-type': 'application/json'},
                url:     myurl+'/register',
                body:    JSON.stringify(data)        
        }, function(error, response, body){
            assert.strictEqual(body, 'User successfully registered');
            this.timeout(0);
        })
    })


    //Logging in with previously created entry
    it('SUCCESS 2. POST - Login user successfully', function(done){
        let data = {
            email: 'test@test.com',
            password: 'password'
        }
    request.post({
            headers: {'content-type': 'application/json'},
            url:     myurl+'/login',
            body:    JSON.stringify(data)        
    }, function(error, response, body){
        assert.strictEqual(body, 'Logged in successfully');
        done()
        });
    });


    //Registering user with invalid email 
     it('FAIL 1. POST - Fail to register user with invalid email', function(done){
         let data = {
             email: 1,
             password: 'password'
         }
     request.post({
             headers: {'content-type': 'application/json'},
             url:     myurl+'/register',
             body:    JSON.stringify(data)        
     }, function(error, response, body){
         assert.strictEqual(body, 'User was not registered.');
         done()
        });
    });


     //Login with email that does not exist
     it('Fail 2. POST - Fail to login user with invalid email', function(done){
        let data = {
            email: 'invalid@login.com',
            password: 'password'
        }
    request.post({
            headers: {'content-type': 'application/json'},
            url:     myurl+'/login',
            body:    JSON.stringify(data)        
    }, function(error, response, body){
        assert.strictEqual(body, 'Please enter a valid email address');
        done()
    });
    });


    //Email exists but incorrect password
     it('Fail 3. POST - Fail to login user with invalid password', function(done){
        let data = {
            email: 'test@test.com',
            password: 'wrongPassword'
        }
    request.post({
            headers: {'content-type': 'application/json'},
            url:     myurl+'/login',
            body:    JSON.stringify(data)        
    }, function(error, response, body){
        assert.strictEqual(body, 'Wrong password');
        done()
    });
    });

})
})