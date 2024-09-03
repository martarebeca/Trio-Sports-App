import { useEffect, useContext, useState } from "react";
import { TrioContext } from "../../context/TrioContextProvider";
import axios from "axios";
import "./chats.css";
import { format } from "date-fns";
import { Button, Col, Container, Row } from "react-bootstrap";

export const Chats = () => {
  const { user, setUser, setToken, token } = useContext(TrioContext);
  const [received, setReceived] = useState([]);
  const [viewMessages, setViewMessages] = useState();
  const [currentMessage, setCurrentMessage] = useState();

  const [currentSend, setCurrentSend] = useState(); //EL USUARIO AL QUE MANDAR LOS MENSAJES
  const currentDate = format(new Date(), `yyyy-MM-dd HH-mm-ss`);

  useEffect(() => {
    if (token) {
      axios
        .put(
          "http://localhost:4000/api/users/updateLastLog",
          { data: currentDate },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:4000/api/users/allMessages", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setReceived(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [token]);

  const refreshChat = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/users/allMessages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReceived(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const readed = async (senderUserID) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/users/read`,
        { user_sender_id: senderUserID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const viewOneChat = async (senderUserID, userID) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/users/viewOneChat`,
        { user_sender_id: senderUserID, user_receiver_id: userID }
      );
      setViewMessages(res.data);
      setCurrentSend(senderUserID);
      await readed(senderUserID);
      refreshChat();
    } catch (err) {
      console.log(err);
    }
  };
  const today = format(new Date(), "yyyy-MM-dd HH-mm-ss");
  const actualDate = format(new Date(), "yyyy-MM-dd");
  const handleSend = (e) => {
    const { value } = e.target;
    setCurrentMessage(value);
  };

  const sendMessage = async (texto, time, userReceiver, user) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/sendMessage",
        { message: texto, date: time, receiver: userReceiver, userID: user }
      );
      viewOneChat(currentSend, user);
      setCurrentMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container fluid="xxl" className="chats-body">
      <div className="messages">
        <div className="lateral-mensajes">
          {received?.map((e, idx) => {
            const dateOnly = e.last_message_date.split(" ")[0];
            const hourOnly = e.last_message_date.split(" ")[1];
            const isToday = dateOnly === actualDate;
            return (
              
                <div
                  key={idx}
                  className="one-message"
                  onClick={() => viewOneChat(e.user_id, user.user_id)}
                >
                  <Row>
                    <Col md="3" className="sender-img">
                      <img
                        src={`http://localhost:4000/images/users/${e?.user_img}`}
                      />
                    </Col>
                    <Col md="9" className="body-message">
                      <div className="name-message">
                        <span>
                          {e.user_name} {e.last_name}
                        </span>{" "}
                        <span>{isToday ? hourOnly : dateOnly}</span>
                      </div>
                      <div className="prev-message">{e.last_message_text}</div>
                      <div className="datos">
                        {e.opened_received == "0" ? (
                          <span>Nuevo Mensaje</span>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </div>
              
            );
          })}
        </div>
        <div className="cuerpo-mensajes">
          {viewMessages?.map((e, idx) => {
            return (
              <div
                className={
                  e.message_type === "sent" ? "chat-box dch" : " chat-box"
                }
                key={idx}
              >
                {e.message_type === "sent" ? null : (
                  <img
                    src={`http://localhost:4000/images/users/${e?.sender_user_img
                    }`}
                    alt=""
                  />
                )}
                <span>{e.text}</span>
                {e.message_type === "sent" ? (
                  <img
                    src={`http://localhost:4000/images/users/${e?.sender_user_img}`}
                    alt=""
                  />
                ) : null}
              </div>
            );
          })}
        </div>
        <textarea
          id="message"
          name="message"
          placeholder="Escribe aquí..."
          className="chat"
          onChange={handleSend}
          value={currentMessage}
          maxLength="255"
        ></textarea>
        <button
          onClick={
            currentSend && currentMessage
              ? () =>
                  sendMessage(currentMessage, today, currentSend, user.user_id)
              : null
          }
          type="button"
          className="trio-btn"
        >
          ENVIAR
        </button>
      </div>
    </Container>
  );
};
