const connection = require("../config/db");

class adminController {
  getAllUsers = (req,res) =>{
    let sql = "SELECT * from user"
    connection.query(sql,(err,result)=>{
      if(err){
        res.status(500).json(err);
      }else {
        res.status(200).json(result)
      }
    })
  }

  disableUser = (req,res)=>{
    const {user_id,status} = req.body
    let sql = `UPDATE user SET is_disabled = 1 WHERE user_id = ${user_id}`

    connection.query(sql,(err)=>{
      if(err){
        res.status(500).json(err)
      }else{
        let sql2 = `DELETE FROM participate WHERE user_id = ${user_id}`
        connection.query(sql2, (err2, result) => {
          if(err2){
            res.status(500).json(err)
          }else{
            res.status(200).json(result)
          }
        })
      }
    })
  }

  enableUser = (req,res)=>{
    const {user_id} = req.body
    let sql = `UPDATE user SET is_disabled = 0 WHERE user_id = ${user_id}`

    connection.query(sql,(err, result)=>{
      if(err){
        res.status(500).json(err)
      }else{
        res.status(200).json(result)
      }
    })
  }

  getAllSports = (req, res) => {
    let sql = `select * from sport`
    connection.query(sql, (err, result)=>{
      if(err){
        res.status(500).json(err)
      }else{
        res.status(200).json(result)
      }
    })
  }

  

  disableSport = (req, res) => {
    let { sport_id } = req.body;
    let sql = `UPDATE sport SET is_disabled = 1 WHERE sport_id = ${sport_id}`;
    connection.query(sql, (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        let sql2 = `DELETE FROM practice WHERE sport_id = ${sport_id}`
        connection.query(sql2, (err2, result) =>{
          if(err2){
            res.status(500).json(err2)
          }else{
            res.status(200).json(result)
          }
        })
      }
    });
  };

  enableSport = (req, res) => {
    let { sport_id } = req.body;
    let sql = `UPDATE sport SET is_disabled = 0 WHERE sport_id = ${sport_id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
}

module.exports = new adminController();
