import {BrowserRouter, Navigate, Route, Routes} from 'react-router';
import Layout from './context/layouts';
import Business from './pages/Business/Business';
import Consumer from './pages/Consumer/Consumer';
import Contact from './pages/Contact/Contact';
import Home from './pages/Home/Home';
import Plan from './pages/Plan/Plan';
import Start from './pages/Start/Start';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/consumer" element={<Consumer />} />
          <Route path="/existing" element={<Navigate to="/consumer" replace />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/business" element={<Business />} />

          <Route path="/start" element={<Start />} />

          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
