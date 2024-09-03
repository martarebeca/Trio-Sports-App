class indexController {
  home = (req, res) =>{
    res.send("home")
  }
}

module.exports = new indexController;