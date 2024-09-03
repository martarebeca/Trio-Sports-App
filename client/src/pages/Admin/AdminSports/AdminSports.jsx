import axios from 'axios';
import { useEffect, useState } from 'react'
import { Col, Table } from 'react-bootstrap'

export const AdminSports = () => {
  const [sportList, setSportList] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admin/getAllSports")
      .then((res) => {
        setSportList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getAllSports = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/getAllSports"
      );
      setSportList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const disableSport = (id) =>{
      axios
        .put("http://localhost:4000/api/admin/disableSport", {
          sport_id: id,
        })
        .then((res) => {
          getAllSports();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const enableSport = (id) =>{
      axios
        .put("http://localhost:4000/api/admin/enableSport", {
          sport_id: id
        })
        .then((res) => {
          getAllSports();
        })
        .catch((error) => {
          console.log(error);
        });
    };

  return (
    <Col xs={12} md={12} lg={8}>
    <Table className="text-center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Deporte</th>
          <th>Habilitar/Deshabilitar</th>
        </tr>
      </thead>
      <tbody>
        {sportList?.map((e, idx) => {
          return (
            <tr key={idx}>
              <td>{e.sport_id}</td>
              <td>
                {e.sport_name}
              </td>
              <td>
              {e.is_disabled === 0 ? <button  type='button' className="trio-cancel-btn" onClick={()=>disableSport(e.sport_id)}>
                    deshabilitar
                  </button>
                  :
                  <button  type='button' className="trio-btn" onClick={()=>enableSport(e.sport_id)}>
                  habilitar
                  </button>
                }
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  </Col>
  )
}
