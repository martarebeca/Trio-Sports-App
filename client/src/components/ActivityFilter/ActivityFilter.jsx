import { useState, useContext } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsCalendar3 } from "react-icons/bs";
import { TrioContext } from "../../context/TrioContextProvider";
import "react-datepicker/dist/react-datepicker.css";
import "../ActivityFilter/activityFilter.css";

export const ActivityFilter = ({ onFilter, onReset }) => {
  const { sports } = useContext(TrioContext);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  const handleFilter = () => {
    onFilter({
      sport: selectedSport,
      date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
      city: selectedCity,
    });
  };

  const handleReset = () => {
    setSelectedSport("");
    setSelectedDate(null);
    setSelectedCity("");
    onReset();
  };

  return (
    <div className="filter-container">
      <Form.Group controlId="formSportId" className="filter-group">
        <Form.Select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los deportes</option>
          {sports.map((sport) => (
            <option key={sport.sport_id} value={sport.sport_name}>
              {sport.sport_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <div className="filter-input-group">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="filter-datepicker"
          placeholderText="Fecha"
          dateFormat="dd/MM/yyyy"
        />
        <BsCalendar3 className="calendar-icon" />
      </div>
      <input
        className="filter-input"
        type="text"
        placeholder="Ciudad"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      />
      <button type="button" className="filter-button" onClick={handleFilter}>
        Buscar
      </button>
      <button
        type="button"
        className="filter-button filter-button-secondary ms-2"
        onClick={handleReset}
      >
        Mostrar todas
      </button>
    </div>
  );
};
