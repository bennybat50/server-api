const express = require('express')
const dotenv = require("dotenv")
dotenv.config()
const { useAsync, utils, errorHandle, } = require('./../core');
const MindCastUser = require('../models/model.user')
const MindCastInterest = require('../models/model.interest');



exports.interest = useAsync(async (req, res) => {

    try{

        const interest = await MindCastInterest.create(req.body)
        return res.json(utils.JParser('Interest created successfully', !!interest, interest));

    } catch (e) {
        throw new errorHandle(e.message, 400)
    }

})

exports.singleInterest = useAsync(async (req, res) => {

    try {
        const interest = await MindCastInterest.findOne({ _id: req.params.id });
        return res.json(utils.JParser('Interest fetch successfully', !!interest, interest));
    } catch (e) {
        throw new errorHandle(e.message, 400)
    }
})

exports.allInterest = useAsync(async (req, res) => {

    try {
        const interest = await MindCastInterest.find();
        return res.json(utils.JParser('Interest fetch successfully', !!interest, interest));
    } catch (e) {
        throw new errorHandle(e.message, 400)
    }
})

exports.userInterest = useAsync(async (req, res) => {

    try {
        const interest = await MindCastInterest.find({ userID: req.params.id });
        return res.json(utils.JParser('User Interest fetch successfully', !!interest, interest));
    } catch (e) {
        throw new errorHandle(e.message, 400)
    }
})

exports.deleteInterest = useAsync(async (req, res) => {
    try {
        if (!req.body.id) return res.status(402).json({ msg: 'provide the id ' })

        await MindCastInterest.deleteOne({ _id: req.body.id })
        return res.json(utils.JParser('Interest deleted successfully', true, []));

    } catch (e) {
        throw new errorHandle(e.message, 400)
    }

});