const Setup = require('../helpers/Setup')

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

exports.insertStudents = async (req,res)=> {
    try {
        const { email_id, first_name, middle_name, last_name, clg_id, branch, ac_yr, degree, degree_year} = req.body;
        const result = await Setup.createStudent(email_id, first_name, middle_name, last_name, clg_id, branch, ac_yr, degree, degree_year)

        if(result){
            res.status(200).json({message: "Successfully registered student"})
        } else {
            res.status(500).json({message: "Error", result: result})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error registering student"})
        
    }
}