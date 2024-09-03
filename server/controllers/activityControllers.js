const connection = require("../config/db");
const jwt = require("jsonwebtoken");

class ActivityController {
  createActivity = (req, res) => {
    const {
      date_time_activity,
      limit_users,
      title,
      activity_city,
      activity_address,
      details,
      sport_id,
      maps_link,
    } = req.body;

    // Extraer el token desde los headers
    let token = req.headers.authorization.split(" ")[1];

    // Decodificar el token para obtener el user_id
    let decoded = jwt.decode(token);
    let user_id = decoded.id;

    // Validación de campos obligatorios
    if (
      !date_time_activity ||
      !title ||
      !activity_city ||
      !activity_address ||
      !sport_id ||
      !user_id
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos obligatorios deben completarse." });
    }

    // Validación de fecha y hora (debe ser futura)
    const currentDateTime = new Date();
    const activityDateTime = new Date(date_time_activity);

    if (activityDateTime <= currentDateTime) {
      return res.status(400).json({
        error: "La fecha y hora de la actividad deben ser en el futuro.",
      });
    }

    // Validación de longitud de la ciudad
    if (activity_city.length > 50) {
      return res.status(400).json({
        error: "El nombre de la ciudad no puede tener más de 50 caracteres.",
      });
    }

    // Validación de formato de la ciudad (solo letras, acentos y espacios)
    const cityPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!cityPattern.test(activity_city)) {
      return res.status(400).json({
        error: "El nombre de la ciudad contiene caracteres inválidos.",
      });
    }

    // Validación del título de la actividad (longitud máxima)
    if (title.length > 255) {
      return res.status(400).json({
        error: "El título no puede tener más de 255 caracteres.",
      });
    }

    // Validación de límite de usuarios (debe ser un número positivo o nulo)
    if (limit_users !== null && limit_users <= 1) {
      return res
        .status(400)
        .json({ error: "El límite de usuarios debe ser al menos 2." });
    }

    // Validación de dirección (longitud máxima y no vacía)
    if (activity_address.length > 250) {
      return res
        .status(400)
        .json({ error: "La dirección no puede tener más de 250 caracteres." });
    }

    // Validación del enlace de Google Maps (solo URL válida)
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (maps_link && !urlPattern.test(maps_link)) {
      return res
        .status(400)
        .json({ error: "El enlace de Google Maps no es válido." });
    }

    // Formatear texto (solo la primera letra en mayúscula)
    const formatText = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    let formattedTitle = formatText(title);
    let formattedCity = formatText(activity_city);
    let formattedAddress = formatText(activity_address);

    // Crear la nueva actividad en la base de datos
    const sql = `INSERT INTO activity (date_time_activity, limit_users, title, activity_city, activity_address, details, sport_id, user_id, maps_link, num_assistants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
    const values = [
      date_time_activity,
      limit_users || null,
      formattedTitle,
      formattedCity,
      formattedAddress,
      details,
      sport_id,
      user_id,
      maps_link || null,
    ];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al crear la actividad:", err);
        return res.status(500).json({ error: "Error al crear la actividad." });
      }

      const activity_id = result.insertId;

      // Añadimos al creador de la actividad como participante automáticamente
      const sqlAddParticipant = `INSERT INTO participate (activity_id, user_id) VALUES (?, ?)`;
      connection.query(sqlAddParticipant, [activity_id, user_id], (err) => {
        if (err) {
          console.error("Error al añadir al creador como participante:", err);
          return res.status(500).json({
            error: "Error al añadir al creador como participante.",
          });
        }

        res.status(201).json({
          message:
            "Actividad creada con éxito y creador añadido como participante",
          activity_id: activity_id,
        });
      });
    });
  };

  joinActivity = (req, res) => {
    const { activity_id } = req.body;

    if (!activity_id) {
      return res.status(400).json({ error: "Activity ID is required." });
    }

    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.decode(token);
    let user_id = decoded.id;

    // Verificamos la capacidad de la actividad antes de permitir que el usuario se una
    const sqlCheckCapacity = `SELECT num_assistants, limit_users FROM activity WHERE activity_id = ?`;
    connection.query(sqlCheckCapacity, [activity_id], (err, results) => {
      if (err) {
        console.error("Error al verificar la capacidad:", err);
        return res
          .status(500)
          .json({ error: "Error al verificar la capacidad." });
      }

      const { num_assistants, limit_users } = results[0];
      if (limit_users !== null && num_assistants >= limit_users) {
        return res
          .status(400)
          .json({ error: "La actividad ya está completa." });
      }

      // Comprobar si el usuario ya está inscrito en la actividad
      const sqlCheckParticipation = `SELECT * FROM participate WHERE activity_id = ? AND user_id = ?`;
      connection.query(
        sqlCheckParticipation,
        [activity_id, user_id],
        (err, results) => {
          if (err) {
            console.error("Error al verificar la participación:", err);
            return res
              .status(500)
              .json({ error: "Error al verificar la participación." });
          }

          if (results.length > 0) {
            return res
              .status(400)
              .json({ error: "Ya estás inscrito en esta actividad." });
          }

          // Añadir el usuario a la tabla de participantes
          const sqlAddParticipant = `INSERT INTO participate (activity_id, user_id) VALUES (?, ?)`;
          connection.query(sqlAddParticipant, [activity_id, user_id], (err) => {
            if (err) {
              console.error("Error al unirse a la actividad:", err);
              return res
                .status(500)
                .json({ error: "Error al unirse a la actividad." });
            }

            // Actualizar el número de asistentes en la tabla de actividades
            const sqlUpdateAssistants = `UPDATE activity SET num_assistants = num_assistants + 1 WHERE activity_id = ?`;
            connection.query(sqlUpdateAssistants, [activity_id], (err) => {
              if (err) {
                console.error("Error al actualizar la actividad:", err);
                return res
                  .status(500)
                  .json({ error: "Error al actualizar la actividad." });
              }

              res.status(200).json({ message: "Te has unido a la actividad." });
            });
          });
        }
      );
    });
  };

  leaveActivity = (req, res) => {
    const { activity_id } = req.body;

    if (!activity_id) {
      return res.status(400).json({ error: "Activity ID is required." });
    }

    // Obtener el user_id del token
    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.decode(token);
    let user_id = decoded.id;

    // Comprobar si el usuario está inscrito en la actividad
    const sqlCheckParticipation = `SELECT * FROM participate WHERE activity_id = ? AND user_id = ?`;
    connection.query(
      sqlCheckParticipation,
      [activity_id, user_id],
      (err, results) => {
        if (err) {
          console.error("Error al verificar la participación:", err);
          return res
            .status(500)
            .json({ error: "Error al verificar la participación." });
        }

        if (results.length === 0) {
          return res
            .status(400)
            .json({ error: "No estás inscrito en esta actividad." });
        }

        // Eliminar el usuario de la tabla de participantes
        const sqlRemoveParticipant = `DELETE FROM participate WHERE activity_id = ? AND user_id = ?`;
        connection.query(
          sqlRemoveParticipant,
          [activity_id, user_id],
          (err) => {
            if (err) {
              console.error("Error al abandonar la actividad:", err);
              return res
                .status(500)
                .json({ error: "Error al abandonar la actividad." });
            }

            // Actualizar el número de asistentes en la tabla de actividades
            const sqlUpdateAssistants = `UPDATE activity SET num_assistants = num_assistants - 1 WHERE activity_id = ?`;
            connection.query(sqlUpdateAssistants, [activity_id], (err) => {
              if (err) {
                console.error("Error al actualizar la actividad:", err);
                return res
                  .status(500)
                  .json({ error: "Error al actualizar la actividad." });
              }

              res.status(200).json({ message: "Has abandonado la actividad." });
            });
          }
        );
      }
    );
  };

  getAllActivities = (req, res) => {
    // Obtener el user_id del token
    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.decode(token);
    let user_id = decoded.id;

    const sql = `
      SELECT a.activity_id, a.date_time_activity, a.limit_users, a.title, a.activity_city, 
             a.activity_address, a.details, a.maps_link, a.num_assistants, s.sport_name, s.sport_img,
             CASE
               WHEN a.date_time_activity >= NOW() THEN 0
               ELSE 1
             END AS is_past,
             CASE
               WHEN p.user_id IS NOT NULL THEN 1
               ELSE 0
             END AS is_user_participant,
             CASE
               WHEN a.user_id = ? THEN 1
               ELSE 0
             END AS is_creator
      FROM activity a
      JOIN sport s ON a.sport_id = s.sport_id
      LEFT JOIN participate p ON a.activity_id = p.activity_id AND p.user_id = ?
      WHERE a.is_deleted = 0
      ORDER BY is_past ASC, a.date_time_activity ASC`;

    connection.query(sql, [user_id, user_id], (error, results) => {
      if (error) {
        console.error("Error al obtener las actividades:", error);
        return res
          .status(500)
          .json({ error: "Error al obtener las actividades" });
      }
      res.status(200).json(results);
    });
  };

  getOneActivity = (req, res) => {
    const { activity_id } = req.params;

    // Obtener el user_id del token
    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.decode(token);
    let user_id = decoded.id;

    const sqlGetActivity = `
      SELECT a.*, s.sport_name, s.sport_img,
             CASE
               WHEN p.user_id IS NOT NULL THEN 1
               ELSE 0
             END AS is_user_participant,
             CASE
               WHEN a.user_id = ? THEN 1
               ELSE 0
             END AS is_creator
      FROM activity a
      JOIN sport s ON a.sport_id = s.sport_id
      LEFT JOIN participate p ON a.activity_id = p.activity_id AND p.user_id = ?
      WHERE a.activity_id = ? AND a.is_deleted = 0`;

    connection.query(
      sqlGetActivity,
      [user_id, user_id, activity_id],
      (err, result) => {
        if (err) {
          console.error("Error al obtener la actividad:", err);
          return res
            .status(500)
            .json({ error: "Error al obtener la actividad." });
        }

        if (result.length > 0) {
          res.json(result[0]);
        } else {
          res
            .status(404)
            .json({ message: "Actividad no encontrada o ha sido eliminada" });
        }
      }
    );
  };

  // obtener los datos de una actividad para su edición
  getEditActivity = (req, res) => {
    const { activity_id } = req.params;
    const sql =
      "SELECT * FROM activity WHERE activity_id = ? AND is_deleted = 0";

    connection.query(sql, [activity_id], (err, results) => {
      if (err) {
        console.error("Error al obtener la actividad:", err);
        return res.status(500).json({ error: "Error al obtener la actividad" });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "Actividad no encontrada o ha sido eliminada" });
      }
      res.json(results[0]);
    });
  };

  // editar la actividad en db
  editActivity = (req, res) => {
    const { activity_id } = req.params;
    const {
      date_time_activity,
      limit_users,
      title,
      activity_city,
      activity_address,
      details,
      maps_link,
    } = req.body;

    const sql = `
      UPDATE activity 
      SET date_time_activity = ?, limit_users = ?, title = ?, activity_city = ?, activity_address = ?, details = ?, maps_link = ?
      WHERE activity_id = ?`;

    const values = [
      date_time_activity,
      limit_users,
      title,
      activity_city,
      activity_address,
      details,
      maps_link,
      activity_id,
    ];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar la actividad:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar la actividad" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Actividad no encontrada" });
      }
      res.json({
        message: `Actividad con activity_id: ${activity_id} actualizada con éxito`,
      });
    });
  };

  deleteActivity = (req, res) => {
    const { activity_id } = req.params;
    const sql =
      "UPDATE activity SET is_deleted = 1 WHERE activity_id = ? AND is_deleted = 0"; // Solo marcar como eliminada si no ha sido eliminada previamente

    connection.query(sql, [activity_id], (err, result) => {
      if (err) {
        console.error("Error al borrar (lógicamente) la actividad:", err);
        return res
          .status(500)
          .json({ error: "Error al borrar (lógicamente) la actividad" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Actividad no encontrada o ya eliminada" }); // Mensaje más claro
      }
      res.json({
        message: `Actividad con activity_id: ${activity_id} marcada como eliminada`,
      });
    });
  };
}

module.exports = new ActivityController();
