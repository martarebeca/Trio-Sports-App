const connection = require("../config/db");

class SportController {
  createSport = (req, res) => {
    let { sport_name } = req.body;

    // Convertir el nombre del deporte a minúsculas y luego hacer que la primera letra sea mayúscula
    sport_name = sport_name.toLowerCase();
    sport_name = sport_name.charAt(0).toUpperCase() + sport_name.slice(1);

    const sport_img = "newsport.jpg";

    // Comprobar si ya existe un deporte con ese nombre
    let sql = `SELECT * FROM sport WHERE sport_name = ?`;
    connection.query(sql, [sport_name], (error, result) => {
      if (error) {
        console.log("Error en la consulta de verificación:", error); // Depurar errores
        return res.status(500).json({ error: "Error al verificar deporte" });
      }

      if (result.length !== 0) {
        console.log("El deporte ya existe"); // Depurar si ya existe
        return res.status(401).json("El deporte ya existe");
      }

      // validación deporte: longitud nombre deporte
      if (sport_name.length > 50) {
        return res.status(400).json({
          error: "El nombre del deporte no puede tener más de 50 caracteres.",
        });
      }

      // Validación deporte: Campo vacío
      if (!sport_name || sport_name.trim() === "") {
        return res
          .status(400)
          .json({ error: "El nombre del deporte no puede estar vacío." });
      }

      // Insertamos el deporte con la imagen por defecto
      let sql2 = `INSERT INTO sport (sport_name, sport_img) VALUES (?, ?)`;
      connection.query(sql2, [sport_name, sport_img], (errIns, result2) => {
        if (errIns) {
          return res.status(500).json({ error: "Error al insertar deporte" });
        }

        return res.status(201).json({
          sport_id: result2.insertId,
          sport_name: sport_name,
          sport_img: sport_img,
        });
      });
    });
  };

  getAllSports = (req, res) => {
    const sql = `SELECT sport_id, sport_name FROM sport WHERE is_disabled = 0 ORDER BY sport_name ASC`;

    connection.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener los deportes:", error);
        return res.status(500).json({ error: "Error al obtener los deportes" });
      }

      res.json(results);
    });
  };
}

module.exports = new SportController();
