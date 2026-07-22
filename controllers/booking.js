const Booking = require('../models/booking')
const Equipment = require('../models/equipment')

const createBooking = async function (req, res) {
    try {
        const equipmentId = req.params.equipmentId
        const equipment = await Equipment.findById(equipmentId)

        const startDate = new Date(req.body.startDate)
        const endDate = new Date(req.body.endDate)

        const diffTime = Math.abs(endDate - startDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

        const totalPrice = diffDays * equipment.dailyPrice
        await Booking.create({
            equipment: equipmentId,
            renter: req.session.user._id,
            startDate: startDate,
            endDate: endDate,
            totalPrice: totalPrice,
        })

        res.redirect('/bookings/my-bookings')
        
    } catch (error) {
        console.log(error)
        res.render('error.ejs', { msg: 'Something went wrong with your booking.' })
    }
}

const myBookings = async function (req, res) {
    try {
        const bookings = await Booking.find({ renter: req.session.user._id }).populate('equipment')
        
        res.render('bookings/index.ejs', { bookings })
    } catch (error) {
        console.log(error)
        res.render('error.ejs', { msg: 'Could not load your bookings.' })
    }
}


const ownerDashboard = async function (req, res) {
    try {
        const myEquipments = await Equipment.find({ owner: req.session.user._id })
        
        const myEquipmentsIds = myEquipments.map(eq => eq._id) // by search it
        const bookingRequests = await Booking.find({ equipment: { $in: myEquipmentsIds } })
            .populate('equipment')
            .populate('renter')
        res.render('bookings/dashboard.ejs', { bookingRequests, myEquipments })
    } catch (error) {
        console.log(error)
        res.render('error.ejs', { msg: 'Could not load your dashboard.' })
    }
}

module.exports = {
    createBooking,
    myBookings,
    ownerDashboard,
}