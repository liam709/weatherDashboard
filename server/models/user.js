const validator = require('../../utils/validate')

class User {
    constructor(email, password){
        this.email = email;
        this.password = password;
        this.cities = [];
    }

    async isValid(){
        return validator.validateFields(this.email)
    }
}

module.exports.User = User;