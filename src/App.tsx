import React, { useState, useEffect, useRef } from 'react';
import { Heart, Stars, Calendar, Camera, Gift, Music, ChevronRight, X, Moon, Clock, Sparkles, MapPin, Coffee, MessageCircle, Volume2, VolumeX } from 'lucide-react';

// --- Types & Interfaces ---
interface HeartParticle {
  id: number;
  left: number;
  animationDuration: number;
  delay: number;
  size: number;
}

interface StarParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
}

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Memory {
  month: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  imageUrl?: string;
}

// --- Background Floating Hearts Component ---
const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart: HeartParticle = {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: 5 + Math.random() * 5,
        delay: Math.random() * 2,
        size: 10 + Math.random() * 20,
      };
      setHearts((prev) => [...prev, newHeart].slice(-20));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute text-pink-500 opacity-30"
          style={{
            left: `${h.left}%`,
            bottom: '-50px',
            fontSize: `${h.size}px`,
            animation: `floatUp ${h.animationDuration}s linear infinite`,
            animationDelay: `${h.delay}s`
          }}
        >
          <Heart fill="currentColor" />
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};




// --- Twinkling Stars Background ---
const TwinklingStars: React.FC = () => {
  const [stars, setStars] = useState<StarParticle[]>([]);

  useEffect(() => {
    const newStars: StarParticle[] = Array.from({ length: 50 }, () => ({
      id: Math.random(),
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-blue-400 rounded-full opacity-0"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle 3s infinite`,
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(96, 165, 250, 0.8)`
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
};

// --- Time Together Counter Component ---
const TimeCounter: React.FC = () => {
  const [startDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 5);
    return date;
  });

  const [time, setTime] = useState<TimeElapsed>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 text-center my-6">
      {[
        { label: 'Days', val: time.days, color: 'from-pink-500 to-rose-500' },
        { label: 'Hours', val: time.hours, color: 'from-blue-500 to-cyan-500' },
        { label: 'Mins', val: time.minutes, color: 'from-purple-500 to-pink-500' },
        { label: 'Secs', val: time.seconds, color: 'from-cyan-500 to-blue-500' }
      ].map((item, idx) => (
        <div key={idx} className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-br ${item.color} rounded-xl blur opacity-0 group-hover:opacity-60 transition duration-500`}></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm p-4 rounded-xl border border-slate-800/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className={`text-xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-br ${item.color} font-mono`}>{item.val}</div>
            <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mt-1">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentReason, setCurrentReason] = useState<number>(0);
  const [isReasonChanging, setIsReasonChanging] = useState<boolean>(false);

  // 🆕 music state + ref
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const reasons: string[] = [
    "Your smile makes my entire day brighter, every time i feel down I just look at a photo of us together, gets me going .",
    "Every kiss we had, yeah, I love you lips, it's more better if mine overlapped yours😋.",
    "The way you laugh at my terrible jokes, my friends would never, I don't know how do you survive those atrocity.",
    "How safe I feel when I'm with you.",
    "Our late-night conversations about everything during earlier phase, were so special.",
    "You being the most bubbly girl, I love to carry you.",
    "The way you look at me.",
    "Every date we had in these 5 months.",
    "I still remember how you gave me that kinder joy just because I asked you so, jokingly.",
    "The comfort of your presence.",
    "Your kindness and compassion.",
  ];

  const memories: Memory[] = [
    {
      month: 1,
      title: "😍",
      description: "Where it all started",
      icon: <Heart size={32} />,
      gradient: "from-pink-500 to-rose-500",
      imageUrl: "/images/first.jpg"  // Replace with your local image
    },
    {
      month: 2,
      title: "😘",
      description: "Exploring together",
      icon: <MapPin size={32} />,
      gradient: "from-blue-500 to-cyan-500",
      imageUrl: "/images/second.jpg"  // Replace with your local image
    },
    {
      month: 3,
      title: "❤️",
      description: "With my cutie",
      icon: <Gift size={32} />,
      gradient: "from-purple-500 to-pink-500",
      imageUrl: "/images/third last.jpg"  // Replace with your local image
    },
    {
      month: 4,
      title: "😋",
      description: "Simple pleasures",
      icon: <Coffee size={32} />,
      gradient: "from-amber-500 to-orange-500",
      imageUrl: "/images/secon last.jpg"  // Replace with your local image
    },
    {
      month: 5,
      title: "🥰",
      description: "Just loveing you",
      icon: <Music size={32} />,
      gradient: "from-indigo-500 to-purple-500",
      imageUrl: "/images/last.jpg"  // Replace with your local image
    },
    {
      month: 5,
      title: "🤩",
      description: "My Heart Beats for You",
      icon: <Music size={32} />,
      gradient: "from-indigo-500 to-purple-500",
      imageUrl: "/images/best.jpg"  // Replace with your local image
    }
  ];

  const nextReason = () => {
    setIsReasonChanging(true);
    setTimeout(() => {
      setCurrentReason((prev) => (prev + 1) % reasons.length);
      setIsReasonChanging(false);
    }, 300);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Auto-play music when page opens (after user interaction)
  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay was prevented, user needs to click play button
        console.log('Autoplay prevented - user must click to play music');
      });
    }
  }, [isOpen]);
  // Intro Screen (The "Card") - Dark Theme
  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <FloatingHearts />
        <TwinklingStars />
        
        {/* Ambient Glow Effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer group relative z-10 animate-float-gentle"
        >
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
          
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 rounded-2xl text-center max-w-sm border border-slate-700/50 shadow-2xl">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-pink-500 to-rose-500 border-2 border-pink-400 text-white p-4 rounded-full shadow-lg shadow-pink-500/50 animate-bounce-slow">
              <Heart fill="currentColor" size={32} />
            </div>
            
            <div className="mt-6 mb-2">
              <Sparkles className="inline-block text-yellow-400 animate-pulse" size={20} />
            </div>
            <h1 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2 tracking-wide">For You</h1>
            <p className="text-slate-400 mb-8 font-light">Something special awaits...</p>
            
            <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-pink-500 hover:to-purple-500 transition-all shadow-[0_0_30px_rgba(219,39,119,0.5)] flex items-center justify-center gap-2 w-full group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(219,39,119,0.7)]">
              Open Your Gift <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-slate-500 text-xs uppercase tracking-widest z-10 animate-pulse">Tap to unlock</p>
        
        <style>{`
          @keyframes float-gentle {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0) translateX(-50%); }
            50% { transform: translateY(-10px) translateX(-50%); }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-float-gentle {
            animation: float-gentle 3s ease-in-out infinite;
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </div>
    );
  }

  // Main Content (After Opening)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 font-sans selection:bg-pink-500/30 selection:text-pink-200 overflow-x-hidden pb-12">
      <FloatingHearts />
      <TwinklingStars />
      
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            {/* Background Music */}
      <audio 
        ref={audioRef} 
        loop 
        src="/audio/song.mp3"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Floating Music Control Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-110 group"
        aria-label="Toggle music"
      >
        <div className="relative">
          {isPlaying ? (
            <Volume2 size={24} className="animate-pulse" />
          ) : (
            <VolumeX size={24} />
          )}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          )}
        </div>
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isPlaying ? 'Pause Music' : 'Play Music'}
        </span>
      </button>
      
      {/* Navigation / Header */}
      <nav className="p-4 flex justify-between items-center bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800/50 shadow-lg">
        <div className="flex items-center gap-2 text-pink-500 text-lg">
          <div className="relative">
            <Heart fill="currentColor" size={24} className="animate-pulse" />
            <div className="absolute inset-0 animate-ping opacity-30">
              <Heart fill="currentColor" size={24} />
            </div>
          </div>
          <span className="text-white">Us</span>
        </div>
        <div className="text-sm bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-4 py-1.5 rounded-full border border-pink-500/30 backdrop-blur-sm">
          <span className="text-pink-400">5 Months Strong</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-10 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-6 border border-blue-500/30 backdrop-blur-sm">
            <Stars size={14} className="animate-spin-slow" /> Anniversary Special
          </div>
          <h1 className="text-4xl md:text-7xl mb-6 leading-tight">
            <span className="block text-white">5 Months of</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 drop-shadow-[0_0_30px_rgba(236,72,153,0.6)] animate-gradient-text">
              Pure Magic
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
            In a world of black and white, you are my favorite color.
          </p>
        </div>

        {/* Counter Section */}
        <div className="relative group mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-slate-900/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/50 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-6 text-blue-400 uppercase tracking-widest text-sm">
              <Clock size={16} className="animate-pulse" />
              <span>Time Since We Started</span>
            </div>
            <TimeCounter />
          </div>
        </div>

        {/* Reasons Section - Enhanced */}
        <div className="relative group mb-12">
          {/* Animated Gradient Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500 animate-gradient"></div>
          
          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 md:p-12 text-center border border-slate-700/50 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
            
            <div className="flex items-center justify-center gap-3 mb-8">
              <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
              <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Why I Love You
              </h2>
              <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
            </div>
            
            <div className="min-h-[140px] flex items-center justify-center py-6 px-4">
              <p className={`text-xl md:text-3xl font-serif italic text-slate-100 transition-all duration-300 ${isReasonChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                "{reasons[currentReason]}"
              </p>
            </div>
            
            <button
              onClick={nextReason}
              className="mt-6 bg-gradient-to-r from-pink-600/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 rounded-full text-sm transition-all shadow-lg hover:shadow-pink-500/50 hover:scale-105 border border-pink-500/30"
            >
              Tell me another reason ✨
            </button>
            
            <div className="mt-6 text-xs text-slate-500">
              {currentReason + 1} of {reasons.length}
            </div>
          </div>
        </div>

        {/* Memories Grid - Enhanced */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8 text-white text-xl border-l-4 border-pink-500 pl-4">
            <Camera className="text-pink-500" />
            <span>Our Journey Together</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memories.map((memory, idx) => (
              <div 
                key={idx} 
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${memory.gradient} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500`}></div>
                
                <div className="relative aspect-square bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
                  {/* Background Image */}
                  {memory.imageUrl && (
                    <img 
                      src={memory.imageUrl} 
                      alt={memory.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
                    />
                  )}
                  
                  {/* Icon Background - Only show if no image */}
                  {!memory.imageUrl && (
                    <div className={`absolute inset-0 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br ${memory.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:scale-110`}>
                      {memory.icon}
                    </div>
                  )}
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-500"></div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-br ${memory.gradient} mb-4 transform group-hover:scale-110 transition-transform duration-500`}>
                      {memory.icon}
                    </div>
                    <h3 className="text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{memory.title}</h3>
                    <p className="text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">{memory.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Letter Section - Enhanced */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl p-8 md:p-12 rounded-2xl border-l-4 border-pink-500 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">A Note For You</h2>
              <Sparkles className="text-yellow-400" size={20} />
            </div>
            <div className="prose prose-invert text-slate-300 leading-relaxed space-y-4 max-w-none">
              <p>
                It&apos;s hard to believe it&apos;s already been 5 months. Time flies when life feels this right.
              </p>
              <p>
                Thank you for being my partner, my best friend, and my calm in the chaos. You&apos;ve made these past months the happiest I&apos;ve been. I appreciate every little thing you do.
              </p>
              <p>
                Hope you succeded in all your endeavors. I&apos;ll be right here, cheering you on and loving you every step of the way.
              </p>
              <p>
                Here&apos;s to us, to 5 months, and to the infinite moments waiting for us in the future.
              </p>
              <p className="font-serif text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 pt-4">
                I love you. ❤️
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-600 py-12 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart size={16} className="text-pink-500 fill-pink-500" />
          <Heart size={12} className="text-blue-500 fill-blue-500" />
        </div>
        <p>Made with 💙 & 🩷 for our 5th Month Anniversary</p>
      </footer>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 3s ease infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}