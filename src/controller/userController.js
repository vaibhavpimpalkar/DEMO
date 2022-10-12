const userModel = require('../models/userModel');
const { isValidRequestBody, nameRegex, logoRegex, emailRegex, phoneRegex, passRegex, pincodeRegex, ObjectID, isValid } = require('../validator/validation');
const AWS = require('../AWS/aws-sdk.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const uploadFile = require("../AWS/aws-sdk")



// ________________________________________________CREATE USER_____________________________________________________//

const createUser = async function (req, res) {
    try {
        let data = req.body

        let files = req.files

        const { fname, lname, email, phone, password, address } = data

        if (!files || files.length == 0) {
            return res.status(400).send({ status: false, msg: "file is required" })
        }

        if (!fname) {
            return res.status(400).send({ status: false, msg: "please provide fname." })
        }

        if (!nameRegex(fname)) {
            return res.status(400).send({ status: false, msg: "please provide valid fname." })
        }

        if (!lname) {
            return res.status(400).send({ status: false, msg: "please provide lname." })
        }

        if (!nameRegex(lname)) {
            return res.status(400).send({ status: false, msg: "please provide valid lname." })
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "please provide email address." })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "please provide valid email address." })
        }

        if (!emailRegex(email)) {
            return res.status(400).send({ status: false, msg: "please provide a valid email address." })
        }

        const uniqueEmail = await userModel.findOne({ email: email })

        if (uniqueEmail) {
            return res.status(400).send({ status: false, msg: "email address already registered." })
        }


        if (!phone) {
            return res.status(400).send({ status: false, msg: "please provide phone number." })
        }
        if (!phoneRegex(phone)) {
            return res.status(400).send({ status: false, msg: "It's not a valid mobile number" })
        }

        const uniquePhone = await userModel.findOne({ phone: phone })

        if (uniquePhone) {
            return res.status(400).send({ status: false, msg: "Phone Number already registered." })
        }


        if (!password) {
            return res.status(400).send({ status: false, msg: "please provide password." })
        }

        if (!passRegex(password)) {
            return res.status(400).send({ status: false, msg: "please provide valid password." })
        }

        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, msg: "The length of password should be between 8 and 15" })
        }

        const salt = await bcrypt.genSalt(10)
        data.password = await bcrypt.hash(data.password, salt)



        if (!address) {
            return res.status(400).send({ status: false, msg: "please provide address" })
        }


        if (!isValid(address)) {
            return res.status(400).send({ status: false, msg: "please provide valid address." })
        }


        if (!address.shipping) {
            return res.status(400).send({ status: false, msg: "please provide shipping details" })
        }


        if (!isValid(address.shipping)) {
            return res.status(400).send({ status: false, msg: "please provide valid address." })
        }


        if (!address.shipping.street) {
            return res.status(400).send({ status: false, msg: "please provide shipping street details" })
        }


        if (!isValid(address.shipping.street)) {
            return res.status(400).send({ status: false, msg: "please provide valid shipping street address." })
        }

        if (!address.shipping.city) {
            return res.status(400).send({ status: false, msg: "please provide shipping city details" })
        }


        if (!isValid(address.shipping.city)) {
            return res.status(400).send({ status: false, msg: "please provide valid shipping city address." })
        }

        if (!address.shipping.pincode) {
            return res.status(400).send({ status: false, msg: "please provide shipping pincode details" })
        }

        if (!isValid(address.shipping.pincode)) {
            return res.status(400).send({ status: false, msg: "please provide valid shipping pincode address." })
        }

      


        if (!(address.shipping.pincode).length == 6) {
            return res.status(400).send({ status: false, msg: "please provide valid 6 digit pincode ." })
        }



        if (!address.billing) {
            return res.status(400).send({ status: false, msg: "please provide billing details" })
        }


        if (!isValid(address.billing)) {
            return res.status(400).send({ status: false, msg: "please provide valid billing address." })
        }


        if (!address.billing.street) {
            return res.status(400).send({ status: false, msg: "please provide billing street details" })
        }


        if (!isValid(address.billing.street)) {
            return res.status(400).send({ status: false, msg: "please provide valid billing street address." })
        }

        if (!address.billing.city) {
            return res.status(400).send({ status: false, msg: "please provide city details for billing" })
        }


        if (!isValid(address.billing.city)) {
            return res.status(400).send({ status: false, msg: "please provide valid city address for billing." })
        }

        if (!address.billing.pincode) {
            return res.status(400).send({ status: false, msg: "please provide billing pincode details" })
        }

        if (!isValid(address.billing.pincode)) {
            return res.status(400).send({ status: false, msg: "please provide valid billing pincode address." })
        }

        if (!(address.billing.pincode).length == 6) {
            return res.status(400).send({ status: false, msg: "please provide valid 6 digit pincode ." })
        }

        let profileImgUrl = await uploadFile.uploadFile(files[0]);
        data.profileImage = profileImgUrl;



        let allData = await userModel.create(data);
        return res.status(201).send({ status: true, msg: "user created successfully..", msg2: allData })



    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })
    }

}


//__________________________________________________USER LOGIN________________________________________________________//

const login = async function (req, res) {
    try {

        let data = req.body
        let { email, password } = data

        if (!isValid(data)) {
            return res.status(400).send({ status: false, msg: "Please provide Details" })
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "please provide E-mail" })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "Please provide password" })
        }

        varify = await userModel.findOne({ email: email, password: password })

        if (!varify) {
            return res.status(401).send({ status: false, msg: "credintial not match" })
        }

        let token = jwt.sign({
            userId: varify._id.toString(),
            iat: Math.floor(Date.now() / 1000)
        },
            "group20project5", { expiresIn: "1hr" }
        );

        res.header("x-api-key", token);
        return res.status(200).send({ status: true, message: "Login Successfully", data: token })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}


//__________________________________________________GET PROFILE_____________________________________________________//

const getProfile = async function (req, res) {
    try {
        const userId = req.params.userId;
        if (!ObjectID(userId)) {
            return res.status(400).send({ status: true, message: "Invalid userId" })
        }

        const user = await userModel.findById({ _id: userId });

        if (!user){
             return res.status(404).send({ status: false, msg: "No User Profile Details available with this userId" });
        }

         res.status(200).send({ status: true, msg: "User Profile details", data: user });

    } 
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};



const updateUserDetails = async function (req, res) {

    try {

        let files = req.files
        let data = req.body
        let userId = req.params.userId


        if (!ObjectID(userId)) {
            return res.status(400).send({ status: false, message: "Invalid UserId" })
        }

        if(!userId){
            return res.status(400).send({status : false , msg : "please Provide userId"}) 
        }

        if(!ObjectID(userId)){
            return res.status(400).send({status : false , msg : "userId is not valid..............!"})
        }

        const { fname, lname, email, phone, password, address } = data

        if(!fname){
            return res.status(400).send({status : false , msg : "please provide name  "})
        }

        if(!nameRegex(fname)){
            return res.status(400).send({status : false , msg : "fname is not valid"})
        }
        if(!lname ){
            return res.status(400).send({status : false , msg : "please provide lname"})
        }

        if(!nameRegex(lname)){
            return res.status(400).send({status:false , msg : " lname is not valid"})
        }

        if(!email){
            return res.status(400).send({status:false , msg : "please provide email "})
        }
        if(!emailRegex(email)){
            return res.status(400).send({status : false , msg : "please provide valid email"})
        }
        if(!phone){
            return res.status(400).send({status : false , msg : "please provide phone"})
        }
        if(!phoneRegex(phone)){
            return res.status(400).send({status : false , msg : "please provide valid phone number"})
        }
        if(!password){
            return res.status(400).send({status:false  , msg : "please provide password"})
        }
        if(!passRegex(password)){
            return res.status(400).send({status : false , msg : " please provide valid password"})
        }
        if(!address){
            return res.status(400).send({status : false , msg : "please provide address "})
        }
       
       if(profileImage){
        if (files) {
            
                if (!(files && files.length > 0)) 
                return res.status(400).send({ status: false, message: "please provide profile image" })
                
                let userImage = await aws_s3.uploadFile(files[0])
                userDetails.profileImage=userImage
            }
        }

        console.log(userDetails)

        let updateProfileDetails = await userModel.findOneAndUpdate(
            { _id: userId },
             {$set: data}, 
             { new: true })

        return res.status(200).send({ status: true, msg:"User Update Successful!!",data: updateProfileDetails })
   
    }
     catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message })
    }
}




module.exports = { createUser,login, getProfile ,updateUserDetails }