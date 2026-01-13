import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Layout from "./components/layout/Layout"
import Market from "./pages/Market"
import ProtectedRoute from "./components/common/ProtectedRoutes.jsx"
import Seller from "./pages/seller/Seller.jsx";
import SellerDashboard from "./components/common/SellerDashboard.jsx";
import MyAccount from "./components/common/MyAccount.jsx";
import ProfileTab from "./components/common/Profile.jsx";
import AddressTab from "./components/common/Address.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/seller/" element={<ProtectedRoute><Seller /></ProtectedRoute>}>
            <Route index element={<SellerDashboard />} /> {/* /seller */}
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="account" element={<MyAccount />}>
              <Route index element={<ProfileTab />} />
              <Route path="profile" element={<ProfileTab />} />
              <Route path="address" element={<AddressTab />} />
            </Route>
            <Route path="setting" element={<div>Setting</div>} />
            <Route path="purchase" element={<div>Purchase</div>} />
            <Route path="notifications" element={<div>Notifications</div>} />
          </Route>
          <Route path="/" element={< Home/>} />
          <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
