import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { FloatingCart } from './components/FloatingCart';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-stone-50 font-montserrat w-full overflow-x-hidden flex flex-col">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </main>

        <Footer />
        <FloatingCart />
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}
