const mongoose = require('mongoose');


// __________________________________REGEX________________________________________//


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};


const nameRegex = (name) => {
     return (/^[a-z]+$/g.test(name));
     }


const logoRegex = (logoLink) => {
    const urlRegex = /(http[s]:\/\/)([a-z\-0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-\/._~:?#\[\]@!$&'()+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png)/i;
    return urlRegex.test(logoLink)
};

const emailRegex = (email) => {
     return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
     }

const phoneRegex = (number) => {
     return (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(number));
     }

const passRegex = function (password) {
    return (/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password))
}

const pincodeRegex = (pincode) => { 
    return (/^\+?([1-9]{1})\)?([0-9]{5})$/.test(pincode)); 

}
const ObjectID = (id) => {
     return mongoose.isValidObjectId(id); 
    }

    const isValid = function (value) {     
        if (typeof value === "undefined" || value === null) return false;
        if (typeof value === "string" && value.trim().length === 0) return false; 
        return true;
    };

    


module.exports = { isValidRequestBody, nameRegex, logoRegex, emailRegex, phoneRegex, passRegex, pincodeRegex, ObjectID,isValid }


// ______________________SHRIKANT CH _____________________________________

// const isValid = function (value) {     
//     if (typeof value === "undefined" || value === null) return false;
//     if (typeof value === "string" && value.trim().length === 0) return false; 
//     return true;
// };

// const isValidRequestBody = function (requestBody) {
//     return Object.keys(requestBody).length > 0;
// };

// const isValidObjectId = function (objectId) {
//     return mongoose.Types.ObjectId.isValid(objectId);
// };


const isValidString = function (value) {
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidTitle = function (title) {
    return ["S", "XS","M","X", "L","XXL", "XL"].indexOf(title) !== -1;
  };

  const isValidStatus = function(status) {
    return ['pending', 'completed', 'cancelled'].indexOf(status) !== -1
}






// module.exports= {isValid, isValidRequestBody, isValidObjectId, isValidString, isValidTitle,isValidStatus}