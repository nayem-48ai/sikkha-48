import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { UserProfile, QuestionPaper, UserRole } from '../types';
import { BookOpen, AlertTriangle, ShieldCheck, ChevronRight, GraduationCap, LayoutGrid, Sparkles } from 'lucide-react';
import PaymentPortal from '../components/PaymentPortal';

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [exams, setExams] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);

  const isApproved = user.role === UserRole.ADMIN || user.isApproved;

  useEffect(() => {
    const fetchExams = async () => {
      if (!isApproved) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'questionPapers'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const examList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as QuestionPaper[];
        setExams(examList);
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [isApproved]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="container mx-auto pt-32 px-4 pb-20 animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-[2rem] shadow-2xl border-white overflow-hidden bg-white/70">
            <div className="p-10 text-center bg-gradient-to-b from-amber-50/50 to-transparent">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Portal Activation Required</h1>
              <p className="text-gray-500 font-bold max-w-lg mx-auto leading-relaxed">
                Your account is currently <span className="text-amber-600 underline decoration-2 underline-offset-4 font-black">Awaiting Activation</span>. 
                Please complete the gateway payment below to unlock your dashboard.
              </p>
            </div>
            
            <div id="payment-wrapper" className="w-full bg-slate-50/30 p-4 sm:p-12 border-y border-white/40">
               <div className="hover:scale-[1.01] transition-transform duration-500">
                 <PaymentPortal />
               </div>
            </div>

            <div className="p-8 text-center bg-slate-900 text-white flex flex-col items-center gap-3">
               <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em]">
                 <ShieldCheck className="w-5 h-5 text-green-400" /> Secure Encryption Active
               </div>
               <p className="text-gray-400 text-[10px] max-w-sm font-medium opacity-70 uppercase tracking-widest">Post-payment activation is typically automated and instant.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-32 px-4 pb-20 animate-slide-up">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
              <GraduationCap className="w-8 h-8" />
           </div>
           <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">My Subjects</h1>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              Welcome back, {user.username}. Select a topic to begin.
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Library</p>
              <p className="font-black text-gray-900">{exams.length} Topics</p>
            </div>
          </div>
        </div>
      </header>

      {exams.length === 0 ? (
        <div className="glass p-24 rounded-[3rem] text-center shadow-xl border-dashed border-2 border-indigo-200">
          <BookOpen className="w-16 h-16 text-indigo-100 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-gray-700">No Active Subjects</h3>
          <p className="text-gray-400 mt-2 font-medium">Please wait for the administrator to deploy new question sets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <div key={exam.id} className="glass group rounded-[3rem] p-10 shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 border border-white/60 flex flex-col bg-white/50 relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl group-hover:bg-indigo-200/40 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-indigo-100 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] px-4 py-2 rounded-xl font-black border border-indigo-100 uppercase tracking-widest shadow-sm">
                    {exam.questions.length} Questions
                  </span>
                </div>
              </div>
              
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">Ready for Assessment</p>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-8 group-hover:text-indigo-700 transition-colors leading-tight tracking-tight min-h-[5rem]">
                  {exam.subjectName || exam.title}
                </h3>
              </div>

              <div className="space-y-4 mb-10 border-t border-slate-100/50 pt-8 relative z-10">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> MCQ based examination
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Instant review available
                </div>
              </div>

              <Link 
                to={`/exam/${exam.id}`}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.75rem] transition-all shadow-xl shadow-indigo-100 active:scale-95 text-lg uppercase tracking-wider relative z-10"
              >
                Launch Exam <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;