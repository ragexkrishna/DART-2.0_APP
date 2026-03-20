import Schedule from "../models/Schedule.js"
import Attendance from "../models/Attendance.js"

export const getWorkshops = async (req, res) => {

    const workshops = await Workshop.find()

    res.json(workshops)

}

export const markAttendance = async (req, res) => {

    const { workshopId } = req.body

    const attendance = await Attendance.create({
        user: req.user._id,
        workshop: workshopId,
        present: true
    })

    res.json(attendance)
}

export const submitFeedback = async (req, res) => {

    const { workshopId, rating, comment } = req.body

    const feedback = await Feedback.create({
        user: req.user._id,
        workshop: workshopId,
        rating,
        comment
    })

    res.json(feedback)
}