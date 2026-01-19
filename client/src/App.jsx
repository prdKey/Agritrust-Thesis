import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Layout from "./components/layout/Layout"
import Market from "./pages/Market"
import ProtectedRoute from "./components/common/ProtectedRoutes.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import Profile from "./components/common/Profile.jsx";
import PageNotFound from "./pages/PageNotFound.jsx"
import Dashboard from "./components/common/Dashboard.jsx";
import Settings from "./components/common/Settings.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/user" element={<ProtectedRoute><Account/></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="settings" element={<Settings/>}/>
            <Route path="profile" element={<div>profile</div>}/>
            <Route path="*" element={<div>Page Not Found</div>}/>s
          </Route> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/*" element={<PageNotFound/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
