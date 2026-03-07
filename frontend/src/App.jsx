import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/public/Home';
import Wellness from './pages/public/Wellness';
import Therapy from './pages/public/Therapy';
import WomenSeniors from './pages/public/WomenSeniors';
import Professional from './pages/public/Professional';
import Workshops from './pages/public/Workshops';
import Contact from './pages/public/Contact';
import Trainer from './pages/public/Trainer';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Assessment Pages
import PhysicalHealthAssessment from './pages/assessment/PhysicalHealthAssessment';
import GenerateAssessmentLink from './pages/assessment/GenerateAssessmentLink';
import HRLogin from './pages/assessment/HRLogin';
import HRDashboard from './pages/assessment/HRDashboard';
import EmployeeAssessment from './pages/assessment/EmployeeAssessment';

// Program Detail Pages
import CorporateYoga from './pages/programs/CorporateYoga';
import YogaAsSport from './pages/programs/YogaAsSport';
import YogaForSport from './pages/programs/YogaForSport';
import WomenWellness from './pages/programs/WomenWellness';
import TechSupportedYoga from './pages/programs/TechSupportedYoga';
import Adolescence from './pages/programs/Adolescence';
import PrenatalPostnatal from './pages/programs/PrenatalPostnatal';

// Layout wrapper — hides Navbar & Footer on admin pages
function AppLayout() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin')
        || (location.pathname.startsWith('/assessment') && location.pathname !== '/assessment/generate-link');

    return (
        <div className="min-h-screen flex flex-col">
            {!isAdminPage && <Navbar />}
            <main className={`flex-grow ${!isAdminPage ? 'pt-16' : ''}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/wellness" element={<Wellness />} />
                    <Route path="/therapy" element={<Therapy />} />
                    <Route path="/women-seniors" element={<WomenSeniors />} />
                    <Route path="/professional" element={<Professional />} />
                    <Route path="/workshops" element={<Workshops />} />
                    <Route path="/trainer" element={<Trainer />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />

                    {/* Assessment Routes */}
                    <Route path="/assessment/individual" element={<PhysicalHealthAssessment />} />
                    <Route path="/assessment/generate-link" element={<GenerateAssessmentLink />} />
                    <Route path="/assessment/hr-login" element={<HRLogin />} />
                    <Route path="/assessment/hr-dashboard" element={<HRDashboard />} />
                    <Route path="/assessment/employee/:linkId" element={<EmployeeAssessment />} />

                    {/* Program Detail Routes */}
                    <Route path="/programs/corporate-yoga" element={<CorporateYoga />} />
                    <Route path="/programs/yoga-as-sport" element={<YogaAsSport />} />
                    <Route path="/programs/yoga-for-sport" element={<YogaForSport />} />
                    <Route path="/programs/women-wellness" element={<WomenWellness />} />
                    <Route path="/programs/tech-supported-yoga" element={<TechSupportedYoga />} />
                    <Route path="/programs/adolescence" element={<Adolescence />} />
                    <Route path="/programs/prenatal-postnatal" element={<PrenatalPostnatal />} />
                </Routes>
            </main>
            {!isAdminPage && <Footer />}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />
                <AppLayout />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
