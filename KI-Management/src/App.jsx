import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Tasks from "./pages/Tasks";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pages WITH navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/events" element={<Events />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Pages WITHOUT navbar */}
        <Route path="/login" element={<Login />} />
        

      </Routes>
    </BrowserRouter>
  );
}