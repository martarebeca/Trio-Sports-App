import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Table } from "react-bootstrap";

export const AdminUsers = () => {
  const [userList, setUserList] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admin/getAllUsers")
      .then((res) => {
        setUserList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/getAllUsers"
      );
      setUserList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const disableUser = (id) => {
    axios
      .put("http://localhost:4000/api/admin/disableUser", {
        user_id: id,
      })
      .then((res) => {
        getAllUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const enableUser = (id) => {
    axios
      .put("http://localhost:4000/api/admin/enableUser", {
        user_id: id,
      })
      .then((res) => {
        getAllUsers();
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
            <th>Usuario</th>
            <th>Habilitar/Deshabilitar</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((e, idx) => {
            return (
              <tr key={idx}>
                <td>{e.user_id}</td>
                <td>
                  {e.user_name} {e.last_name}
                </td>
                <td>
                {e.is_disabled === 0 ? <button  type='button' className="trio-cancel-btn" onClick={()=>disableUser(e.user_id)}>
                    deshabilitar
                  </button>
                  :
                  <button  type='button' className="trio-btn" onClick={()=>enableUser(e.user_id)}>
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
  );
};
