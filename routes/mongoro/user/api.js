const express = require('express')
const router = express.Router()
const MongoroUserModel = require("../../../models/mongoro/auth/mongoroUser_md")
const verify = require("../../../verifyToken")
const CryptoJS = require("crypto-js")

router.get("/all", verify, async (req, res) => {
    try {
        const user = await MongoroUserModel.find();
        res.status(200).json(user.reverse());
    } catch (err) {
        res.status(500).json({
            msg: 'there is an unknown error sorry !'
        })
    }
})

router.delete("/delete", verify, async (req, res) => {
    try {
        if (!req.body.id ) return res.status(402).json({ msg: 'provide the id ?' })

        await MongoroUserModel.deleteOne({ _id: req.body.id })
        res.status(200).json("User deleted....");
    } catch (error) {
        res.status(500).json({
            msg: 'there is an unknown error sorry !'
        })
    }

});

router.get("/single", verify, async (req, res) => {
    try {
        if (!req.body.id ) return res.status(402).json({ msg: 'provide the id ?' })

        let user = await MongoroUserModel.find({ _id: req.body.id })
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            msg: 'there is an unknown error sorry !'
        })
    }
})


router.put('/edit', verify, async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    let { id } = body;

    try {
        if (!req.body.id ) return res.status(402).json({ msg: 'provide the id ?' })

        await MongoroUserModel.updateOne({ _id: id }, body).then(async () => {
            let user = await MongoroUserModel.findOne({ _id: id })
            return res.status(200).json({
                msg: 'Account Setup Successfully !!!',
                user: user
            })
        }).catch((err) => {
            res.send(err)
        })

    } catch (error) {
        res.status(500).json({
            msg: 'there is an unknown error sorry !'
        })
    }


})

router.put('/edit_password', verify, async (req, res) => {

    const user = await MongoroUserModel.findOne({ _id: req.body.id });
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    try {
        if (!req.body.id ) return res.status(402).json({ msg: 'provide the id ?' })

        if(originalPassword != req.body.password){
            res.status(401).json("wrong password !");
        }else{
            const newPassword = CryptoJS.AES.encrypt(req.body.new_password, "mongoro").toString()
            await MongoroUserModel.updateOne({ _id: req.body.id }, {password: newPassword}).then(async () => {
                const Newuser = await MongoroUserModel.findOne({ _id: req.body.id });
                return res.status(200).json({
                    msg: 'Account Setup Successfully !!!',
                    user: Newuser
                })
            }).catch((err) => {
                res.send(err)
            })
        }
     
    } catch (error) {
        res.status(500).json({
            msg: 'there is an unknown error sorry !'
        })
    }


})

module.exports = router

