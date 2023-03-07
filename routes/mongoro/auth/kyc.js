const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
const KycModel = require("../../../models/mongoro/kyc/kyc_md")
const MongoroUserModel = require("../../../models/mongoro/auth/mongoroUser_md")
const verify = require("../../../verifyToken")
const CryptoJS = require("crypto-js")

let multer = require('multer')
let fs = require('fs')
let path = require('path');

//Configure Storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let __dir = path.join(__dirname, "../../../public/uploads")
        cb(null, __dir)
    }, filename: function (req, file, cb) {
        let fileName = file.originalname.toLowerCase()
        cb(null, fileName)
    }
})

//set Storage Configuration to multer
let upload = multer({ storage })

//CREATE
router.post('/', verify, async (req, res) => {



    try {
        // const validate = await KycModel.findOne({ userId: req.body.userId })
        // if (validate) return res.status(404).json({ msg: 'This user is verified already ', status: 404 })

        if (req.body.bvn) {
            req.body.bvn = CryptoJS.AES.encrypt(req.body.bvn, "mongoro").toString()
        }
    
        if (req.body.myidentikey) {
            req.body.myidentikey = CryptoJS.AES.encrypt(req.body.myidentikey, "mongoro").toString()
        }

        let user = await new KycModel(req.body)

        // req.files.map(e => {
        //     switch (e.fieldname) {
        //         case "national_id":
        //             user.national_id = e.filename
        //             break;
        //     }
        // })

        // req.files.map(e => {
        //     switch (e.fieldname) {
        //         case "international_passport":
        //             user.international_passport = e.filename
        //             break;
        //     }
        // })

        await user.save().then(() => {
            MongoroUserModel.updateOne({ _id: req.body.userId }, { $set: { verification: { kyc: true } } }).then(() => {
                res.status(200).json({
                    msg: 'Congratulation Kyc is done ',
                    status: 200
                })
            })
        })

    } catch (error) {
        res.status(500).json({
            msg: 'there is an unknown error sorry ',
            status: 500
        })
    }
})

//GET
router.get("/all", verify, async (req, res) => {
    try {
        const user = await KycModel.find();
        res.status(200).json(user.reverse());
    } catch (err) {
        res.status(500).json({
            msg: 'there is an unknown error sorry !',
            status: 500
        })
    }
})

//Single 
router.get("/single", verify, async (req, res) => {
    try {
        if (!req.body.userId) return res.status(402).json({ msg: 'provide the id ?', status: 400 })

        let user = await KycModel.find({ userId: req.body.userId })
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            msg: 'there is an unknown error sorry !',
            status: 500
        })
    }
})



module.exports = router