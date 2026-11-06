import {BrowserRouter, Navigate, Route, Routes} from 'react-router';
import About from './pages/About/About';
import Business from './pages/Business/Business';
import Consumer from './pages/Consumer/Consumer';
import Contact from './pages/Contact/Contact';
import Home from './pages/Home/Home';
import Plan from './pages/Plan/Plan';
import EnergyIntelligence from './pages/Services/EnergyIntelligence';
import AllServices from './pages/Services/AllServices';
import Equipment from './pages/Services/Equipment';
import Maintenance from './pages/Services/Maintenance';
import Protection from './pages/Services/Protection';
import Tariffs from './pages/Services/Tariffs';
import Start from './pages/Start/Start';
import Tools from './pages/Tools/Tools';
import {CountryLayout, CountryRedirect} from './lib/country';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CountryRedirect />} />

        {/* Every page lives under a country: /uk, /us, /au or /th. Anything else is sent to one. */}
        <Route path="/:country" element={<CountryLayout />}>
          <Route index element={<Home />} />
          <Route path="consumer" element={<Consumer />} />
          <Route path="existing" element={<Navigate to="../consumer" replace />} />
          <Route path="plan" element={<Plan />} />
          <Route path="business" element={<Business />} />
          <Route path="services" element={<AllServices />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="protection" element={<Protection />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="energy-intelligence" element={<EnergyIntelligence />} />
          <Route path="tariffs" element={<Tariffs />} />
          <Route path="tools" element={<Tools />} />
          <Route path="about" element={<About />} />
          <Route path="start" element={<Start />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Navigate to=".." replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
