const Equipment = require('../models/equipment')
const cloudinary = require('../config/cloudinary')

const uploadImage = function (fileBuffer){
  return new Promise(function (resolve, reject) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'shooter-equipments/equipments',
        resource_type: 'image',
      },
      function (error, result){
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

const showNewForm = function (req, res) {
    res.render('equipment/new.ejs')
}

const create = async function (req, res) {
    if (!req.file) {
        return res.render('error.ejs', {
            msg: 'Please select an image.'
        })
    }

    const uploadedImage = await uploadImage(req.file.buffer)
    
    const equipmentData = {}


    equipmentData.title = req.body.title
    equipmentData.category = req.body.category
    equipmentData.dailyPrice = req.body.dailyPrice
    equipmentData.description = req.body.description
    equipmentData.owner = req.session.user._id
    
    equipmentData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
    }

    let createdEquipment = await Equipment.create(equipmentData)
    
    res.redirect('/equipment')
}

const index = async function (req, res) {
    const allEquipments = await Equipment.find().populate('owner')
    
    res.render('equipment/index.ejs', { allEquipments })
}

const show = async function (req, res)  {
    const foundEquipment = await Equipment.findById(req.params.equipmentId).populate('owner')

    const userHasFavorited = foundEquipment.favoritedByUsers.some(function (user) {
        return user.equals(req.session.user._id)
    })
  
    res.render('equipment/show.ejs', {
        foundEquipment,
        userHasFavorited
    })
}

const deleteEquipment = async function (req, res) {
    await Equipment.findByIdAndDelete(req.params.equipmentId)
    res.redirect('/equipment')
}

const edit = async function (req, res) {
    const foundEquipment = await Equipment.findById(req.params.equipmentId)

    res.render('equipment/edit.ejs', {
        foundEquipment
    })
}

const update = async function (req, res) {
    let equipmentData = {}
    equipmentData.title = req.body.title
    equipmentData.category = req.body.category
    equipmentData.dailyPrice = req.body.dailyPrice
    equipmentData.description = req.body.description
    if (req.file) {
        const uploadedImage = await uploadImage(req.file.buffer)
        equipmentData.image = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        }
    }
    await Equipment.findByIdAndUpdate(req.params.equipmentId, equipmentData)
    res.redirect(`/equipment/${req.params.equipmentId}`)
}

const favorite = async function (req, res) {
    await Equipment.findByIdAndUpdate(req.params.equipmentId, {
        $push: { favoritedByUsers: req.params.userId }
    })

    res.redirect(`/equipment/${req.params.equipmentId}`)
}

const unfavorite = async function (req, res) {
    await Equipment.findByIdAndUpdate(req.params.equipmentId, {
        $pull: { favoritedByUsers: req.params.userId }
    })

    res.redirect(`/equipment/${req.params.equipmentId}`)
}


const myFavorites = async function (req, res) {
    const favoriteEquipments = await Equipment.find({ favoritedByUsers: req.session.user._id }).populate('owner')
    
    res.render('equipment/favorites.ejs', { favoriteEquipments })
}


module.exports = {
    showNewForm,
    create,
    index,
    show,
    deleteEquipment,
    edit,
    update,
    favorite,
    unfavorite,
}