import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import BackgroundEffects from './components/BackgroundEffects';
import PremiumExtras from './components/PremiumExtras';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <BackgroundEffects />
        <PremiumExtras />
        <main className="flex-grow z-10 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;