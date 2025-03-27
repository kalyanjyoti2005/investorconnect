import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function DeviceAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  // Setup 3D effect on mouse move for the device
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const device = container.querySelector(".device-3d") as HTMLElement;
    
    if (!device) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Calculate the mouse position relative to the center of the container
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calculate the rotation angle based on mouse position (limited to smaller values for subtle effect)
      const rotateY = mouseX * 0.02; // Horizontal rotation
      const rotateX = mouseY * -0.02; // Vertical rotation (inverted)
      
      // Apply the 3D transform
      device.style.transform = `
        perspective(800px)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
        translateZ(10px)
      `;
    };
    
    // Reset the transform when mouse leaves
    const handleMouseLeave = () => {
      device.style.transform = `
        perspective(800px)
        rotateY(0deg)
        rotateX(0deg)
        translateZ(0px)
      `;
    };
    
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        ref={containerRef} 
        className="relative w-full max-w-md mx-auto"
      >
        {/* Device Frame with 3D Effect */}
        <div className="device-3d relative transition-transform duration-200 ease-out">
          {/* Main Device Frame */}
          <div className="relative mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl overflow-hidden border-[14px] border-gray-900">
            {/* Screen Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
            
            {/* App Interface */}
            <div className="absolute inset-0 flex flex-col">
              {/* Status Bar */}
              <div className="h-7 bg-black/20 backdrop-blur-md flex items-center justify-between px-5">
                <div className="text-white text-xs font-medium">9:41</div>
                <div className="flex space-x-1.5">
                  <div className="w-4 h-2.5 bg-white rounded-sm"></div>
                  <div className="w-4 h-2.5 bg-white rounded-sm"></div>
                  <div className="w-4 h-2.5 bg-white rounded-sm"></div>
                </div>
              </div>
              
              {/* App Content */}
              <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-4">
                {/* App Logo & Header */}
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-bold">StartupMatch</div>
                    <div className="text-gray-400 text-xs">Coming Soon</div>
                  </div>
                </div>
                
                {/* App Screen Content */}
                <div className="space-y-4">
                  {/* Dashboard Preview */}
                  <div className="bg-gray-800/50 rounded-2xl p-3 shadow-lg">
                    <div className="text-gray-300 text-xs font-medium mb-2">Your Dashboard</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-700/50 rounded-lg p-2">
                        <div className="text-xs text-gray-400">Investments</div>
                        <div className="text-primary text-lg font-bold">5</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-2">
                        <div className="text-xs text-gray-400">Startups</div>
                        <div className="text-primary text-lg font-bold">12</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Startup List Preview */}
                  <div className="bg-gray-800/50 rounded-2xl p-3 shadow-lg">
                    <div className="text-gray-300 text-xs font-medium mb-2">Trending Startups</div>
                    
                    {/* Startup Card 1 */}
                    <div className="bg-gray-700/30 rounded-lg p-2 mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs">AI</div>
                        <div className="ml-2">
                          <div className="text-white text-xs">TechMind AI</div>
                          <div className="text-gray-400 text-[10px]">Artificial Intelligence</div>
                        </div>
                        <div className="ml-auto">
                          <div className="bg-primary/20 text-primary text-[10px] font-medium rounded-full px-2 py-0.5">Seed</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Startup Card 2 */}
                    <div className="bg-gray-700/30 rounded-lg p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">FT</div>
                        <div className="ml-2">
                          <div className="text-white text-xs">FinSecure</div>
                          <div className="text-gray-400 text-[10px]">FinTech</div>
                        </div>
                        <div className="ml-auto">
                          <div className="bg-primary/20 text-primary text-[10px] font-medium rounded-full px-2 py-0.5">Series A</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification Preview */}
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <div className="text-primary text-xs font-medium">New Match!</div>
                        <div className="text-gray-300 text-[10px]">Your investment profile matches with TechMind AI</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Bar */}
                <div className="mt-auto pt-4">
                  <div className="bg-gray-800/90 rounded-xl p-2 flex justify-around">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div className="text-primary text-[8px] mt-1">Home</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div className="text-gray-400 text-[8px] mt-1">Explore</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="text-gray-400 text-[8px] mt-1">Messages</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-gray-400 text-[8px] mt-1">Profile</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Device Details - Buttons, camera etc. */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-full"></div>
          
          {/* Device Reflections */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
            {/* Top Light Reflection */}
            <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl"></div>
            
            {/* Side Light Reflections */}
            <div className="absolute top-1/4 bottom-1/4 left-0 w-[2px] bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-1/4 bottom-1/4 right-0 w-[2px] bg-gradient-to-l from-white/10 to-transparent"></div>
          </div>
        </div>
        
        {/* Floating Elements Around the Device */}
        <motion.div
          className="absolute -top-10 -right-4 w-24 h-24"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 shadow-lg p-3">
            <div className="w-8 h-2 bg-purple-500/40 rounded-full mb-2"></div>
            <div className="w-12 h-2 bg-indigo-500/40 rounded-full mb-2"></div>
            <div className="w-10 h-2 bg-blue-500/40 rounded-full"></div>
          </div>
        </motion.div>
        
        <motion.div
          className="absolute -bottom-6 -left-10 w-28 h-28"
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 shadow-lg p-3">
            <div className="flex items-center justify-center h-full">
              <div className="text-cyan-500/70 transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="absolute top-1/4 -right-12 w-16 h-16"
          animate={{ 
            y: [0, 8, 0],
            x: [0, -5, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-primary/20 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-center">
            <div className="text-primary/70">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}