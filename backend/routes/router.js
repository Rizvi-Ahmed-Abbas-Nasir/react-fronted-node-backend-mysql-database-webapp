const express = require("express")
const router = express.Router();
const eventMiddleware = require("../middlewares/eventMiddleware")
const setupController = require("../controllers/setupController")
const eventController = require("../controllers/eventController")
const userController = require("../controllers/userController")
const adminController = require("../controllers/adminController")
const qrCodeController = require("../controllers/qrCodeController")
const noticeController = require("../controllers/noticeController")
//test routes
router.get('/', (req, res)=> {
    res.status(200).json({message:"Hello world"});
})
router.post('/setup',  setupController.createTables)
router.post('/student', setupController.insertStudents)
router.get('/createEvent', (req, res)=> {
    res.render('test')
})

//event handlers
router.post('/event', eventMiddleware,eventController.createEvent)
router.get('/event', eventController.getAllEvents)
router.put('/event/:eventId', eventMiddleware, eventController.updateEvent)
router.delete('/event/:eventId', eventController.deleteEvent) // this delete removes the event permanently
router.delete('/removeEvent/:eventId', eventController.removeEvent) // this movese the event to the event history
router.post('/undoEvent/:eventId', eventController.undoEvent) // this moves the event back to the events tab

// event status
router.get('/eventStatus/:eventId', adminController.getStatus)
//user handlers
router.post('/userEventReg/:event_id', userController.registerForEvent ) //registers the user for a event

//admin handlers
router.get('/getAllRegistrations/:eventId', adminController.getAllRegistrations)
router.get('/getApprovedRegistrations/:eventId', adminController.getApprovedRegistrations)
router.put('/approveStudent/:eventId', adminController.approveStudent)
router.delete('/deleteRegistration/:eventId', adminController.deleteRegistration)
router.put('/markAsAttended', adminController.markAsAttended)
router.get('/getAttendance/:eventId', adminController.getAttendance) //get a particular events attendance list
router.get('/getAllAttendance', adminController.getAllAttendance) //for the all events attendance sheet

//notice
router.post('/notice/:eventId', noticeController.createNotice)
router.put('/notice/:eventId', noticeController.updateNotice)
router.delete('/notice/:eventId', noticeController.deleteNotice)

//qrcode send handler
router.post('/sendAttendanceQrcode',qrCodeController.sendAttendanceQrcode)


module.exports = router