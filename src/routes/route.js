const express  = require("express")
const router =express.Router()
const { createUser,login, getProfile ,updateUserDetails } = require('../controller/userController')

//_______________________________________________USER API'S______________________________________________________//



router.post('/register',createUser);
router.get("/user/:userId/profile",getProfile)
router.post("/login",login)
router.put('/user/:userId/profile',updateUserDetails)




//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AWS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>API for  pathParam >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// router.all("/*",(req,res)=>{res.status(400).send({status:false,message:"Invalid path params"})})





//.................................................................................................................//
module.exports = router;