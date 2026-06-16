import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { FaTachometerAlt, FaBoxOpen, FaTags, FaImages, FaPercent, FaFileImport, FaSignOutAlt, FaShoppingCart, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/orders', name: 'Orders', icon: <FaShoppingCart /> },
    { path: '/categories', name: 'Categories', icon: <FaTags /> },
    { path: '/products', name: 'Products', icon: <FaBoxOpen /> },
    { path: '/customers', name: 'Customers', icon: <FaUsers /> },
    { path: '/banners', name: 'Banners', icon: <FaImages /> },
    { path: '/discounts', name: 'Global Discount', icon: <FaPercent /> },
    { path: '/import', name: 'Import Data', icon: <FaFileImport /> },
  ];

  return (
    <div className="w-64 bg-primary-dark min-h-screen text-white flex flex-col shadow-primary-lg z-10 border-r-4 border-primary">
      <div className="p-6 mb-4">
        <h2 className="text-2xl font-black tracking-wide text-primary-light">LEO<span className="text-white font-light">CRACKERS</span></h2>
        <p className="text-xs text-border mt-1 uppercase tracking-wider font-semibold">Admin Portal</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 font-sans">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                ? 'bg-fire-gradient text-white shadow-primary font-semibold translate-x-1'
                : 'text-border hover:bg-black/20 hover:text-white'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-border hover:bg-red-600 hover:text-white transition-colors font-medium shadow"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;