const express = require("express")
const router = express.Router();
const eventMiddleware = require("../middlewares/eventMiddleware")
const setupController = require("../controllers/setupController")
const eventController = require("../controllers/eventController")
router.get('/', (req, res)=> {
    res.status(200).json({message:"Hello world"});
})

router.post('/setup',  setupController.createTables)

//event handlers
router.post('/event', eventMiddleware,eventController.createEvent)
router.get('/event', eventController.getAllEvents)
router.put('/event/:id', eventMiddleware, eventController.updateEvent)
router.delete('/event/:id', eventController.deleteEvent)

module.exports = router