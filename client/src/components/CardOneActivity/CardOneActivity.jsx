import { Card, Row, Col } from "react-bootstrap";
import { BsTrophy, BsMap, BsCalendar3, BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import "./CardOneActivityStyle.css";

export const CardOneActivity = ({
  activity,
  handleJoinActivity,
  handleLeaveActivity,
  isActivityFull,
  isActivityPast,
  getStatusLabel,
  handleShowModal,
  showEditButton,
}) => {
  const activityDate = parseISO(activity.date_time_activity);
  const formattedDate = format(activityDate, "dd/MM/yyyy HH:mm", {
    locale: es,
  });
  const statusLabel = getStatusLabel(activity);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

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
      return "trio-card-btn";
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!activity.loading) {
      if (activity.is_user_participant) {
        handleLeaveActivity(activity.activity_id);
      } else {
        handleJoinActivity(activity.activity_id);
      }
    }
  };

  const truncatedTitle = truncateText(activity.title, 50);
  const truncatedAddress = truncateText(activity.activity_address, 30);
  const truncatedCity = truncateText(activity.activity_city, 20);

  return (
    <Col xs={12} md={6} className="mb-4">
      <Card className="flex-column flex-md-row h-100 position-relative">
        <Link
          to={`/activity/${activity.activity_id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Card.Img
              src={`/src/assets/activities/${activity.sport_img}`}
              alt={activity.title}
              className="card-img-custom"
              onError={(e) =>
                (e.target.src = "/src/assets/activities/newsport.jpg")
              }
            />
            <div className="card-img-overlay"></div>
          </div>
        </Link>
        {showEditButton && !isActivityPast(activityDate) && (
          <Link
            to={`/editActivity/${activity.activity_id}`}
            className="position-absolute"
            style={{
              top: "10px",
              right: "10px",
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "5px",
              border: "1px solid #ccc",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <BsPencil
              style={{
                cursor: "pointer",
                width: "24px",
                height: "24px",
                color: "gray",
                transition: "color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#000")}
              onMouseOut={(e) => (e.target.style.color = "gray")}
            />
          </Link>
        )}

        <Card.Body className="d-flex flex-column">
          {activity.title && <Card.Title>{truncatedTitle}</Card.Title>}

          <Card.Text>
            <BsTrophy /> {activity.sport_name}
          </Card.Text>

          <Card.Text>
            <BsCalendar3 /> {formattedDate}
          </Card.Text>

          <Card.Text>
            <BsMap /> {truncatedAddress}, {truncatedCity}
          </Card.Text>

          {statusLabel && (
            <Card.Text
              className={
                statusLabel === "Completa" ? "text-danger" : "text-muted"
              }
            >
              <strong>{statusLabel}</strong>
            </Card.Text>
          )}

          <div style={{ flexGrow: 1 }}></div>

          <Row className="mt-3 btn-group">
            <Col xs={12} md={12} className="mb-2">
              <button
                type="button"
                className={`w-100 ${getButtonClassName()}`}
                disabled={
                  isActivityPast(activityDate) ||
                  (isActivityFull(activity) && !activity.is_user_participant)
                }
                onClick={handleButtonClick}
              >
                {getJoinButtonText()}
              </button>
            </Col>
            <Col xs={12} md={12}>
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
        </Card.Body>
      </Card>
    </Col>
  );
};
