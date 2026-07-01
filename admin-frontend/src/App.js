import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Banners from './pages/Banners';
import Discounts from './pages/Discounts';
import Customers from './pages/Customers';
import Import from './pages/Import';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

const ProtectedRoute = ({ children }) => {
  const { admin } = useSelector((state) => state.auth);
  if (!admin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="banners" element={<Banners />} />
          <Route path="discounts" element={<Discounts />} />
          <Route path="customers" element={<Customers />} />
          <Route path="import" element={<Import />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;