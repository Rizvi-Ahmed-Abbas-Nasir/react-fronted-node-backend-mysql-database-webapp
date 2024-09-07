const Setup = require('../models/Setup')

exports.createTables = async (req,res)=> {
    try {
        const result = await Setup.createTables()

        if(result){
            res.status(200).json({message: "Successfully created tables"})
        } else {
            res.status(500).json({message: "Error", result: result})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error Creating tables"})
        
    }
}