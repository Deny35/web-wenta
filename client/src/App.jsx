import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home          from './pages/Home';
import Projects      from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services      from './pages/Services';
import Contact       from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Admin         from './pages/Admin';

export default function App() {
  useEffect(() => {
    if (window.__hideSplash) window.__hideSplash();
  }, []);

  return (
    <Routes>
      <Route path="/"                     element={<Home />} />
      <Route path="/projekty"             element={<Projects />} />
      <Route path="/realizacja/:id"       element={<ProjectDetail />} />
      <Route path="/uslugi"               element={<Services />} />
      <Route path="/kontakt"              element={<Contact />} />
      <Route path="/produkty-seryjne"      element={<Products />} />
      <Route path="/produkt/:id"          element={<ProductDetail />} />
      <Route path="/polityka-prywatnosci" element={<PrivacyPolicy />} />
      <Route path="/admin"                element={<Admin />} />
    </Routes>
  );
}
