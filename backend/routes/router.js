const express = require("express")
const router = express.Router();
const middleware = require("../middlewares/middleware")

router.get('/', (req, res)=> {
    res.status(200).json({message:"Hello world"});
})

module.exports = router