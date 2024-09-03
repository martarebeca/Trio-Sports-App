const connection = require("../config/db");

class CommentController {
  // Obtener comentarios por actividad
  getCommentsByActivity = (req, res) => {
    const { activity_id } = req.params;

    const sql = `
    SELECT c.comment_id, c.text, c.date, u.user_name, u.user_img 
    FROM comment c 
    JOIN user u ON c.user_id = u.user_id 
    WHERE c.activity_id = ? 
    ORDER BY c.date DESC
    `;

    connection.query(sql, [activity_id], (error, results) => {
      if (error) {
        console.error("Error al obtener comentarios:", error);
        return res.status(500).json({ error: "Error al obtener comentarios" });
      }
      res.status(200).json(results);
    });
  };

  // Añadir un comentario a una actividad
  addComment = (req, res) => {
    const { activity_id, user_id, text } = req.body;

    // Validaciones
    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ error: "El comentario no puede estar vacío." });
    }

    if (text.length > 255) {
      return res
        .status(400)
        .json({ error: "El comentario no puede exceder los 255 caracteres." });
    }

    const sql = `INSERT INTO comment (activity_id, user_id, text, date) VALUES (?, ?, ?, NOW())`;
    connection.query(sql, [activity_id, user_id, text], (error, result) => {
      if (error) {
        console.error("Error al añadir el comentario:", error);
        return res.status(500).json({ error: "Error al añadir el comentario" });
      }
      res.status(201).json({ message: "Comentario añadido correctamente" });
    });
  };
}

module.exports = new CommentController();
