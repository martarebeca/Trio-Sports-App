CREATE DATABASE trioSports;
USE trioSports;

-- DROP DATABASE trioSports;

CREATE TABLE user (
	user_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    gender VARCHAR(50),  
    user_img VARCHAR(200),
    user_city VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    last_log_date DATETIME NOT NULL,
    is_validated BOOLEAN NOT NULL default 0,
    is_disabled BOOLEAN NOT NULL default 0,
    type TINYINT NOT NULL default 2 -- 1 - admin | 2 - user
);

CREATE TABLE message (
    message_id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    text TINYTEXT NOT NULL,
    date_time DATETIME NOT NULL DEFAULT current_timestamp,
    sender_user_id INT UNSIGNED NOT NULL,
    receiver_user_id INT UNSIGNED NOT NULL,
    opened BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_sender_user FOREIGN KEY (sender_user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_receiver_user FOREIGN KEY (receiver_user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE sport (
	sport_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    sport_name VARCHAR(50) NOT NULL UNIQUE,
    sport_img VARCHAR(255) NOT NULL DEFAULT 'newsport.jpg',
    is_disabled BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE practice (
	sport_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
	PRIMARY KEY (sport_id,user_id),
    CONSTRAINT fk_practice_sport FOREIGN KEY (sport_id) REFERENCES sport (sport_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_practice_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE activity (
	activity_id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date_time_activity DATETIME NOT NULL,
    limit_users INT,
    title VARCHAR(255) NOT NULL,
    activity_city VARCHAR(50) NOT NULL,
    activity_address VARCHAR(250) NOT NULL,
    details TINYTEXT,
    num_assistants INT DEFAULT 0,
    user_id INT UNSIGNED NOT NULL,
    sport_id INT UNSIGNED NOT NULL,
    maps_link VARCHAR(350),
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
	CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_activity_sport FOREIGN KEY (sport_id) REFERENCES sport (sport_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE participate (
	activity_id BIGINT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    date_time_participate DATETIME NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (user_id,activity_id),
    CONSTRAINT fk_participate_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_participate_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE comment (
	activity_id BIGINT UNSIGNED NOT NULL,
	comment_id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_id INT UNSIGNED NOT NULL,
    text TINYTEXT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id,activity_id),
    CONSTRAINT fk_comment_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inserciones de deportes que el CLIENTE quiere que aparezcan en la aplicación
INSERT INTO sport (sport_name, sport_img)
VALUES ('Fútbol', 'futbol.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Baloncesto', 'baloncesto.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Voleibol', 'voleibol.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Rugby', 'rugby.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Balonmano', 'balonmano.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Fútbol sala', 'futbol-sala.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Pádel', 'padel.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Natación', 'natacion.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Tenis', 'tenis.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Running', 'running.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Squash', 'squash.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Deportes de combate', 'deportes-de-combate.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Triatlon', 'triatlon.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Golf', 'golf.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Esquí', 'esqui.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Snowboarding', 'snowboarding.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Skateboarding', 'skateboarding.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Escalada deportiva', 'escalada-deportiva.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Karting', 'karting.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Buceo', 'buceo.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Kitesurf', 'kitesurf.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Windsurf', 'windsurf.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Piragüismo', 'piraguismo.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Senderismo/montañismo', 'senderismo-montanismo.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Trail running', 'trail-running.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Crossfit', 'crossfit.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Yoga', 'yoga.jpg');

INSERT INTO sport (sport_name, sport_img)
VALUES ('Pilates', 'pilates.jpg');

SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

-- Admin123!
 INSERT INTO user (user_name, last_name, user_city, email, password, last_log_date, is_validated, is_disabled, type)
 VALUES ('Admin', 'Admin', 'Admin', 'admin@admin.com', '$2a$08$XXitHE5Yr0jSLaq8x19Cru0FrfskPAxz0NgyZH.JuSaYYVB0PObWe', '2024-08-13 12:00:00', 1, 0, 1);


-- Password123!

-- INSERT INTO user (user_name, last_name, birth_date, gender, user_img, user_city, email, password, description, last_log_date, is_validated, is_disabled, type)
-- VALUES ('Juan', 'Pérez', '1990-05-15', 'Hombre', 'juan_perez.jpg', 'Madrid', 'juan.perez@example.com', '$2a$08$3ooLVGALeP5oKD82r1Lv5O2iLcgJ7WDGdqIhzeeL613GfYGE82l.a', 'Amante de la tecnología y la programación.', '2024-08-13 12:00:00', 1, 0, 2);

-- INSERT INTO user (user_name, last_name, birth_date, gender, user_img, user_city, email, password, description, last_log_date, is_validated, is_disabled, type)
-- VALUES ('María', 'López', '1985-10-20', 'Mujer', 'maria_lopez.jpg', 'Barcelona', 'maria.lopez@example.com', '$2a$08$eUTpcM0LnLFErQkZpGmkSuEuGAwZi9v1/ZsZnUAtp3O1Uv05/EcPG', 'Diseñadora gráfica apasionada por el arte.', '2024-08-13 12:30:00', 1, 0, 2);

-- INSERT INTO user (user_name, last_name, birth_date, gender, user_img, user_city, email, password, description, last_log_date, is_validated, is_disabled, type)
-- VALUES ('Carlos', 'González', '1978-03-12', 'Hombre', 'carlos_gonzalez.jpg', 'Valencia', 'carlos.gonzalez@example.com', '$2a$08$qkASpNSM60g5BCCkDDIyx.y0FPhQ0AYzKYNdgMBO2bH30w3C/VgBK', 'Ingeniero en sistemas, apasionado por la música.', '2024-08-13 13:00:00', 1, 0, 2);

-- INSERT INTO user (user_name, last_name, birth_date, gender, user_img, user_city, email, password, description, last_log_date, is_validated, is_disabled, type)
-- VALUES ('Ana', 'Martínez', '1995-07-30', 'Mujer', 'ana_martinez.jpg', 'Sevilla', 'ana.martinez@example.com', '$2a$08$tMTKbFtEY6W7awzgYBBTtONFuSB4U5sD3LzDwSsH63jflKg15v0y.', 'Administradora de empresas con interés en el marketing.', '2024-08-13 13:30:00', 1, 0, 2);
    
 
-- MENSAJES
    
-- INSERT INTO message (text, date_time, sender_user_id, receiver_user_id, opened)
-- VALUES ('¿Te apuntas a la carrera de 10K el próximo domingo?', '2024-08-13 09:15:00', 1, 2, FALSE);

-- INSERT INTO message (text, date_time, sender_user_id, receiver_user_id, opened)
-- VALUES ('¡Claro! He estado entrenando duro. ¿Cómo va tu preparación?', '2024-08-13 09:30:00', 2, 1, TRUE);

-- INSERT INTO message (text, date_time, sender_user_id, receiver_user_id, opened)
-- VALUES ('Bastante bien, ayer hice 50 km en bicicleta. ¿Y tú?', '2024-08-12 17:45:00', 3, 4, FALSE);

-- INSERT INTO message (text, date_time, sender_user_id, receiver_user_id, opened)
-- VALUES ('Yo estuve en el gimnasio, levantando pesas. Luego jugué un partido de tenis.', '2024-08-13 08:00:00', 4, 3, TRUE);
    

-- Practice

-- INSERT INTO practice (sport_id, user_id)
-- VALUES (1, 1);

-- INSERT INTO practice (sport_id, user_id)
-- VALUES (2, 1);

-- INSERT INTO practice (sport_id, user_id)
-- VALUES (2, 2);

-- INSERT INTO practice (sport_id, user_id)
-- VALUES (3, 2);

-- INSERT INTO practice (sport_id, user_id)
-- VALUES (3, 3);

-- INSERT INTO practice (sport_id, user_id)
-- VALUES (4, 3);

-- INSERT INTO practice (sport_id, user_id)
-- VALUES (4, 4);

-- INSERT INTO practice (sport_id, user_id)
-- VALUES (1, 4);

-- Activity

-- INSERT INTO activity (date_time_activity, limit_users, title, activity_city, activity_address, details, num_assistants, user_id, sport_id, maps_link)
-- VALUES ('2024-09-07 09:00:00', 2, 'Partido amistoso de tenis en la cancha', 'Barcelona', 'Barcelona', 'Participa en un amistoso torneo de tenis. No olvides tu raqueta y pelotas.', 2, 2, 3, -- 'https://maps.example.com/abc');

-- INSERT INTO activity (date_time_activity, limit_users, title, activity_city, activity_address, details, num_assistants, user_id, sport_id, maps_link)
-- VALUES ('2024-09-07 07:00:00', 2, 'Ruta en bicicleta por la montaña', 'Valencia', 'Valencia', 'Acompáñanos en una ruta en bicicleta por los senderos de montaña. Lleva tu bicicleta en -- buen estado y equipo de protección.', 1, 3, 2, 'https://maps.example.com/def');

-- INSERT INTO activity (date_time_activity, limit_users, title, activity_city, activity_address, details, num_assistants, user_id, sport_id, maps_link)
-- VALUES ('2024-09-19 10:00:00', 10, 'Competencia de atletismo en el estadio', 'Sevilla', 'Sevilla', 'Participa en una competencia de atletismo en el estadio local. Prepárate para las pruebas de velocidad y resistencia.', 1, 4, 4, 'https://maps.example.com/ghi');

-- INSERT INTO activity (date_time_activity, limit_users, title, activity_city, activity_address, details, num_assistants, user_id, sport_id, maps_link)
-- VALUES ('2024-08-19 10:00:00', 10, 'Partido de fútbol amistoso en el campo de deportes', 'Madrid', 'Madrid', 'Únete a un divertido partido de fútbol en el campo de deportes. Asegúrate de llevar tu equipo y estar listo para jugar.', 1, 1, 1, 'https://maps.example.com/jkl');


-- Participate

-- INSERT INTO participate (activity_id, user_id, date_time_participate)
-- VALUES (1, 2, '2024-08-16 08:45:00');

-- INSERT INTO participate (activity_id, user_id, date_time_participate)
-- VALUES (1, 3, '2024-08-17 06:50:00');

-- INSERT INTO participate (activity_id, user_id, date_time_participate)
-- VALUES (2, 2, '2024-08-17 06:50:00');

-- INSERT INTO participate (activity_id, user_id, date_time_participate)
-- VALUES (3, 4, '2024-08-19 09:30:00');

-- INSERT INTO participate (activity_id, user_id, date_time_participate)
-- VALUES (4, 1, '2024-08-19 09:00:00');

-- comment

-- INSERT INTO comment (activity_id, comment_id, user_id, text)
-- VALUES (1, 1, 2, '¡Fue un partido de tenis genial! La cancha estaba en excelentes condiciones y el ambiente muy competitivo.');

-- INSERT INTO comment (activity_id, comment_id, user_id, text)
-- VALUES (2, 1, 3, 'La ruta en bicicleta fue increíble. Los senderos eran impresionantes, y el paisaje espectacular.');

-- INSERT INTO comment (activity_id, comment_id, user_id, text)
-- VALUES (3, 1, 4, 'La competencia de atletismo estuvo muy bien organizada. Las pruebas fueron emocionantes y el ambiente muy motivador.');

-- INSERT INTO comment (activity_id, comment_id, user_id, text)
-- VALUES (4, 1, 1, 'El partido de fútbol fue muy divertido. Todos jugamos bien y la coordinación del equipo fue excelente.');

