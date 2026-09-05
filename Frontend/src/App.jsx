import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { BookSlot } from './pages/farmer/BookSlot';
import { TrackOrder } from './pages/farmer/TrackOrder';

// Gov Pages
import { GovDashboard } from './pages/gov/GovDashboard';
import { GovOrders } from './pages/gov/GovOrders';
import { GovDemands } from './pages/gov/GovDemands';

// Shared Pages
import { Community } from './pages/shared/Community';
import { ChatEnquiry } from './pages/shared/ChatEnquiry';
import { TransactionLogs } from './pages/shared/TransactionLogs';
import { Profile } from './pages/shared/Profile';
import { TransparencyLedger } from './pages/shared/TransparencyLedger';

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-stone-800">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/ledger" element={<TransparencyLedger />} />

          {/* Farmer Protected Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/book-slot"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <BookSlot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/track-order"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <TrackOrder />
              </ProtectedRoute>
            }
          />

          {/* Government / Institution Protected Routes */}
          <Route
            path="/gov/dashboard"
            element={
              <ProtectedRoute allowedRoles={['government', 'admin']}>
                <GovDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gov/orders"
            element={
              <ProtectedRoute allowedRoles={['government', 'admin']}>
                <GovOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gov/demands"
            element={
              <ProtectedRoute allowedRoles={['government', 'admin']}>
                <GovDemands />
              </ProtectedRoute>
            }
          />

          {/* Shared Authenticated Routes */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'government', 'admin']}>
                <ChatEnquiry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'government', 'admin']}>
                <TransactionLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'government', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
