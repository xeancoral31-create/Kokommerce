import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const Flame = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 3 5.5 5 5.5 8a5 5 0 01-1.343 3.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.657 14.657L11.657 15.657a2 2 0 01-2.828 0 2 2 0 010-2.828l1-1z" /></svg>
);

const Leaf = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 20l-1-1m2.122-11.878l.707.707a2 2 0 102.828-2.828l-.707-.707M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" /></svg>
);

export default function About() {
  const [activeStory, setActiveStory] = React.useState(0);
  
  const stories = [
    {
      title: "The Kakanin Legacy",
      subtitle: "TRADITION REIMAGINED",
      description: "Rooted in grandmother's provincial hearth, we honor the slow-steamed traditions of the past. Our Bibingka isn't just a recipe; it's a preserved heritage, bringing the soul of Filipino flavors to the modern high-end table.",
      image: "/images/about/kakanin.png",
      tag: "Heritage #001",
      origin: "Butuan City, 1978"
    },
    {
      title: "Artisanal Breads",
      subtitle: "THE DAILY HEARTH",
      description: "Our Pandesal is a cloud-like revelation engineered through 72-hour slow cold fermentation. Stone-oven baked to achieve the perfect balance between a golden, salted crust and a soul-warming interior.",
      image: "/images/about/bread.png",
      tag: "Vault #002",
      origin: "Master Baker's Reserve"
    },
    {
      title: "The Muscovado Secret",
      subtitle: "ISLAND HARVEST",
      description: "A dark, complex treasure directly sourced from the volcanic foothills of Negros. Our raw muscovado sugar provides the deep, umami-rich sweetness that defines our signature cookies—a masterclass in local terroir and ancestral precision.",
      image: "/images/about/muscovado.png",
      tag: "Origin #003",
      origin: "Negros Occidental"
    },
    {
      title: "Cakes of Heritage",
      subtitle: "A CELEBRATION FOREVER",
      description: "From the architectural height of our Royal Ube sponge to the deep intensity of Tablea Ganache, our cakes are monumental tributes to Filipino artistry. Every milestone deserves a hand-crafted masterpiece.",
      image: "/images/about/cake.png",
      tag: "Design #004",
      origin: "Signature Collection"
    }
  ];

  /* Heritage Stamp Component */
  const HeritageStamp = ({ text }: { text: string }) => (
    <div className="absolute top-10 right-10 z-20 w-32 h-32 flex items-center justify-center">
        <div className="relative w-full h-full animate-[spin_20s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                <text className="text-[8px] font-black uppercase tracking-[0.2em] fill-[#eca840]/60">
                    <textPath xlinkHref="#circlePath">
                        Kokommerce Artisanal Vault • Original Recipe • {text} •
                    </textPath>
                </text>
            </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center uppercase font-black text-[10px] text-[#eca840] tracking-tighter">
            EST. 1978
        </div>
        <div className="absolute inset-0 rounded-full border border-dashed border-[#eca840]/20 scale-125"></div>
    </div>
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#fdfcfb] dark:bg-gray-950 transition-colors duration-500 selection:bg-[#eca840]/20">
      <Navbar />
      <main className="flex-grow">

        {/* Hero Section with Enhanced Transitions */}
        <section className="relative h-[800px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
              {stories.map((story, idx) => (
                  <img 
                      key={idx}
                      src={story.image}
                      alt={story.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2500ms] cubic-bezier(0.4, 0, 0.2, 1) ${
                          idx === activeStory ? "opacity-100 scale-110 translate-x-0" : "opacity-0 scale-100 translate-x-12 pointer-events-none"
                      }`}
                  />
              ))}
              <div className="absolute inset-0 bg-[#1a1816]/70 backdrop-blur-[2px]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a1816]/40 via-transparent to-[#fdfcfb]"></div>
          </div>
          
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
             <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-[#eca840] mb-8 shadow-2xl">
               <span className="w-1.5 h-1.5 rounded-full bg-[#eca840] animate-pulse"></span>
               Our Heritage Vault
             </div>
             <h1 className="text-7xl md:text-[10rem] font-black mb-8 leading-[0.8] text-white tracking-tighter italic">
               Artisanship <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eca840] to-[#f5d19a]">Redefined.</span>
             </h1>
             <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed opacity-60 italic tracking-tight">
               Preserving the soul of Filipino baking tradition through meticulous, 
               no-compromise craft and modern heritage.
             </p>
          </div>
        </section>

        {/* Story Section with Refined Slide Motion */}
        <section className="px-6 md:px-12 py-40 bg-[#fdfcfb] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2d2a26 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="w-full lg:w-1/2 relative">
                 <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden relative shadow-[0_80px_120px_rgba(0,0,0,0.08)] z-10 bg-white p-4">
                    <div className="w-full h-full rounded-[3rem] overflow-hidden relative bg-gray-50 border border-gray-100">
                      {stories.map((story, idx) => (
                        <img 
                            key={idx}
                            src={story.image}
                            alt={story.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1800ms] cubic-bezier(0.19, 1, 0.22, 1) ${
                                idx === activeStory ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-110 translate-x-20 pointer-events-none"
                            }`}
                        />
                      ))}
                      <div className="absolute inset-0 z-20 pointer-events-none">
                        <div key={activeStory} className="animate-in fade-in zoom-in-125 duration-1000">
                            <HeritageStamp text={stories[activeStory].origin} />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                 </div>
                 <div className="absolute -top-20 -left-20 text-[280px] font-black text-gray-100/80 -z-10 select-none leading-none tracking-tighter">
                    0{activeStory + 1}
                 </div>
                 <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-[#eca840]/10 rounded-full blur-[100px] -z-10"></div>
              </div>
              
              <div className="w-full lg:w-1/2">
                  <div key={activeStory} className="transition-all duration-1000 animate-[fadeInSlide_1s_ease-out]">
                      <div className="flex items-center gap-4 mb-6">
                          <span className="text-[11px] font-black text-[#eca840]/40 uppercase tracking-[0.3em] italic">{stories[activeStory].tag}</span>
                          <div className="w-8 h-[1px] bg-[#eca840]/20"></div>
                          <span className="text-[11px] font-black text-[#eca840] uppercase tracking-[0.5em] italic">{stories[activeStory].subtitle}</span>
                      </div>
                      <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-10 tracking-tighter leading-none">
                          {stories[activeStory].title}
                      </h2>
                      <div className="w-24 h-1.5 bg-[#eca840]/10 mb-10 rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 bg-[#eca840]/40 w-full"></div>
                          <div 
                              className="absolute inset-y-0 left-0 bg-[#eca840] origin-left animate-[progress_6s_linear_infinite]"
                      style={{ width: '100%' }}
                          ></div>
                      </div>
                      <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed text-2xl font-medium">
                          <p className="italic underline decoration-[#eca840]/30 underline-offset-[12px] decoration-2">"{stories[activeStory].description}"</p>
                      </div>

                      <div className="mt-20 flex items-center gap-6">
                          <span className="text-[11px] font-black text-[#2d2a26]/40 uppercase tracking-[0.3em]">Lifecycle</span>
                          <div className="flex gap-3">
                              {stories.map((_, idx) => (
                                  <button 
                                      key={idx}
                                      onClick={() => setActiveStory(idx)}
                                      className={`h-2.5 rounded-full transition-all duration-500 relative overflow-hidden ${
                                          idx === activeStory ? 'w-20 bg-gray-900 dark:bg-[#eca840]' : 'w-5 bg-gray-200 dark:bg-gray-800 hover:bg-[#eca840]/40'
                                      }`}
                                  >
                                      {idx === activeStory && (
                                          <div className="absolute inset-0 bg-white/20 origin-left animate-[progress_6s_linear_infinite]" />
                                      )}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="px-6 md:px-12 py-40 bg-[#1a1816] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#eca840]/10 rounded-full blur-[150px] -z-0"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px] -z-0"></div>

          <div className="container mx-auto relative z-10">
             <div className="text-center mb-32">
                <span className="text-[#eca840] text-[11px] font-black uppercase tracking-[0.6em] mb-6 block opacity-80 italic">The Artisanal Philosophy</span>
                <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter italic">Process Center.</h2>
                <div className="w-32 h-1 bg-white/10 mx-auto rounded-full mb-10 overflow-hidden">
                    <div className="h-full bg-[#eca840]/40 w-1/2 mx-auto"></div>
                </div>
                <p className="text-gray-400 max-w-3xl mx-auto font-medium text-xl leading-relaxed italic opacity-90">
                  No shortcuts. No compromises. Just pure, traditional craft, 
                  from the first knead in the early dawn to the final golden bake.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="md:col-span-2 row-span-2 group relative rounded-[3rem] overflow-hidden min-h-[600px] border border-white/5 shadow-2xl">
                   <img src="/images/about/sourcing.png" alt="Sourcing" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#1a1816] via-[#1a1816]/50 to-transparent"></div>
                   <div className="absolute bottom-0 left-0 p-16 w-full">
                      <div className="text-[#eca840] text-[11px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                          <span className="w-6 h-px bg-[#eca840]"></span>
                          Heirloom Standards
                      </div>
                      <h3 className="text-5xl font-black text-white mb-6 tracking-tight italic">Sourcing the Soul</h3>
                      <p className="text-gray-300 font-medium leading-relaxed max-w-md text-lg italic opacity-80">
                          We partner with heritage farmers to preserve heirloom rice varieties and source volcanic muscovado sugar.
                      </p>
                   </div>
                </div>

                <div className="bg-[#eca840] rounded-[2.5rem] p-12 text-[#1a1816] flex flex-col justify-between hover:shadow-[0_30px_60px_rgba(236,168,64,0.4)] transition-all duration-700 hover:-translate-y-3 group cursor-default">
                   <div className="w-20 h-20 rounded-3xl bg-white/30 backdrop-blur-xl flex items-center justify-center mb-12 shadow-inner transition-transform group-hover:rotate-[15deg]">
                      <Clock className="w-10 h-10" />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase leading-none italic">Slow<br />Maturation</h3>
                      <p className="text-[#1a1816]/70 text-[10px] font-black uppercase tracking-[0.25em] leading-loose">72 Hour Ageing Rhythms</p>
                   </div>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 flex flex-col justify-center text-center group hover:bg-white/10 transition-all duration-700 hover:border-white/20">
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 text-[#eca840] group-hover:scale-110 transition-transform shadow-xl">
                      <Flame className="w-8 h-8" />
                   </div>
                   <h4 className="text-xl font-black text-white mb-3 tracking-tight uppercase italic">Stone Hub</h4>
                   <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.3em]">Ceramic Retention</p>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 flex flex-col justify-center text-center group hover:bg-white/10 transition-all duration-700 hover:border-white/20">
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 text-green-500 group-hover:scale-110 transition-transform shadow-xl">
                      <Leaf className="w-8 h-8" />
                   </div>
                   <h4 className="text-xl font-black text-white mb-3 tracking-tight uppercase italic">Circle Vitality</h4>
                   <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.3em]">Compostable Logic</p>
                </div>
             </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
