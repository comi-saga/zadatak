import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AllUsers } from "./allUsers";
import { Menu } from "./views/menu";
import { About1 } from "./abouts/about1";
import { About2 } from "./abouts/about2";
import { Stack } from "@fluentui/react";

function App() {
  return (
    <Stack horizontal horizontalAlign="center">
      <Router>
        <Menu/>
        <Stack horizontal={false} verticalAlign="center" grow={1}>
          <Routes>
            <Route path="/" element={<AllUsers />} />
            <Route path="/about1" element={<About1 />} />
            <Route path="/about2" element={<About2 />} />
          </Routes>
        </Stack>
      </Router>
    </Stack>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
