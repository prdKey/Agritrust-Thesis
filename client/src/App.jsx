import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Layout from "./components/layout/Layout"
import Market from "./pages/Market"
import ProtectedRoute from "./components/common/ProtectedRoutes.jsx"
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";
import Profile from "./components/common/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/user" element={<ProtectedRoute><Account/></ProtectedRoute>}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile/>}/>
            <Route path="addresses" element={<div>profile</div>}/>
            <Route path="profile" element={<div>profile</div>}/>
            <Route path="profile" element={<div>profile</div>}/>
            <Route path="*" element={<div>Page Not Found</div>}/>s
          </Route> 
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
