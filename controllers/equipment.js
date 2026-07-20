const renderNewForm = function (req, res){
    res.render("../views/listings/new.ejs", {
        user: req.session.user,
    });
};

const createEquipment =  function (req, res){
    console.log("Form Data:", req.body);
    console.log("Uploaded Image:", req.file);
    
    // console log for check
    // res.send("received successfully!"); 

    // I will change this route.
    res.redirect('/')
};

module.exports = {
    renderNewForm,
    createEquipment,
};