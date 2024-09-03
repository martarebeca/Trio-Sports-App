import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Table, Image } from "react-bootstrap";
import axios from "axios";
import { BsTrophy, BsMap, BsClock, BsCalendar3 } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { parseISO, isBefore } from "date-fns";
import { TrioContext } from "../../context/TrioContextProvider";
import "../Activity/activityStyle.css";
import ModalCreateComment from "../../components/ModalCreateComment/ModalCreateComment";

export const Activity = () => {
  const { token, user } = useContext(TrioContext);
  const { activity_id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fallbackImage = "/src/assets/images/default_user_img.png";

  useEffect(() => {
    if (token) {
      const fetchActivity = async () => {
        try {
          const activityResponse = await axios.get(
            `http://localhost:4000/api/activity/getOneActivity/${activity_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const commentsResponse = await axios.get(
            `http://localhost:4000/api/comments/getCommentsByActivity/${activity_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setActivity(activityResponse.data);
          setComments(
            commentsResponse.data.map((comment) => ({
              ...comment,
              user: {
                user_name: comment.user_name || "Usuario desconocido",
                user_img: comment.user_img || "default_user_img.png",
              },
            }))
          );
          setLoading(false);
        } catch (error) {
          setError("Error al cargar la actividad");
          setLoading(false);
        }
      };

      fetchActivity();
    }
  }, [activity_id, token]);

  const handleShowModal = (activity) => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCommentSubmit = async (commentText) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/comments/addComment",
        {
          activity_id,
          user_id: user.user_id,
          text: commentText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newComment = {
          user_name: user.user_name,
          user_img: user.user_img || "default_user_img.png",
          text: commentText,
          date: new Date(),
        };
        setComments([newComment, ...comments]);
        handleCloseModal();
      } else {
        console.error("Error al crear el comentario");
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  const isActivityFull = (activity) => {
    return (
      activity.limit_users !== null &&
      activity.num_assistants >= activity.limit_users
    );
  };

  const isActivityPast = (activityDate) => {
    const currentDateTime = new Date();
    return isBefore(activityDate, currentDateTime);
  };

  const handleJoinActivity = async () => {
    if (
      isActivityFull(activity) ||
      isActivityPast(parseISO(activity.date_time_activity))
    ) {
      setError("No puedes unirte a una actividad completa o pasada.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:4000/api/activity/joinActivity",
        { activity_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setActivity((prev) => ({
          ...prev,
          num_assistants: prev.num_assistants + 1,
          is_user_participant: true,
        }));
      }
    } catch (error) {
      console.error("Error al unirse a la actividad:", error);
      setError("Error al unirse a la actividad. Inténtalo de nuevo.");
    }
  };

  const handleLeaveActivity = async () => {
    if (isActivityPast(parseISO(activity.date_time_activity))) {
      setError("No puedes abandonar una actividad pasada.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:4000/api/activity/leaveActivity",
        { activity_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setActivity((prev) => ({
          ...prev,
          num_assistants: prev.num_assistants - 1,
          is_user_participant: false,
        }));
      }
    } catch (error) {
      console.error("Error al abandonar la actividad:", error);
      setError("Error al abandonar la actividad. Inténtalo de nuevo.");
    }
  };

  const activityDate = activity ? parseISO(activity.date_time_activity) : null;

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const getJoinButtonText = () => {
    if (isActivityPast(activityDate)) {
      return "Finalizada";
    } else if (isActivityFull(activity) && activity.is_user_participant) {
      return `Abandonar ${activity.num_assistants} / ${activity.limit_users}`;
    } else if (isActivityFull(activity)) {
      return "Completa";
    } else if (activity.is_user_participant) {
      return "Abandonar";
    } else if (activity.limit_users) {
      return `Unirse ${activity.num_assistants}/${activity.limit_users}`;
    } else {
      return "Unirse";
    }
  };

  const getButtonClassName = () => {
    if (isActivityPast(activityDate)) {
      return "finalized-btn";
    } else if (isActivityFull(activity) && activity.is_user_participant) {
      return "complete-btn active";
    } else if (isActivityFull(activity)) {
      return "complete-btn";
    } else if (activity.is_user_participant) {
      return "abandon-btn";
    } else {
      return "trio-btn";
    }
  };

  return (
    <div className="container-xxl">
      <Col xl={8} className="mx-auto">
        <Row className="justify-content-center">
          <h2 className="activity-title">{activity.text}</h2>
        </Row>

        <Row className="align-items-center justify-content-center activity-content">
          <Col xs={12} md={6} className="activity-image-col">
            <img
              src={`/src/assets/activities/${activity.sport_img}`}
              alt={activity.sport_name}
              className="activity-image"
              onError={(e) =>
                (e.target.src = "/src/assets/activities/newsport.jpg")
              }
            />
          </Col>
          <Col xs={12} md={6} className="activity-details-wrapper">
            <Table borderless className="activity-table">
              <tbody>
                <tr className="table-separator">
                  <td>
                    <BsTrophy className="icon" />
                  </td>
                  <td className="text-large">{activity.sport_name}</td>
                </tr>
                <tr className="table-separator">
                  <td>
                    <BsMap className="icon" />
                  </td>
                  <td className="text-large">
                    {activity.activity_address}, {activity.activity_city}
                  </td>
                </tr>
                <tr className="table-separator">
                  <td>
                    <BsCalendar3 className="icon" />
                  </td>
                  <td className="text-large">
                    {new Date(activity.date_time_activity).toLocaleDateString(
                      "es-ES"
                    )}
                  </td>
                </tr>
                <tr className="table-separator">
                  <td>
                    <BsClock className="icon" />
                  </td>
                  <td className="text-large">
                    {new Date(activity.date_time_activity).toLocaleTimeString(
                      "es-ES",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                </tr>

                {activity.maps_link && (
                  <tr className="table-separator">
                    <td>
                      <MdLocationOn
                        className="icon"
                        style={{ color: "#EA4335" }}
                      />
                    </td>
                    <td className="text-large">
                      <a
                        href={activity.maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver en Google Maps
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="activity-info-box">
              <p className="activity-info-text">
                {activity.details ||
                  "No hay detalles adicionales para esta actividad."}
              </p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col xs={12} md={8} className="activity-buttons">
            <button
              type="button"
              className={`w-100 ${getButtonClassName()}`}
              disabled={
                isActivityPast(activityDate) ||
                (isActivityFull(activity) && !activity.is_user_participant)
              }
              onClick={(e) => {
                e.preventDefault();
                if (!activity.loading) {
                  if (activity.is_user_participant) {
                    handleLeaveActivity(activity.activity_id);
                  } else {
                    handleJoinActivity(activity.activity_id);
                  }
                }
              }}
            >
              {getJoinButtonText()}
            </button>

            <button
              type="button"
              className="trio-comment-btn w-100"
              onClick={(e) => {
                e.preventDefault();
                handleShowModal(activity);
              }}
            >
              Añadir comentario
            </button>
          </Col>
        </Row>

        <div className="custom-divider"></div>

        <ModalCreateComment
          show={showModal}
          handleClose={handleCloseModal}
          handleCommentSubmit={handleCommentSubmit}
        />

        <Row className="justify-content-center mt-4">
          <Col xs={12}>
            {comments.map((comment, index) => (
              <div
                key={index}
                className={`${
                  index % 2 === 0 ? "comment-box" : "comment-box-alternate"
                } mb-3 p-3`}
              >
                <div className="comment-header d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <Image
                      src={
                        comment.user_img
                          ? `http://localhost:4000/images/users/${comment.user_img}`
                          : fallbackImage
                      }
                      roundedCircle
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                    <strong>{comment.user_name}</strong>
                  </div>
                  <span>
                    {new Date(comment.date).toLocaleDateString("es-ES")}{" "}
                    {new Date(comment.date).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </Col>
        </Row>
      </Col>
    </div>
  );
};
