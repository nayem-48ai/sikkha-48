import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, ChevronDown } from 'lucide-react';

const PaymentPortal: React.FC = () => {
  const [method, setMethod] = useState<'nagad' | 'bkash'>('nagad');
  const [email, setEmail] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isStepsOpen, setIsStepsOpen] = useState(false);

  const data = {
    nagad: {
      name: 'Nagad',
      number: '01719470590',
      color: '#ED1C24',
      lightBg: '#FEF2F2',
      border: '#FEE2E2',
      logo: 'https://i.ibb.co.com/LzwQnhQ6/Nagad.png',
      steps: [
        "নগদ অ্যাপ বা *167# ডায়াল করুন।",
        "'Send Money' অপশন সিলেক্ট করুন।",
        "নম্বরটি কপি করে পেস্ট করুন।",
        "পরিমাণ (৳৫০) লিখে কনফার্ম করুন।"
      ]
    },
    bkash: {
      name: 'bKash',
      number: '01605092363',
      color: '#E2136E',
      lightBg: '#FDF2F8',
      border: '#FCE7F3',
      logo: 'https://i.ibb.co.com/bMxzXdbb/b-Kash.png',
      steps: [
        "বিকাশ অ্যাপ বা *247# ডায়াল করুন।",
        "'Send Money' অপশন সিলেক্ট করুন।",
        "নম্বরটি কপি করে পেস্ট করুন।",
        "পরিমাণ (৳৫০) লিখে পিন দিয়ে কনফার্ম করুন।"
      ]
    }
  };

  const current = data[method];

  const copyNumber = () => {
    navigator.clipboard.writeText(current.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    if (!email || !trxId) {
      alert("দয়া করে আপনার ইমেইল এবং ট্রানজেকশন আইডি প্রদান করুন।");
      return;
    }
    const myWhatsApp = "8801719470590";
    const msg = `Hello,\nI have paid via ${method.toUpperCase()}.\n\nDetails:\nEmail: ${email}\nTrxID: ${trxId}\nAmount: 50 BDT\nSite: Sikkha48`;
    window.open(`https://wa.me/${myWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div 
      className="bg-white w-full max-w-[450px] mx-auto rounded-3xl shadow-2xl overflow-hidden relative border-t-8 transition-all duration-300"
      style={{ borderColor: current.color }}
    >
      <div className="flex border-b">
        <button 
          onClick={() => setMethod('nagad')}
          className={`flex-1 py-5 flex items-center justify-center gap-2 font-bold transition-all ${method === 'nagad' ? 'bg-[#fcfcfc] border-b-4' : 'text-gray-400 hover:bg-gray-50'}`}
          style={{ borderBottomColor: method === 'nagad' ? current.color : 'transparent', color: method === 'nagad' ? current.color : '' }}
        >
          <img src={data.nagad.logo} className="h-6" alt="Nagad" /> Nagad
        </button>
        <button 
          onClick={() => setMethod('bkash')}
          className={`flex-1 py-5 flex items-center justify-center gap-2 font-bold transition-all ${method === 'bkash' ? 'bg-[#fcfcfc] border-b-4' : 'text-gray-400 hover:bg-gray-50'}`}
          style={{ borderBottomColor: method === 'bkash' ? current.color : 'transparent', color: method === 'bkash' ? current.color : '' }}
        >
          <img src={data.bkash.logo} className="h-6" alt="bKash" /> bKash
        </button>
      </div>

      <div className="p-6 text-center">
        <h1 className="text-lg font-bold text-gray-800">Portal Activation</h1>
        <p className="text-4xl font-black mt-1 transition-colors" style={{ color: current.color }}>৳50</p>
      </div>

      <div className="px-6 pb-6 space-y-4">
        <div 
          className="p-4 rounded-2xl border transition-colors"
          style={{ backgroundColor: current.lightBg, borderColor: current.border }}
        >
          <p className="text-sm font-semibold text-gray-600 mb-2">
            {current.name} 'Send Money' করুন এই নম্বরে:
          </p>
          <div 
            className="flex items-center justify-between bg-white border border-dashed p-3 rounded-xl shadow-sm transition-colors"
            style={{ borderColor: current.color }}
          >
            <code className="text-lg font-mono font-bold tracking-wider text-gray-800">{current.number}</code>
            <button 
              onClick={copyNumber}
              className="text-white text-[10px] px-3 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5"
              style={{ backgroundColor: current.color }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'DONE' : 'COPY'}
            </button>
          </div>
          
          <div className="mt-3">
            <button 
              onClick={() => setIsStepsOpen(!isStepsOpen)}
              className="text-xs text-blue-600 cursor-pointer flex items-center gap-1 font-bold"
            >
              <span>কিভাবে টাকা পাঠাবেন?</span>
              <ChevronDown size={14} className={`transition-transform ${isStepsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isStepsOpen && (
              <div className="text-[12px] text-gray-600 mt-2 bg-white p-3 rounded-lg leading-relaxed border border-gray-100 shadow-inner">
                {current.steps.map((step, i) => (
                  <div key={i}>{i+1}. {step}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <input 
            type="email" 
            placeholder="আপনার ব্যবহৃত ইমেইল" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl p-3 focus:outline-none bg-gray-50/50 transition-all focus:border-indigo-400"
          />
          <input 
            type="text" 
            placeholder="ট্রানজেকশন আইডি (TrxID)" 
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl p-3 focus:outline-none font-mono bg-gray-50/50 transition-all focus:border-indigo-400"
          />
        </div>

        <button 
          onClick={handleVerify}
          className="w-full text-white py-4 font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: current.color }}
        >
          <i className="fab fa-whatsapp text-xl"></i> VERIFY ON WHATSAPP
        </button>
        
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">© Sikkha48 Gateway | @Tnayem48</p>
      </div>
    </div>
  );
};

export default PaymentPortal;