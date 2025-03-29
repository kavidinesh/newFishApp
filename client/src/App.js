import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FishPrice from "./components/GetFishPrice/FishPrice";
import AddFishPrice from "./components/AddFishPrice/AddFishPrice";
import EditFishPrice from "./components/UpdateFishPrice/EditFishPrice";
import Dashboard from "./components/Dashboard/Dashboard";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginoPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import SupportPage from "./components/SupportPage/SupportPage";
import BoatTrip from './components/getBoatTrip/BoatTrip';
import AddBoatTrip from './components/addBoatTrip/AddBoatTrip';
import UpdateTrip from './components/updateBoatTrip/UpdateBoatTrip';
import Fishermen from './components/getfishermen/Fishermen';
import Addfishermen from './components/addfishermen/Add';
import Editfishermen from './components/updatefishermen/Edit';
import Deletedfishermen from './components/deletedfishermen/DeletedFishermenProfiles';
import FishBuyer from './components/getFishBuyer/FishBuyer';
import AddFishBuyer from './components/addFishBuyer/AddFishBuyer';
import EditFishBuyer from './components/updateFishBuyer/EditFishBuyer';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const PrivateRoute = ({ element, ...rest }) => {
    return user ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        {user && <Navbar user={user} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/supportpage" element={<SupportPage />} />

          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard position={user ? user.position : "owner"} />} />}
          />
          <Route path="/fishprice" element={<PrivateRoute element={<FishPrice />} />} />
          <Route path="/addfish" element={<PrivateRoute element={<AddFishPrice />} />} />
          <Route path="/editfish/:id" element={<PrivateRoute element={<EditFishPrice />} />} />

          <Route path="/boattrip" element={<PrivateRoute element={<BoatTrip />} />} />
          <Route path="/tripadd" element={<PrivateRoute element={<AddBoatTrip />} />} />
          <Route path="/tripupdate/:id" element={<PrivateRoute element={<UpdateTrip />} />} />

          <Route path="/fishermenprofiles" element={<PrivateRoute element={<Fishermen />} />} />
          <Route path="/addfishermen" element={<PrivateRoute element={<Addfishermen />} />} />
          <Route path="/editfishermen/:id" element={<PrivateRoute element={<Editfishermen />} />} />
          <Route path="/Deletedfishermen" element={<PrivateRoute element={<Deletedfishermen />} />} />

          <Route path="/fishbuyer" element={<PrivateRoute element={<FishBuyer />} />} />
          <Route path="/addfishbuyer" element={<PrivateRoute element={<AddFishBuyer />} />} />
          <Route path="/editfishbuyer/:id" element={<PrivateRoute element={<EditFishBuyer />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
