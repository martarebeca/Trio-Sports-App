import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { TrioContext } from "../../../context/TrioContextProvider";
import { Container, Row } from "react-bootstrap";
import { CardOneActivity } from "../../../components/CardOneActivity/CardOneActivity";
import { isBefore, parseISO } from "date-fns";
import ModalCreateComment from "../../../components/ModalCreateComment/ModalCreateComment";
import { useNavigate } from "react-router-dom";

export const UserActivities = () => {
  const { token, user } = useContext(TrioContext);
  const [userActivities, setUserActivities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userActivities = async () => {
      try {
        let res = await axios.get(
          "http://localhost:4000/api/users/getUserActivities",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserActivities(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    userActivities();
  }, [token]);

  /* NECESARIO PARA LA CARD */
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleShowModal = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const handleCommentSubmit = async (comment) => {
    try {
      // Envía el comentario al backend
      const response = await axios.post(
        "http://localhost:4000/api/comments/addComment",
        {
          activity_id: selectedActivity.activity_id,
          user_id: user.user_id,
          text: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // token
        }
      );
      if (response.status === 201) {
        // Redirige a la vista de la actividad
        navigate(`/activity/${selectedActivity.activity_id}`);
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

  const getStatusLabel = (activity) => {
    const activityDate = parseISO(activity.date_time_activity);
    if (isActivityPast(activityDate)) {
      return "Finalizada";
    }
    if (isActivityFull(activity)) {
      return "Completa";
    }
    return null;
  };

  const handleJoinActivity = async (activityId) => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/activity/joinActivity",
        { activity_id: activityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setUserActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.activity_id === activityId
              ? {
                  ...activity,
                  num_assistants: activity.num_assistants + 1,
                  is_user_participant: true,
                }
              : activity
          )
        );
      }
    } catch (error) {
      console.error(
        "Error al unirse a la actividad:",
        error.response?.data || error.message
      );
    }
  };

  const handleLeaveActivity = async (activityId) => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/activity/leaveActivity",
        { activity_id: activityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setUserActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.activity_id === activityId
              ? {
                  ...activity,
                  num_assistants: Math.max(activity.num_assistants - 1, 0),
                  is_user_participant: false,
                }
              : activity
          )
        );
      }
    } catch (error) {
      console.error(
        "Error al abandonar la actividad:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Container>
      <Row>
        {!Array.isArray(userActivities) ? (
          <p>No hay actividades disponibles</p>
        ) : (
          userActivities.map((e) => (
            <CardOneActivity
              key={e.activity_id}
              activity={e}
              handleJoinActivity={handleJoinActivity}
              handleLeaveActivity={handleLeaveActivity}
              isActivityFull={isActivityFull}
              isActivityPast={isActivityPast}
              getStatusLabel={getStatusLabel}
              handleShowModal={handleShowModal}
              showEditButton={true}
            />
          ))
        )}
      </Row>
      <ModalCreateComment
        show={showModal}
        handleClose={handleCloseModal}
        handleCommentSubmit={handleCommentSubmit}
      />
    </Container>
  );
};
