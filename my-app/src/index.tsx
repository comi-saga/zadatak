import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AllUsers } from "./allUsers";
import { AddUser } from "./addUser";
import { UpdateUser } from "./updateUser";
import { Menu } from "./menu";


function App() {
  return (
    <Router>
      <Menu/>
      <div style={{display: "inline-block", width:"85%"}}>
        <Routes>
          <Route path="/" element={<AllUsers/>} />
          <Route path="/addUser" element={<AddUser/>} />
          <Route path="/updateUser/:userId" element={<UpdateUser/>} />
        </Routes>
      </div>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
