import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage'; 
import CharacterList from '../pages/personajes/CharacterList';
import CharacterDetail from '../pages/personajes/CharacterDetail';
import CharacterCreate from '../pages/personajes/CharacterCreate';
import CharacterEdit from '../pages/personajes/CharacterEdit';
import ObraList from '../pages/obras/ObraList';
import ObraDetail from '../pages/obras/ObraDetail';
import ObraCreate from '../pages/obras/ObraCreate';
import ObraEdit from '../pages/obras/ObraEdit';
import NotFound from '../pages/NotFound';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import Login from '../pages/usuarios/Login';
import Register from '../pages/usuarios/Register';
import ProtectedRoute from './ProtectedRoute'; 
import Contact from '../pages/Contact';
import AboutUs from '../pages/AboutUs';
import Support from '../pages/Support';


const AppRouter = () => {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={
            <div className="w-full h-full">
              <LandingPage />
            </div>
          } />
          <Route path="/characters" element={<div className="container mx-auto p-4 md:p-8"><CharacterList /></div>} />
          <Route path="/obras" element={<div className="container mx-auto p-4 md:p-8"><ProtectedRoute allowedRoles={['admin']}><ObraList /></ProtectedRoute></div>} />
          <Route path="/contact" element={<div className="container mx-auto p-4 md:p-8"><Contact /></div>} />
          <Route path="/about-us" element={<div className="container mx-auto p-4 md:p-8"><AboutUs /></div>} />
          <Route path="/support" element={<div className="container mx-auto p-4 md:p-8"><Support /></div>} />
          <Route path="/login" element={<div className="container mx-auto p-4 md:p-8"><Login /></div>} />
          <Route path="/register" element={<div className="container mx-auto p-4 md:p-8"><Register /></div>} />
          <Route path="/characters/:id" element={<div className="container mx-auto p-4 md:p-8"><CharacterDetail /></div>} />
          <Route path="/obras/:id" element={<div className="container mx-auto p-4 md:p-8"><ProtectedRoute allowedRoles={['admin']}><ObraDetail /></ProtectedRoute></div>} />
          <Route path="/characters/create" element={<div className="container mx-auto p-4 md:p-8"><ProtectedRoute allowedRoles={['admin']}><CharacterCreate /></ProtectedRoute></div>} />
          <Route path="/characters/:id/edit" element={<div className="container mx-auto p-4 md:p-8"><ProtectedRoute allowedRoles={['admin']}><CharacterEdit /></ProtectedRoute></div>} />
          <Route path="/obras/create" element={<div className="container mx-auto p-4 md:p-8"><ProtectedRoute allowedRoles={['admin']}><ObraCreate /></ProtectedRoute></div>} />
          <Route path="/obras/:id/edit" element={<div className="container mx-auto p-4 md:p-8"><ProtectedRoute allowedRoles={['admin']}><ObraEdit /></ProtectedRoute></div>} />
          <Route path="*" element={<div className="container mx-auto p-4 md:p-8"><NotFound /></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRouter;