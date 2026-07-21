// This middleware to ignore the renter if joining the some page like the create new Equipment

const isOwner = function (req, res, next) {
    if (req.session.user && req.session.user.role === 'owner') {
        return next()
    }
    res.redirect('/')
}

module.exports = isOwner