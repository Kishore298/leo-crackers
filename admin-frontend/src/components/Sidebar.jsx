import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { FaTachometerAlt, FaBoxOpen, FaTags, FaImages, FaPercent, FaFileImport, FaSignOutAlt, FaShoppingCart, FaUsers } from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
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
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-surface-2/95 backdrop-blur-xl min-h-screen text-text flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)] border-r border-white/5 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 mb-4 flex flex-col items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <img src="/assets/leo-logo.png" alt="Logo" className="w-8 h-8 rounded-full bg-white p-1 object-contain grayscale opacity-80" onError={(e) => e.target.style.display = 'none'} />
          <h2 className="text-3xl md:text-4xl font-brand tracking-normal text-primary font-normal">Leo Crackers</h2>
        </div>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2 font-sans overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen && setIsOpen(false)}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                ? 'bg-fire-gradient text-white shadow-[0_0_15px_rgba(255,102,0,0.4)] font-semibold translate-x-2'
                : 'text-text-secondary hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
            >
              <span className={`text-lg ${isActive ? 'animate-pulse' : ''}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-text-secondary hover:bg-primary-dark hover:text-white hover:shadow-[0_0_15px_rgba(139,0,0,0.5)] transition-all duration-300 font-medium"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;