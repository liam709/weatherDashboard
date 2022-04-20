let validator = require('validator');

//Checks if email is valid by validators isEmail method
let validateEmail = (email) => {
    return new Promise ((resolve, reject) => {
        let isValid = validator.isEmail(email);
        if(isValid){
            resolve('The email is valid')
        } else {
            reject('The email is invalid')
        }
    })
}

//Valid password if length is at least 6. Not used currently. 
let validatePassword = (password) => {
    return new Promise ((resolve, reject) => {
        let isValid = password.isLength({ min: 6 });
        if(isValid){
            resolve('Password is valid');
        } else {
            reject('Password is invalid')
        }
    })
}

module.exports.validateFields = (email, password) => {
	return Promise.all([ validateEmail(email)])
		.then((values) => {
			// console.log(values);
			return true;
		})
		.catch((err) => {
			// console.log(err);
			return false;
		});
};
