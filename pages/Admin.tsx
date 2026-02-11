import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, updateDoc, doc, deleteDoc, setDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { UserProfile, QuestionPaper, UserRole } from '../types';
import { Users, Database, Upload, Trash2, CheckCircle, XCircle, Shield, Globe, Award, ClipboardCheck, GraduationCap, Zap } from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'exams'>('users');
  const [loading, setLoading] = useState(true);
  const [jsonInput, setJsonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
      const usersList = usersSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserProfile));
      setUsers(usersList);

      const papersSnap = await getDocs(query(collection(db, 'questionPapers'), orderBy('createdAt', 'desc')));
      const papersList = papersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuestionPaper));
      setPapers(papersList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatus = async (uid: string, status: boolean) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { isApproved: status });
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, isApproved: status } : u));
    } catch (err: any) {
      alert("Error updating status");
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm("CRITICAL: Permanently delete this student profile?")) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers(prev => prev.filter(u => u.uid !== uid));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleJsonUpload = async () => {
    if (!jsonInput.trim()) return;
    setIsSubmitting(true);
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.title || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid structure. Needs 'title' and 'questions' array.");
      }

      const docId = parsed.title.replace(/\s+/g, '-').toLowerCase();
      await setDoc(doc(db, 'questionPapers', docId), {
        subjectName: parsed.title,
        questions: parsed.questions,
        createdAt: serverTimestamp()
      });

      setJsonInput('');
      alert(`Subject Deployed Successfully!`);
      fetchData();
    } catch (err: any) {
      alert("Upload Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-32 px-4 pb-20 animate-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
               Command Center
            </h1>
            <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Sikkha48 Management Suite</p>
          </div>
        </div>
        <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2 uppercase text-xs tracking-widest">
          <Globe className="w-4 h-4" /> Portal View
        </Link>
      </header>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-8 rounded-[2rem] border-white flex items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><Users size={28} /></div>
          <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Students</p><p className="text-4xl font-black text-gray-900 tracking-tighter">{users.length}</p></div>
        </div>
        <div className="glass p-8 rounded-[2rem] border-white flex items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner"><Award size={28} /></div>
          <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Awaiting</p><p className="text-4xl font-black text-gray-900 tracking-tighter">{users.filter(u => !u.isApproved && u.role !== UserRole.ADMIN).length}</p></div>
        </div>
        <div className="glass p-8 rounded-[2rem] border-white flex items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner"><Database size={28} /></div>
          <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Registry</p><p className="text-4xl font-black text-gray-900 tracking-tighter">{papers.length}</p></div>
        </div>
      </div>

      {/* Responsive Horizontal Toggle Switch */}
      <div className="flex justify-center mb-12">
        <div className="relative inline-flex p-1.5 glass rounded-full shadow-2xl border-white/80 bg-white/40 overflow-hidden">
          <div 
            className={`absolute top-1.5 bottom-1.5 rounded-full bg-slate-900 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0`}
            style={{ 
              width: 'calc(50% - 6px)', 
              left: activeTab === 'users' ? '6px' : 'calc(50%)' 
            }}
          ></div>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`relative z-10 flex items-center gap-3 px-6 sm:px-12 py-4 rounded-full font-black text-[9px] sm:text-[11px] tracking-[0.15em] transition-colors duration-300 ${activeTab === 'users' ? 'text-white' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            <Users size={16} /> <span className="whitespace-nowrap">STUDENT DATABASE</span>
          </button>
          <button 
            onClick={() => setActiveTab('exams')}
            className={`relative z-10 flex items-center gap-3 px-6 sm:px-12 py-4 rounded-full font-black text-[9px] sm:text-[11px] tracking-[0.15em] transition-colors duration-300 ${activeTab === 'exams' ? 'text-white' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            <ClipboardCheck size={16} /> <span className="whitespace-nowrap">SUBJECT DEPLOYMENT</span>
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="glass rounded-[2rem] shadow-2xl overflow-hidden border-white bg-white/30">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-white backdrop-blur-sm">
                  <th className="p-8 font-black text-[10px] uppercase tracking-[0.25em]">Registry ID</th>
                  <th className="p-8 font-black text-[10px] uppercase tracking-[0.25em]">Portal Access</th>
                  <th className="p-8 font-black text-[10px] uppercase tracking-[0.25em] text-center">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-white/50 transition-all duration-300">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=random&color=fff&bold=true&rounded=true`} 
                          className="w-12 h-12 rounded-xl shadow-md border-2 border-white"
                          alt="Student"
                        />
                        <div>
                          <div className="font-black text-gray-900 text-lg tracking-tight leading-none">{u.username}</div>
                          <div className="text-gray-400 font-bold text-xs mt-1.5 opacity-70">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black border transition-colors ${u.isApproved ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {u.isApproved ? 'ACTIVATED' : 'LOCKED'}
                      </span>
                    </td>
                    <td className="p-8 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {u.role !== UserRole.ADMIN ? (
                          <>
                            <button 
                              onClick={() => handleUserStatus(u.uid, !u.isApproved)} 
                              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all shadow-sm active:scale-90 ${u.isApproved ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-600 text-white hover:bg-green-700'}`}
                              title={u.isApproved ? "Revoke Access" : "Grant Access"}
                            >
                              {u.isApproved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.uid)} 
                              className="w-11 h-11 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                              title="Erase Account"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <div className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-black tracking-widest shadow-lg border border-indigo-400">MASTER ADMIN</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="glass p-10 rounded-[2.5rem] shadow-xl border-white bg-white/70">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight text-slate-900">
              <Upload size={28} className="text-indigo-600 animate-bounce"/> Subject Deployment
            </h3>
            <div className="relative group mb-8">
              <textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste Question Dataset (JSON) here...'
                className="w-full h-[380px] p-8 font-mono text-sm bg-slate-900 text-indigo-100 border-none rounded-3xl outline-none shadow-2xl custom-scrollbar focus:ring-4 focus:ring-indigo-600/10 transition-all placeholder:text-slate-600/80"
              ></textarea>
              <div className="absolute top-4 right-6 text-[9px] font-black text-indigo-500/30 uppercase tracking-widest pointer-events-none">JSON ENVIRONMENT</div>
            </div>
            <button 
              onClick={handleJsonUpload}
              disabled={isSubmitting || !jsonInput}
              className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] text-lg uppercase tracking-wider flex items-center justify-center gap-3"
            >
              <Zap size={20} /> {isSubmitting ? "Processing..." : "Deploy Live Assessment"}
            </button>
          </div>

          <div className="glass p-10 rounded-[2.5rem] shadow-xl border-white bg-white/70 flex flex-col">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight text-slate-900">
              <Database size={28} className="text-purple-600"/> Active Subjects
            </h3>
            <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[580px]">
              {papers.length === 0 ? (
                <div className="text-center py-32 border-4 border-dashed border-indigo-50 rounded-[2.5rem] text-gray-300 font-black text-xl uppercase tracking-widest italic opacity-50">
                  Registry is Empty
                </div>
              ) : (
                papers.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center shadow-lg hover:shadow-2xl transition-all duration-500 border-l-[10px] border-l-indigo-600">
                    <div className="truncate pr-6">
                      <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1.5 opacity-60">Database Entry</p>
                      <h4 className="font-black text-gray-900 text-xl truncate tracking-tight">{p.subjectName || p.title}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{p.questions.length} Items Indexed</p>
                    </div>
                    <button 
                      onClick={() => { if(window.confirm(`Delete ${p.subjectName || p.title}?`)) { deleteDoc(doc(db, 'questionPapers', p.id)); fetchData(); } }} 
                      className="w-14 h-14 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm flex items-center justify-center flex-shrink-0 active:scale-90"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;