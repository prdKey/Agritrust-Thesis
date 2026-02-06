import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Layout from "./components/layout/Layout"
import Market from "./pages/Market"
import ProtectedRoute from "./components/common/ProtectedRoutes.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import Profile from "./pages/user/Profile.jsx";
import PageNotFound from "./pages/PageNotFound.jsx"
import Dashboard from "./pages/user/Dashboard.jsx";
import Settings from "./pages/user/Settings.jsx";
import SellerPanel from "./pages/seller/SellerPanel.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx"
import SellerProducts from "./pages/seller/SellerProduct.jsx";
import SellerOrders from "./pages/seller/SellerOrders.jsx"
import Product from "./pages/user/Product.jsx";
import Cart from "./pages/user/Cart.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/seller" element={<ProtectedRoute ><SellerPanel/></ProtectedRoute>}>
            <Route index element={<SellerDashboard/>}/>
            <Route path="dashboard" element={<SellerDashboard />}/>
            <Route path="products" element={<SellerProducts />}/>
            <Route path="orders" element={<SellerOrders />}/>
          </Route>
          <Route path="/about" element={<Home />} />
          <Route path="/" element={<Market />} >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register/>}/>
          </Route>
          <Route path="/search" element={<Market />} >
          </Route>
          <Route path="/products/:id" element={<Product/>}/>
          <Route path="/user" element={<ProtectedRoute ><Account/></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="settings" element={<Settings/>}/>
            <Route path="profile" element={<div>profile</div>}/>
            <Route path="*" element={<div>Page Not Found</div>}/>
          </Route> 
          <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>

          <Route path="/*" element={<PageNotFound/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
