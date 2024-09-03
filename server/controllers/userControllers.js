const connection = require("../config/db");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const sendMail = require("../services/emailValidator");
const recuperarPassword = require("../services/recuperarPass");
require("dotenv").config();

class userController {
  createUser = (req, res) => {
    let user = JSON.parse(req.body.userRegister);
    let sports = req.body.sports.split(",").map(Number);
    const {
      user_name,
      last_name,
      birth_date,
      gender,
      user_city,
      email,
      password,
      sport_id,
      description,
    } = user;

    function capsLastName(name) {
      return name.split(' ')
                 .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                 .join(' ');
  }

    const caps_last_name = capsLastName(last_name)

    const caps_user_name =
      user_name.charAt(0).toUpperCase() + user_name.slice(1);

    let saltRounds = 8;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        let userId = null;
        if (req.file) {
          let data = [
            caps_user_name,
            caps_last_name,
            birth_date,
            gender,
            user_city,
            email,
            hash,
            description,
            req.body.last_log_date,
            req.file.filename,
          ];
          let sql = `INSERT INTO user (user_name, last_name,birth_date, gender, user_city, email, password, description, last_log_date, user_img)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          connection.query(sql, data, (errIns, result) => {
            if (errIns) {
              res.status(500).json(errIns);
            } else {
              userId = result.insertId;
              let values = sports.map((sportId) => [sportId, userId]);
              let practiceSql =
                "INSERT INTO practice (sport_id, user_id) VALUES ?";
              connection.query(practiceSql, [values], (errPrac, resPrac) => {
                if (errPrac) {
                  res.status(500).json(errPrac);
                } else {
                  const token = jwt.sign(
                    { id: email },
                    process.env.SECRET_KEY,
                    { expiresIn: "14d" }
                  );
                  sendMail(email, user_name, token);
                  res.status(201).json(resPrac);
                }
              });
            }
          });
        } else {
          let data2 = [
            caps_user_name,
            caps_last_name,
            birth_date,
            gender,
            user_city,
            email,
            hash,
            description,
            req.body.last_log_date,
          ];
          let sql2 = `INSERT INTO user (user_name, last_name,birth_date, gender, user_city, email, password,description, last_log_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          connection.query(sql2, data2, (errIns2, result2) => {
            if (errIns2) {
              res.status(500).json(errIns2);
            } else {
              userId = result2.insertId;
              let values = sports.map((sportId) => [sportId, userId]);
              let practiceSql =
                "INSERT INTO practice (sport_id, user_id) VALUES ?";
              connection.query(practiceSql, [values], (errPrac2, resPrac2) => {
                if (errPrac2) {
                  res.status(500).json(errPrac2);
                } else {
                  const token = jwt.sign(
                    { id: email },
                    process.env.SECRET_KEY,
                    { expiresIn: "14d" }
                  );
                  sendMail(email, user_name, token);
                  res.status(201).json(resPrac2);
                }
              });
            }
          });
        }
      }
    });
  };

  validationUser = (req, res) => {
    try {
      const token = req.params.token;
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      let sql = `UPDATE user SET is_validated = 1 WHERE email = "${decoded.id}"`;
      connection.query(sql, (err, dbres) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json({ message: "Token validado", data: decoded });
        }
      });
    } catch (err) {
      console.error("Error al verificar el token:", err.message);
      res.status(400).json({ message: "Token inválido" });
    }
  };

  login = (req, res) => {
    const { email, password } = req.body;
    let sql = `SELECT * FROM user WHERE email="${email}" AND is_validated = 1 AND is_disabled = 0`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(401).json("Credenciales incorrectas");
      } else {
        if (!result || result.length === 0) {
          res.status(401).json("Credenciales incorrectas");
        } else {
          const hash = result[0].password;
          bcrypt.compare(password, hash, (err2, response) => {
            if (err2) {
              res.status(500).json(err2);
            } else {
              if (response) {
                const token = jwt.sign(
                  { id: result[0].user_id },
                  process.env.SECRET_KEY,
                  { expiresIn: "1d" }
                );
                res.status(200).json(token);
              } else {
                res.status(401).json("Credenciales incorrectas");
              }
            }
          });
        }
      }
    });
  };

  profile = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `SELECT * FROM user WHERE user_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result[0]);
      }
    });
  };

  getPracticeSports = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `SELECT sport.sport_name, sport.sport_id FROM sport JOIN practice ON sport.sport_id = practice.sport_id WHERE practice.user_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  editUser = (req, res) => {
    const {
      user_id,
      user_name,
      last_name,
      birth_date,
      gender,
      user_city,
      description,
      sports,
    } = JSON.parse(req.body.editUser);

    let data = [
      user_name,
      last_name,
      birth_date,
      gender,
      user_city,
      description,
    ];

    let sqlEditUser = `UPDATE user SET user_name = ?, last_name = ?, birth_date = ?, gender = ?, user_city = ?, description = ? WHERE user_id = ${user_id}`;
    if (req.file != undefined) {
      sqlEditUser = `UPDATE user SET user_name = ?, last_name = ?, birth_date = ?, gender = ?, user_city = ?, description = ?, user_img= ? WHERE user_id = ${user_id}`;
      data = [
        user_name,
        last_name,
        birth_date,
        gender,
        user_city,
        description,
        req.file.filename,
      ];
    }

    connection.query(sqlEditUser, data, (errEditUser, resultEditUser) => {
      if (errEditUser) {
        res.status(500).json(errEditUser);
      } else {
        let sqlDBSports = "SELECT sport_id FROM practice WHERE user_id = ?";
        connection.query(sqlDBSports, [user_id], (err, results) => {
          if (err) {
            res.status(500).json(err);
          } else {
            const currentSportIds = results.map((e) => e.sport_id);
            let sqlDelSports =
              "DELETE FROM practice WHERE user_id = ? AND sport_id IN (?)";
            connection.query(
              sqlDelSports,
              [user_id, currentSportIds],
              (errDel, resultDel) => {
                if (err) {
                  res.status(500).json(errDel);
                } else {
                  const values = sports.map((id) => [user_id, id]);
                  let sqlAddSports =
                    "INSERT INTO practice (user_id, sport_id) VALUES ?";
                  connection.query(sqlAddSports, [values], (errAdd, resAdd) => {
                    if (errAdd) {
                      res.status(500).json(errAdd);
                    } else {
                      if (req.file) {
                        res.status(201).json({ img: req.file.filename });
                      } else {
                        res.status(201).json({ img: null });
                      }
                    }
                  });
                }
              }
            );
          }
        });
      }
    });
  };

  getUserActivities = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);

    let sql = `
      SELECT 
        a.*, 
        s.sport_name, 
        s.sport_img,
        CASE 
          WHEN p.user_id IS NOT NULL THEN 1 
          ELSE 0 
        END AS is_user_participant,
        CASE 
          WHEN a.user_id = ${id} THEN 1 
          ELSE 0 
        END AS is_creator
      FROM 
        activity a
      JOIN 
        sport s ON a.sport_id = s.sport_id
      LEFT JOIN 
        participate p ON a.activity_id = p.activity_id AND p.user_id = ${id}
      WHERE 
        a.user_id = ${id} 
        AND a.is_deleted = 0  -- Filtra actividades no eliminadas
      ORDER BY 
        a.date_time_activity DESC;
    `;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  emailValidation = (req, res) => {
    const { email } = req.body;
    let sql = `SELECT * FROM user WHERE email = "${email}"`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  getAllUsers = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `
    SELECT user.*, GROUP_CONCAT(sport.sport_name ORDER BY sport.sport_name SEPARATOR ', ') AS sports, TIMESTAMPDIFF(YEAR, user.birth_date, CURDATE()) AS age 
    FROM user JOIN practice ON user.user_id = practice.user_id 
    JOIN sport ON practice.sport_id = sport.sport_id 
    WHERE is_validated = 1 
    AND user.is_disabled = 0 
    AND	user.type = 2 
    AND user.user_id != ${id} 
    GROUP BY user.user_id 
    ORDER BY user.user_name
    `;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.status(200).json(result);
      }
    });
  };

  allMessages = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `SELECT 
    u.user_id, 
    u.user_name, 
    u.last_name, 
    u.user_img, 
    MAX(m.date_time) AS last_message_date,
    (
        SELECT 
            m2.opened 
        FROM 
            message m2 
        WHERE 
            m2.sender_user_id = ${id} 
            AND m2.receiver_user_id = u.user_id
        ORDER BY 
            m2.date_time DESC 
        LIMIT 1
    ) AS opened_sent,
    (
        SELECT 
            m3.opened 
        FROM 
            message m3 
        WHERE 
            m3.sender_user_id = u.user_id 
            AND m3.receiver_user_id = ${id}
        ORDER BY 
            m3.date_time DESC 
        LIMIT 1
    ) AS opened_received,
    (
        SELECT 
            m4.text 
        FROM 
            message m4 
        WHERE 
            (m4.sender_user_id = ${id} AND m4.receiver_user_id = u.user_id)
            OR (m4.sender_user_id = u.user_id AND m4.receiver_user_id = ${id})
        ORDER BY 
            m4.date_time DESC 
        LIMIT 1
    ) AS last_message_text
    FROM 
        user u
    JOIN 
        message m ON m.sender_user_id = u.user_id OR m.receiver_user_id = u.user_id
    WHERE 
        (m.sender_user_id = ${id} OR m.receiver_user_id = ${id}) 
        AND u.user_id != ${id}
    GROUP BY 
        u.user_id, 
        u.user_name, 
        u.last_name, 
        u.user_img 
    ORDER BY
    last_message_date DESC;`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  viewOneChat = (req, res) => {
    const { user_sender_id: sender, user_receiver_id: receiver } = req.body;
    const sql = `
    (SELECT 
    m.message_id, 
    m.text, 
    m.date_time, 
    m.opened, 
    sender.user_id AS sender_user_id, 
    sender.user_name AS sender_user_name, 
    sender.last_name AS sender_user_last_name, 
    sender.user_img AS sender_user_img, 
    receiver.user_img AS receiver_user_img, 
    sender.last_log_date AS sender_user_last_log_date, 
    sender.type AS sender_user_type, 
    'sent' AS message_type 
    FROM 
        message m
    JOIN 
        user sender ON m.sender_user_id = sender.user_id 
    JOIN 
        user receiver ON m.receiver_user_id = receiver.user_id 
    WHERE 
        m.sender_user_id = ? 
        AND m.receiver_user_id = ?)

    UNION ALL

    (SELECT 
        m.message_id, 
        m.text, 
        m.date_time, 
        m.opened, 
        sender.user_id AS sender_user_id, 
        sender.user_name AS sender_user_name, 
        sender.last_name AS sender_user_last_name, 
        sender.user_img AS sender_user_img, 
        receiver.user_img AS receiver_user_img, 
        sender.last_log_date AS sender_user_last_log_date, 
        sender.type AS sender_user_type, 
        'received' AS message_type 
    FROM 
        message m
    JOIN 
        user sender ON m.sender_user_id = sender.user_id 
    JOIN 
        user receiver ON m.receiver_user_id = receiver.user_id 
    WHERE 
        m.sender_user_id = ? 
        AND m.receiver_user_id = ?)

    ORDER BY date_time;
    `;

    connection.query(
      sql,
      [receiver, sender, sender, receiver],
      (err, result) => {
        if (err) {
          console.error("Error en la consulta SQL:", err);
          res.status(500).json(err);
        } else {
          res.status(200).json(result);
        }
      }
    );
  };

  sendMessage = (req, res) => {
    const { message, date, receiver, userID } = req.body;
    let sql = `INSERT INTO message (text,date_time,sender_user_id,receiver_user_id) VALUES (?,?,?,?)`;
    let data = [message, date, userID, receiver];
    if(message.length <= 255){
      connection.query(sql, data, (err, result) => {
        if (err) {
          res.status(500).json({
            error: "Ocurrió un error en la consulta SQL.",
            details: err.message,
          });
        } else {
          res.status(200).json(result);
        }
      });
    }
  };
  getUserParticipatedActivities = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);

    let sql = `
      SELECT 
        activity.*, 
        sport.sport_name, 
        sport.sport_img,
        CASE 
          WHEN participate.user_id IS NOT NULL THEN 1 
          ELSE 0 
        END AS is_user_participant,
        CASE 
          WHEN activity.user_id = ? THEN 1 
          ELSE 0 
        END AS is_creator
      FROM 
        activity 
      JOIN 
        participate ON activity.activity_id = participate.activity_id 
      JOIN 
        sport ON activity.sport_id = sport.sport_id 
      LEFT JOIN 
        participate AS user_participation 
        ON activity.activity_id = user_participation.activity_id 
        AND user_participation.user_id = ?
      WHERE 
        participate.user_id = ? 
        AND activity.is_deleted = 0 
      ORDER BY 
        activity.date_time_activity ASC`;

    connection.query(sql, [id, id, id], (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  recoverPassword = (req, res) => {
    const email = req.body.id;
    try {
      const recoverToken = jwt.sign({ id: email }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      recuperarPassword(email, recoverToken);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  editPassword = (req, res) => {
    const { password, validationToken } = req.body;
    const decoded = jwt.verify(validationToken, process.env.SECRET_KEY);
    let saltRounds = 8;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        res.status(500).json(err);
      } else {
        let sql = `UPDATE user SET password = ? WHERE email = ?`;
        connection.query(sql, [hash, decoded.id], (err, result) => {
          if (err) {
            res.status(500).json(err);
          } else {
            res.status(200).json(result);
          }
        });
      }
    });
  };

  getOneUser = (req, res) => {
    const id = req.params.id;
    let sql = `SELECT user.*, GROUP_CONCAT(sport.sport_name ORDER BY sport.sport_name SEPARATOR ', ') AS sports, TIMESTAMPDIFF(YEAR, user.birth_date, CURDATE()) AS age 
    FROM user JOIN practice ON user.user_id = practice.user_id 
    JOIN sport ON practice.sport_id = sport.sport_id 
    WHERE user.is_validated = 1 
    AND user.is_disabled = 0 
    AND user.type = 2 
    AND user.user_id = ${id};`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  updateLastLog = (req, res) => {
    const { data } = req.body;
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `UPDATE user SET last_log_date = "${data}" WHERE user_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  getOneUserActivities = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.decode(token);
    let user_id = decoded.id;
    const id = req.params.id;

    let sql = `
      SELECT 
        activity.*, 
        sport.sport_name, 
        sport.sport_img 
      FROM 
        activity 
      JOIN 
        sport 
      ON 
        activity.sport_id = sport.sport_id 
      WHERE 
        activity.user_id = ${id}
    `;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  getOneUserParticipatedActivities = (req, res) => {
    let id = req.params.id;
    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.decode(token);
    let user_id = decoded.id;

    let sql = `
        SELECT 
            a.*, 
            s.sport_name, 
            s.sport_img, 
            CASE 
                WHEN p2.user_id IS NOT NULL THEN 1 
                ELSE 0 
            END AS is_user_participant, -- Verifica si el usuario autenticado participa en la actividad
            CASE 
                WHEN a.user_id = ${user_id} THEN 1 
                ELSE 0 
            END AS is_creator -- Verifica si el usuario autenticado es el creador
        FROM 
            activity a
        JOIN 
            sport s ON a.sport_id = s.sport_id
        LEFT JOIN 
            participate p2 ON a.activity_id = p2.activity_id AND p2.user_id = ${user_id} -- Verifica participación del usuario autenticado
        WHERE 
            a.activity_id IN (
                SELECT p.activity_id FROM participate p WHERE p.user_id = ${id}
            ) -- Filtra actividades en las que el usuario específico ha participado
            AND a.is_deleted = 0 
        ORDER BY 
            a.date_time_activity DESC;
    `;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  read = (req, res) => {
    const { user_sender_id: sender_user_id } = req.body;
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `UPDATE message SET opened = 1 WHERE sender_user_id = ${sender_user_id} AND receiver_user_id = ${id} AND opened = 0`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
}

module.exports = new userController();
