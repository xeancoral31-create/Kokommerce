import React from "react";

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const Flame = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 3 5.5 5 5.5 8a5 5 0 01-1.343 3.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.657 14.657L11.657 15.657a2 2 0 01-2.828 0 2 2 0 010-2.828l1-1z" /></svg>
);

const Leaf = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 20l-1-1m2.122-11.878l.707.707a2 2 0 102.828-2.828l-.707-.707M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" /></svg>
);

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function About() {
  const [activeStory, setActiveStory] = React.useState(0);
  
  const stories = [
    {
      title: "The Kakanin Legacy",
      subtitle: "TRADITION REIMAGINED",
      description: "Born in a small provincial kitchen, Kokommerce began with a grandmother's recipe for Bibingka. We honor the slow-steamed traditions of the past, bringing Filipino heritage to the global stage with every sticky, sweet bite.",
      image: "/images/about/kakanin.png",
    },
    {
      title: "Artisanal Breads",
      subtitle: "THE DAILY HEARTH",
      description: "Our Pandesal Artisano is a cloud-like revelation. Using 72-hour slow fermentation and stone-oven baking, we've perfected the balance between a golden, salted crust and a soul-warming interior.",
      image: "/images/about/breads.png",
    },
    {
      title: "The Muscovado Secret",
      subtitle: "ISLAND HARVEST",
      description: "We traveled the islands to find the perfect raw muscovado sugar for our cookies. Each batch is a tribute to local farmers and the rich, complex sweetness of the volcanic soil of Negros.",
      image: "/images/about/cookies.png",
    },
    {
      title: "Cakes of Heritage",
      subtitle: "A CELEBRATION FOREVER",
      description: "From the deep darkness of Tablea Ganache to the royal purple of Ube sponge, our cakes are architectural tributes to Filipino flavors. We believe every milestone deserves a hand-crafted masterpiece.",
      image: "/images/about/cakes.png",
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <Navbar />
      <main className="flex-grow">

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <img 
            src={stories[activeStory].image}
            alt={stories[activeStory].title}
            className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white px-6">
           <span className="inline-block px-4 py-1.5 rounded-full bg-[#eca840]/20 backdrop-blur-md border border-[#eca840]/30 text-xs font-bold uppercase tracking-widest mb-6">
             The Kokommerce Story
           </span>
           <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
             Legacy in<br />
             <span className="text-[#eca840]">Every Ingredient.</span>
           </h1>
           <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
             We don't just bake; we preserve stories of heritage and craftsmanship through our artisanal delicacies.
           </p>
        </div>
      </section>

      {/* Our Story Section - Dynamic Slideshow */}
      <section className="px-6 md:px-12 py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 min-h-[500px]">
            <div className="w-full lg:w-1/2 relative">
               <div className="aspect-[4/5] rounded-[40px] overflow-hidden relative shadow-2xl z-10 h-[600px] bg-gray-100">
                  <img 
                    src={stories[activeStory].image}
                    alt={stories[activeStory].title}
                    className="w-full h-full object-cover transition-opacity duration-1000"
                  />
               </div>
               <div className="absolute -top-12 -left-12 text-[150px] font-black text-gray-50 -z-10 select-none">
                  0{activeStory + 1}
               </div>
               <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#eca840]/10 rounded-[40px] -z-10"></div>
            </div>
            
            <div className="w-full lg:w-1/2">
                <div key={activeStory} className="animate-in fade-in slide-in-from-right-8 duration-1000">
                    <h2 className="text-5xl font-bold text-gray-900 mb-2">{stories[activeStory].title}</h2>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[2px] w-12 bg-[#eca840]"></div>
                        <span className="text-[#eca840] font-bold text-xs uppercase tracking-widest">{stories[activeStory].subtitle}</span>
                    </div>
                    <div className="space-y-6 text-gray-600 leading-relaxed text-xl font-light">
                        <p>{stories[activeStory].description}</p>
                    </div>

                    <div className="mt-12 flex gap-3">
                        {stories.map((_, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveStory(idx)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeStory ? 'w-12 bg-[#eca840]' : 'w-4 bg-gray-200 hover:bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>


      {/* The Artisanal Process */}
      <section className="px-6 md:px-12 py-24">
        <div className="container mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">The Artisanal Process</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                No shortcuts. No compromises. Just pure, traditional craft, from the first knead to the final bake.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 row-span-2 bg-gray-100 rounded-3xl overflow-hidden relative min-h-[400px]">
                 <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop" alt="Sourcing" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">Sourcing the Soul</h3>
                    <p className="text-sm text-gray-200">We partner with local farmers for our heirloom rice and use highest quality butter for our pastries.</p>
                 </div>
              </div>

              <div className="bg-[#eca840] rounded-3xl overflow-hidden text-white flex flex-col relative group hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300">
                 <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop" alt="Fermentation" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
                 <div className="relative p-8 flex flex-col justify-between h-full z-10">
                    <div className="bg-white/20 rounded-2xl w-12 h-12 flex items-center justify-center mb-6">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Slow Fermentation</h3>
                        <p className="text-xs text-white/80 line-clamp-2">Our dough rests for 72 hours to develop a complex, deep flavor profile.</p>
                    </div>
                 </div>
              </div>

               <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm group">
                  <div className="h-24 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1544333303-5775aa666d7e?q=80&w=400&auto=format&fit=crop" alt="Oven" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="bg-orange-50 rounded-2xl w-10 h-10 flex items-center justify-center mb-3 text-[#eca840]">
                        <Flame className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Stone Oven Bake</h4>
                    <p className="text-[10px] text-gray-500">Golden crust every time.</p>
                  </div>
               </div>

               <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm group">
                  <div className="h-24 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1444312645910-ffa973656eba?q=80&w=400&auto=format&fit=crop" alt="Sustainable" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="bg-green-50 rounded-2xl w-10 h-10 flex items-center justify-center mb-3 text-green-600">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Zero Waste</h4>
                    <p className="text-[10px] text-gray-500">Sustainable baking.</p>
                  </div>
               </div>
           </div>
        </div>
      </section>


      </main>
      <Footer />
    </div>
  );
}


