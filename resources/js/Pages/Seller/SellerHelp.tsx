import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head } from '@inertiajs/inertia-react';

interface HelpProps {
  tickets: any[];
  common_questions: any[];
}

export default function SellerHelp({ tickets, common_questions }: HelpProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [displayQuestions, setDisplayQuestions] = React.useState(common_questions);

  const handleSearch = () => {
     const filtered = common_questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
     );
     setDisplayQuestions(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SellerLayout>
      <Head title="Help & Support" />

      {/* Hero Search Section */}
      <div className="-mt-12 -mx-12 mb-16 px-12 pt-32 pb-48 bg-[#1a1c23] rounded-b-[5rem] relative overflow-hidden flex flex-col items-center text-center">
         <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-transparent"></div>
         <div className="relative z-10 max-w-4xl">
            <h1 className="text-7xl font-black text-white tracking-tighter mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
               How can we support your <span className="text-[#f5a623]">artisan journey</span> today?
            </h1>
            
            <div className="relative group max-w-2xl mx-auto">
               <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your issue (e.g. 'How do I set shipping rates?')" 
                  className="w-full h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-10 text-lg font-medium text-white placeholder:text-white/40 focus:ring-4 focus:ring-[#f5a623]/20 focus:border-[#f5a623] transition-all outline-none"
               />
               <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-3 bottom-3 px-10 bg-[#f5a623] text-white rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20"
               >
                  Search
               </button>
            </div>
         </div>
      </div>


      {/* Support Categories Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 -mt-32 relative z-20 mb-24">
         <HelpCategoryCard 
            title="Seller Handbook" 
            desc="Master the art of online selling with our comprehensive guide on branding, photography, and customer service." 
            icon="📖" 
            link="Explore Guides" 
         />
         <HelpCategoryCard 
            title="Payout Support" 
            desc="Detailed information about transaction fees, payout schedules, and how to manage your artisanal earnings." 
            icon="🏦" 
            link="Check Status" 
         />
         <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-2xl flex flex-col h-full transform transition hover:-translate-y-2 duration-500">
            <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 flex items-center justify-center text-3xl mb-10 shadow-sm">🚚</div>
            <h3 className="text-2xl font-black text-gray-900 mb-6">Delivery Fee Center</h3>
            <div className="space-y-4 mb-auto">
               <div className="bg-gray-50/50 p-4 rounded-xl flex justify-between items-center group/btn cursor-pointer hover:bg-orange-50 transition-all border border-gray-100/50">
                  <span className="text-xs font-bold text-gray-700 group-hover/btn:text-[#f5a623]">Print Shipping Labels</span>
                  <span className="text-gray-400">⎙</span>
               </div>
               <div className="bg-gray-50/50 p-4 rounded-xl flex justify-between items-center group/btn cursor-pointer hover:bg-orange-50 transition-all border border-gray-100/50">
                  <span className="text-xs font-bold text-gray-700 group-hover/btn:text-[#f5a623]">Track Active Parcels</span>
                  <span className="text-gray-400">⌖</span>
               </div>
            </div>
            <button className="flex items-center gap-2 mt-12 text-sm font-black text-[#f5a623] uppercase tracking-widest group">
               Manage Shipping <span className="transition-transform group-hover:translate-x-2">→</span>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 mb-24">
         {/* FAQ Section */}
         <div className="lg:col-span-3">
            <h3 className="text-4xl font-black text-gray-900 mb-12 flex items-center gap-4">
               <div className="w-12 h-1 bg-[#f5a623] rounded-full"></div>
               Common Questions
            </h3>
            
            <div className="space-y-6">
               {displayQuestions.length > 0 ? displayQuestions.map((q, i) => (
                 <div key={i} className="group bg-white rounded-[2.5rem] border border-gray-100 transition-all hover:border-[#f5a623]/20 overflow-hidden">
                    <div className="px-10 py-8 flex justify-between items-center cursor-pointer">
                       <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#f5a623] transition-all">{q.question}</h4>
                       <span className="text-gray-300 group-hover:text-[#f5a623] transition-all transform group-hover:rotate-180 duration-500 text-2xl">⌵</span>
                    </div>
                    {i === 0 && (
                      <div className="px-10 pb-12">
                         <p className="text-gray-500 font-medium leading-relaxed italic border-l-4 border-orange-50 pl-8">
                            {q.answer}
                         </p>
                      </div>
                    )}
                 </div>
               )) : (
                 <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100">
                    <span className="text-4xl mb-6 block">🔍</span>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No matching topics found</h4>
                    <p className="text-gray-400">Try searching for keywords like 'payout', 'shipping', or 'orders'.</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setDisplayQuestions(common_questions); }}
                      className="mt-8 text-[#f5a623] font-black uppercase tracking-widest text-xs underline"
                    >
                      Reset Search
                    </button>
                 </div>
               )}
            </div>

         </div>

         {/* Artisan Network Card */}
         <div className="lg:col-span-2">
            <div className="bg-[#1a1c23] rounded-[4rem] p-16 text-white relative overflow-hidden h-full flex flex-col justify-end group">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 scale-150 grayscale group-hover:scale-100 group-hover:opacity-20 transition-all duration-1000">
                  <img src="https://images.unsplash.com/photo-1542435503-956c469947f6?w=600" alt="Community" className="w-full h-full object-cover" />
               </div>
               <div className="relative z-10">
                  <span className="inline-block bg-[#f5a623] text-white text-[9px] font-black px-4 py-2 rounded-lg mb-8 uppercase tracking-[0.2em]">Artisan Network</span>
                  <h2 className="text-5xl font-black mb-10 text-white tracking-tighter leading-tight">Connect with 5,000+ fellow artisans</h2>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed mb-12">
                     Join the Kokommerce Community Forum to share techniques, discuss market trends, and grow your business alongside peers.
                  </p>
                  <button className="w-full py-6 bg-white text-gray-900 rounded-[1.5rem] text-sm font-black hover:bg-gray-100 transition-all uppercase tracking-widest shadow-2xl">
                     Join the Forum
                  </button>
               </div>
            </div>
         </div>
      </div>

    </SellerLayout>
  );
}

const HelpCategoryCard = ({ title, desc, icon, link }: any) => (
  <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl flex flex-col transform transition hover:-translate-y-2 duration-500 group">
    <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 flex items-center justify-center text-3xl mb-10 shadow-sm group-hover:rotate-12 transition-transform">{icon}</div>
    <h3 className="text-2xl font-black text-gray-900 mb-6">{title}</h3>
    <p className="text-gray-500 font-medium leading-relaxed mb-12">{desc}</p>
    <button className="flex items-center gap-2 mt-auto text-sm font-black text-[#f5a623] uppercase tracking-widest">
      {link} <span className="transition-transform group-hover:translate-x-2">→</span>
    </button>
  </div>
);
