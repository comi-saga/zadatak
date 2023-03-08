import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AllUsers } from "./allUsers";
import { AddUser } from "./addUser";
import { UpdateUser } from "./updateUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllUsers/>} />
        <Route path="/addUser" element={<AddUser/>} />
        <Route path="/updateUser/:userId" element={<UpdateUser/>} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
