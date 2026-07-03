import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { FloatingCart } from './components/FloatingCart';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';

import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function AppContent() {
  const { isAuthModalOpen, closeAuthModal, user } = useAuth();
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-50 font-montserrat w-full overflow-x-hidden flex flex-col">
        {user && user.isVerified === false && (
          <div className="bg-amber-100 border-b border-amber-200 text-amber-800 px-4 py-2 text-center text-sm font-medium z-50">
            Tu cuenta aún no está verificada. Por favor revisa tu correo electrónico para verificarla.
          </div>
        )}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/verificar" element={<VerifyEmail />} />
            <Route path="/recuperar-contrasena" element={<ResetPassword />} />
          </Routes>
        </main>

        <Footer />
        <FloatingCart />
        
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
        <Toaster richColors position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
