const express = require("express")
const router = express.Router();
const eventMiddleware = require("../middlewares/eventMiddleware")
const setupController = require("../controllers/setupController")
const eventController = require("../controllers/eventController")
const userController = require("../controllers/userController")
const adminController = require("../controllers/adminController")

//test routes
router.get('/', (req, res)=> {
    res.status(200).json({message:"Hello world"});
})
router.post('/setup',  setupController.createTables)
router.post('/student', setupController.insertStudents)

//event handlers
router.post('/event', eventMiddleware,eventController.createEvent)
router.get('/event', eventController.getAllEvents)
router.put('/event/:id', eventMiddleware, eventController.updateEvent)
router.delete('/event/:id', eventController.deleteEvent)

//user handlers
router.post('/userEventReg/:id', userController.registerForEvent ) //registers the user for a event

//admin handlers
router.get('/getAllRegistrations/:id', adminController.getAllRegistrations)
router.get('/getApprovedRegistrations/:id', adminController.getApprovedRegistrations)
router.put('/approveStudent/:eventId', adminController.approveStudent)
router.put('/markAsAttended', adminController.markAsAttended)

module.exports = router