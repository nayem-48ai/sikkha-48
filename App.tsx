import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import { getUserProfile } from './services/authService';
import { UserProfile, UserRole } from './types';
// Update Check ✓
import UpdateChecker from './components/UpdateChecker'; 
// Pages
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Exam from './pages/Exam';
import Result from './pages/Result';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50/30">
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin shadow-2xl shadow-indigo-100"></div>
          <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Synchronizing Sikkha48...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <UpdateChecker />
      <div className="min-h-screen">
        <Navbar user={user} />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

            {/* Private Routes */}
            <Route 
              path="/" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/exam/:id" 
              element={user && (user.isApproved || user.role === UserRole.ADMIN) ? <Exam /> : <Navigate to="/" />} 
            />
            
            <Route 
              path="/result" 
              element={user ? <Result /> : <Navigate to="/login" />} 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={user?.role === UserRole.ADMIN ? <Admin /> : <Navigate to="/" />} 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
