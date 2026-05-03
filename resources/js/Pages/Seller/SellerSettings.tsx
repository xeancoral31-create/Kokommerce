import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, useForm } from '@inertiajs/inertia-react';
import { useUser } from '@clerk/clerk-react';

declare function route(name?: string, params?: any, absolute?: boolean, config?: any): string;

interface SettingsProps {
  store_profile: any;
  operating_hours: any[];
}

export default function SellerSettings({ store_profile, operating_hours }: SettingsProps) {
  const { user, isLoaded } = useUser();
  const { data, setData, post, processing, errors } = useForm({
    name: store_profile.name,
    tagline: store_profile.tagline,
    description: store_profile.description,
    image: null as File | null,
    image_url: store_profile.image || '',
    sync_with_clerk: false
  });

  const [preview, setPreview] = React.useState(store_profile.image || "https://via.placeholder.com/300?text=Logo");

  // Automatically sync preview with Clerk profile image on load
  React.useEffect(() => {
    if (isLoaded && user?.imageUrl && (!store_profile.image || store_profile.image === "https://via.placeholder.com/300?text=Logo")) {
      setPreview(user.imageUrl);
      setData('image_url', user.imageUrl);
    }
  }, [isLoaded, user, store_profile.image]);
  
  // Password Management State
  const [passwordData, setPasswordData] = React.useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData(prev => ({ ...prev, image: file, image_url: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        window.dispatchEvent(new CustomEvent('artisanal_profile_sync', { 
          detail: { image: result } 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const syncWithClerkProfile = () => {
    if (isLoaded && user) {
      setPreview(user.imageUrl);
      setData(prev => ({ 
        ...prev, 
        name: user.fullName || prev.name,
        image_url: user.imageUrl,
        image: null
      }));
      
      // Trigger sync event for layout
      window.dispatchEvent(new CustomEvent('artisanal_profile_sync', { 
        detail: { image: user.imageUrl, name: user.fullName } 
      }));
      
      alert("Profile connected! Your store identity is now synchronized with your verified social profile. Save changes to make this permanent.");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Artisanal Security: Please provide both password fields to proceed.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Security Mismatch: The passwords provided do not match our artisanal standards. Please verify and try again.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
        alert("Security Standard: For your protection, passwords must be at least 8 characters long.");
        return;
    }

    setIsUpdatingPassword(true);
    try {
      if (user) {
        await user.update({
          password: passwordData.newPassword,
        });
        alert("Security Configuration Updated: Your permanent password has been changed successfully. Please use it for future artisanal access.");
        setPasswordData({ newPassword: '', confirmPassword: '' });
      } else {
        throw new Error("User identity not established");
      }
    } catch (err: any) {
      console.error("Password Update Error:", err);
      alert("Security Protocol Alert: " + (err.errors?.[0]?.longMessage || "An unexpected error occurred during the security update. Please ensure you are not using a social login without a primary password set."));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpdateSchedule = () => {
    alert("Artisanal Schedule Management: Your operating hours are currently being synchronized with our delivery fee engine.");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('seller.settings.update'), {
      onSuccess: () => alert("Bakery configuration successfully saved and artisanal storefront updated!"),
    });
  };

  return (
    <SellerLayout>
      <Head title="Store Settings" />

      <form onSubmit={submit} className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#eca840] shadow-sm"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Configuration</span>
            </div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 leading-none">Settings & Profile</h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
               Manage your artisanal identity, connectivity, and payment infrastructure.
            </p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
             <button 
              type="submit" 
              disabled={processing}
              className="flex-1 lg:flex-none px-10 py-5 bg-[#2d2a26] text-white rounded-2xl text-[11px] font-black hover:bg-black transition-all uppercase tracking-widest shadow-xl shadow-gray-900/10 disabled:opacity-50"
             >
                {processing ? 'Syncing...' : 'Save All Changes'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Main Configuration Area */}
           <div className="lg:col-span-2 space-y-10">
              {/* Store Profile Section */}
              <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8">
                    {isLoaded && user && (
                      <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest italic">Account Linked</span>
                      </div>
                    )}
                 </div>

                 <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl">🏬</div>
                    <h3 className="text-2xl font-black text-gray-900">Store Identity</h3>
                 </div>
                 
                 <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="relative group">
                       <div className="w-52 h-52 rounded-[2rem] bg-gray-50 flex items-center justify-center p-6 overflow-hidden border border-gray-100 shadow-inner">
                          <img src={preview} alt="Store Logo" className="w-full h-full object-cover rounded-xl" />
                       </div>
                       <div className="absolute -bottom-4 -right-2 flex gap-2">
                          <label className="w-11 h-11 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center hover:scale-105 transition-all cursor-pointer">
                             <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                             <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </label>
                          <button 
                            type="button" 
                            onClick={syncWithClerkProfile}
                            className="w-11 h-11 bg-[#eca840] text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-105 transition-all"
                            title="Sync with Social Profile"
                          >
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                       </div>
                    </div>
                    
                    <div className="flex-1 space-y-6 w-full">
                       <SettingsInput 
                        label="Store Name" 
                        value={data.name} 
                        onChange={(e: any) => {
                          const val = e.target.value;
                          setData('name', val);
                          window.dispatchEvent(new CustomEvent('artisanal_profile_sync', { 
                            detail: { name: val } 
                          }));
                        }}
                        placeholder="Enter your bakery name" 
                       />

                       <SettingsInput 
                        label="Tagline" 
                        value={data.tagline} 
                        onChange={(e: any) => setData('tagline', e.target.value)}
                        placeholder="Enter a catchy tagline" 
                       />
                    </div>
                 </div>
                 
                 <div className="mt-10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">About the Bakery</p>
                    <textarea 
                      className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm font-medium text-gray-600 focus:ring-1 focus:ring-[#eca840] focus:bg-white transition-all resize-none shadow-inner"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Describe the craftsmanship behind your treats..."
                    ></textarea>
                 </div>
              </div>



              {/* Security & Access Card */}
              <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <div className="text-8xl">🔐</div>
                  </div>

                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl">🛡️</div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 leading-tight">Security & Access</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permanent Password Management</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">New Password</p>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 pr-12 text-sm font-bold text-gray-900 focus:ring-1 focus:ring-[#eca840] focus:bg-white transition-all shadow-inner" 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#eca840] transition-colors"
                          >
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            )}
                          </button>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Confirm Password</p>
                        <div className="relative">
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 pr-12 text-sm font-bold text-gray-900 focus:ring-1 focus:ring-[#eca840] focus:bg-white transition-all shadow-inner" 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#eca840] transition-colors"
                          >
                            {showConfirmPassword ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            )}
                          </button>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <button 
                      type="button" 
                      onClick={handleChangePassword}
                      disabled={isUpdatingPassword}
                      className="w-full md:w-auto px-10 py-5 bg-[#2d2a26] text-white rounded-2xl text-[11px] font-black hover:bg-black transition-all uppercase tracking-widest shadow-xl shadow-gray-900/10 disabled:opacity-50"
                    >
                      {isUpdatingPassword ? 'Updating Security...' : 'Change Password Permanently'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPasswordData({ newPassword: '', confirmPassword: '' })}
                      className="w-full md:w-auto px-10 py-5 bg-gray-50 text-gray-400 rounded-2xl text-[11px] font-black hover:bg-gray-100 transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="mt-8 p-6 bg-orange-50/30 rounded-2xl border border-orange-100/50">
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic">
                      Notice: Changing your password will update your permanent credentials for Kokommerce Artisanal Portal. You will need to use your new password on your next login attempt.
                    </p>
                  </div>
              </div>
           </div>

           {/* Sidebar Controls Area */}
           <div className="space-y-10">
              {/* Operating Hours */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">🕒</div>
                    <h3 className="text-xl font-black text-gray-900">Baking Hours</h3>
                 </div>
                 
                 <div className="space-y-4 mb-10">
                    {operating_hours.map(day => (
                      <div key={day.day} className="flex justify-between items-center group/day">
                         <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover/day:text-gray-900 transition-all font-mono">{day.day.substring(0, 3)}</span>
                         <span className={`text-[12px] font-black ${day.hours === 'CLOSED' ? 'text-red-400' : 'text-gray-900'}`}>{day.hours}</span>
                      </div>
                    ))}
                 </div>
                 
                 <button 
                  type="button"
                  onClick={handleUpdateSchedule}
                  className="w-full py-4 bg-gray-50 rounded-xl text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] hover:bg-gray-100 transition-all border border-gray-100"
                 >
                    Adjust Scheduling
                 </button>
              </div>

              {/* Social Detection Card */}
              <div className="bg-[#2d2a26] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                 <h3 className="text-xl font-black mb-4 relative z-10">Auto-Detect</h3>
                 <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-10 relative z-10">
                    Synchronize your store profile with your login provider for a unified identity.
                 </p>
                 
                 <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#eca840]"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Social Assets</span>
                       </div>
                       <span className="text-[9px] font-bold text-[#eca840] px-2 py-0.5 bg-white/5 rounded-full uppercase italic">DETECTED</span>
                    </div>
                    <button 
                      type="button"
                      onClick={syncWithClerkProfile}
                      className="w-full py-4 bg-[#eca840] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#2d2a26] transition-all"
                    >
                       Connect All Assets
                    </button>
                 </div>
              </div>

              {/* Support CTA */}
              <div className="bg-gray-50/80 border border-gray-100 rounded-[2.5rem] p-10 text-center">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">Need specialist aid?</p>
                 <button type="button" className="flex items-center justify-center gap-3 w-full py-4 text-[#eca840] font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-transform bg-white rounded-xl shadow-sm border border-gray-100">
                    <span className="p-1.5 rounded-lg">💬</span>
                    Contact Support
                 </button>
              </div>
           </div>
        </div>
      </form>

    </SellerLayout>
  );
}

const SettingsInput = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
     <input 
      type="text" 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-1 focus:ring-[#eca840] focus:bg-white transition-all placeholder:text-gray-300 shadow-inner" 
     />
  </div>
);


