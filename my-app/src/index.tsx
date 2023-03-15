import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AllUsers } from "./allUsers";
import { AddUser } from "./addUser";
import { UpdateUser } from "./updateUser";
import { Menu } from "./views/menu";
import { About1 } from "./abouts/about1";
import { About2 } from "./abouts/about2";

function App() {
  return (
    <div className="wrapper">
      <Router>
        <Menu />
        <div className="content">
          <Routes>
            <Route path="/" element={<AllUsers />} />
            <Route path="/about1" element={<About1 />} />
            <Route path="/about2" element={<About2 />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
