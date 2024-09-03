import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { AllActivities } from "../pages/AllActivities/AllActivities";
import { Activity } from "../pages/Activity/Activity";
import { AddActivity } from "../pages/AddActivity/AddActivity";
import { AllUsers } from "../pages/AllUsers/AllUsers";
import { Chats } from "../pages/Chats/Chats";
import { Profile } from "../pages/Profile/Profile";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { Login } from "../pages/Auth/Login/Login";
import { Col, Container, Row } from "react-bootstrap";
import { NavBarApp } from "../components/NavBarApp/NavBarApp";
import { Register } from "../pages/Auth/Register/Register";
import { AddSport } from "../pages/AddSport/AddSport";
import { UserActivities } from "../pages/Profile/UserActivities/UserActivities";
import { UserParticipatedActivities } from "../pages/Profile/UserParticipatedActivities/UserParticipatedActivities";
import { Validation } from "../pages/Validation/Validation";
import { RecoverPassword } from "../pages/RecoverPassword/RecoverPassword";
import { EditPassword } from "../pages/EditPassword/EditPassword";
import { useContext, useEffect } from "react";
import { TrioContext } from "../context/TrioContextProvider";
import { Admin } from "../pages/Admin/Admin";
import { OneUser } from "../pages/OneUser/OneUser";
import { OneUserActivies } from "../pages/OneUser/OneUserActivities/OneUserActivies";
import { OneUserParticipatedActivities } from "../pages/OneUser/OneUserParticipatedActivities/OneUserParticipatedActivities";

import { EditActivity } from "../pages/EditActivity/EditActivity";
import { AdminUsers } from "../pages/Admin/AdminUsers/AdminUsers";
import { AdminSports } from "../pages/Admin/AdminSports/AdminSports";



export const AppRoutes = () => {
  const { user } = useContext(TrioContext);
  return (
    <BrowserRouter>
        <Container fluid>
      <Row>
        <NavBarApp />
      </Row>
            <Routes>
              <Route path="/" element={user ? <AllActivities /> : <Home />} />
              {user && <Route path="/allActivities" element={<AllActivities />} />}
              {user && (
                <Route path="/activity/:activity_id" element={<Activity />} />
              )}
              {user && <Route path="/addSport" element={<AddSport />} />}
              {user && <Route path="/addActivity" element={<AddActivity />} />}
              {user && (
                <Route
                  path="/editActivity/:activity_id"
                  element={<EditActivity />}
                />
              )}
              {user && <Route path="/allUsers" element={<AllUsers />} />}
              {user && <Route path="/chats" element={<Chats />} />}
              {user && (
                <Route path="/profile" element={<Profile />}>
                  <Route index element={<UserActivities />} />
                  <Route path="1" element={<UserParticipatedActivities />} />
                </Route>
              )}

              {!user && <Route path="/login" element={<Login />} /> }
              {!user && <Route path="/register" element={<Register />} /> }
              <Route path="/recoverPassword" element={<RecoverPassword />} />
              <Route path="/editPassword/:token" element={<EditPassword />} />
              <Route path = "/validation/:token" element={<Validation/>}/>
              <Route path="/oneUser/:id" element={<OneUser/>} >
                <Route index element={<OneUserActivies />} />
                <Route path="1" element={<OneUserParticipatedActivities />} />
              </Route>

              {user?.type === 1 &&
              <Route path="/admin" element={<Admin/>}>
                <Route index element = {<AdminUsers/>}/>
                <Route path="1" element = {<AdminSports/>} />
              </Route>
              }

            <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Container>
    </BrowserRouter>
  );
};
