import React, { useState, useEffect, useMemo } from 'react';
import { MEZMURS } from '../data/mezmurData';
import { Theme } from '../types';
import {
  Search,
  Moon,
  Sun,
  ChevronRight,
  Info,
  BookOpen,
  Copy,
  Check,
  Type as TypeIcon,
  Plus,
  Minus,
  ArrowLeft,
  Sparkles,
  Music,
  Heart,
  X,
  Download,
  Clock,
  Bookmark,
  Shuffle,
  Home,
  Menu
} from 'lucide-react';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [theme, setTheme] = useState<Theme>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT
  );
  const [fontSize, setFontSize] = useState<number>(20);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sidebarQuery, setSidebarQuery] = useState('');

  const filteredMezmurs = useMemo(() => {
    let result = [...MEZMURS];

    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const numQuery = parseInt(query);
      const searchTerms = query.split(/\s+/);

      result = result.filter(m => {
        if (!isNaN(numQuery) && m.id === numQuery) return true;
        const content = (m.title + ' ' + m.lyrics.join(' ')).toLowerCase();
        return searchTerms.every(term => content.includes(term));
      });
    }

    if (showFavoritesOnly) {
      result = result.filter(m => favorites.includes(m.id));
    }

    result.sort((a, b) => a.id - b.id);
    return result;
  }, [searchQuery, showFavoritesOnly, favorites]);

  const currentMezmur = useMemo(() => {
    return MEZMURS.find(m => m.id === selectedId) || null;
  }, [selectedId]);

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const sidebarMezmurs = useMemo(() => {
    const query = sidebarQuery.toLowerCase().trim();
    if (!query) return MEZMURS;

    const numQuery = parseInt(query);
    const searchTerms = query.split(/\s+/);

    return MEZMURS.filter(m => {
      if (!isNaN(numQuery) && m.id === numQuery) return true;
      const content = (m.title + ' ' + m.lyrics.join(' ')).toLowerCase();
      return searchTerms.every(term => content.includes(term));
    });
  }, [sidebarQuery]);

  const randomMezmur = () => {
    const randomId = Math.floor(Math.random() * MEZMURS.length) + 1;
    handleSelectMezmur(randomId);
  };

  const exportFavorites = () => {
    const favMezmurs = MEZMURS.filter(m => favorites.includes(m.id));
    const text = favMezmurs.map(m => `${m.id}. ${m.title}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorite-mezmurs.txt';
    a.click();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setFontSize(prev => prev > 18 ? 18 : prev);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectMezmur = (id: number) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = () => {
    if (!currentMezmur) return;
    const text = `${currentMezmur.title}\n\n${currentMezmur.lyrics.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = theme === Theme.DARK;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-2xl border-b transition-all duration-500 ${isDark
        ? 'bg-[#0a0a0f]/80 border-white/5'
        : 'bg-[#fbf6ea]/85 border-amber-200/60'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-4">
              {selectedId !== null && (
                <button
                  onClick={() => setSelectedId(null)}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${isDark
                    ? 'hover:bg-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-black/5 text-black/40 hover:text-black'
                    }`}
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2.5 rounded-2xl overflow-hidden ${isDark
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20'
                  : 'bg-gradient-to-br from-amber-100/70 to-yellow-50/60 border border-amber-200/60'
                  }`}>
                  <img src="/img/images.jpeg" alt="Bole Debre Salem" className="w-5 h-5 sm:w-7 sm:h-7 object-cover rounded-lg" />
                </div>
                <div>
                  <h1 className={`heading-font text-lg sm:text-xl 
                    font-bold tracking-tight ${isDark ? 'text-amber-50' : 'text-stone-900'}`}>
                    የጥምቀት  <span className={isDark ? "text-amber-500" : "text-amber-800"}>
                      መዝሙሮች ስብስብ</span>
                  </h1>
                  <p className={`text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-medium ${isDark ? 'text-amber-200/60' : 'text-stone-600'}`}>
                    ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Home Button - when in reading view */}
              {selectedId !== null && (
                <button
                  onClick={() => setSelectedId(null)}
                  className={`hidden sm:flex p-2 rounded-xl transition-all duration-300 ${isDark
                    ? 'hover:bg-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-black/5 text-black/40 hover:text-black'
                    }`}
                >
                  <Home size={18} />
                </button>
              )}

              <button
                onClick={randomMezmur}
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${isDark
                  ? 'hover:bg-white/10 text-white/60 hover:text-white'
                  : 'hover:bg-black/5 text-black/40 hover:text-black'
                  }`}
                title="Random Hymn"
              >
                <Shuffle size={16} />
              </button>

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${showFavoritesOnly
                  ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-900'
                  : isDark ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'
                  }`}
                title="Favorites"
              >
                <Bookmark size={16} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-2xl transition-all duration-500 group ${isDark
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/10 hover:from-amber-500/30 hover:to-orange-600/20 border border-amber-500/20'
                  : 'bg-[#fffaf0] hover:bg-amber-50 border border-amber-200 shadow-sm'
                  }`}>
                {isDark ? (
                  <Sun size={16} className="text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
                ) : (
                  <Moon size={16} className="text-amber-900 group-hover:-rotate-12 transition-transform duration-500" />
                )}
              </button>

              {/* Burger Menu for reading view on mobile */}
              {selectedId !== null && (
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${isDark
                    ? 'hover:bg-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-black/5 text-black/40 hover:text-black'
                    }`}
                >
                  <Menu size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {selectedId === null ? (
          /* Collection View */
          <div className="space-y-6 sm:space-y-10">

            {/* Search Section */}
            <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <div className={`flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 rounded-[2rem] border transition-all duration-500 ${isDark
                  ? 'bg-slate-800/40 border-slate-700/50 focus-within:border-amber-500/50 focus-within:ring-4 focus-within:ring-amber-500/10'
                  : 'bg-white border-amber-200/60 shadow-xl shadow-amber-900/5 focus-within:border-amber-500/40 focus-within:ring-4 focus-within:ring-amber-500/5'
                  }`}>
                  <Search size={16} className={isDark ? 'text-white/40' : 'text-stone-500'} />
                  <input
                    type="text"
                    placeholder="በመዝሙር ስንኝ ፣ በቁጥር ወይም በ መዝሙር ርዕስ ይፈልጉ.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm sm:text-base lg:text-lg ${isDark
                      ? 'text-white placeholder:text-white/30'
                      : 'text-stone-900 placeholder:text-stone-500'
                      }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`p-1 sm:p-2 rounded-xl transition-colors ${isDark
                        ? 'hover:bg-white/10 text-white/40'
                        : 'hover:bg-amber-50 text-stone-500'
                        }`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {showFavoritesOnly && (
                <div className="flex flex-wrap gap-2">
                  {showFavoritesOnly && (
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isDark
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                      <Bookmark size={12} />
                      Favorites
                      <button
                        onClick={() => setShowFavoritesOnly(false)}
                        className="ml-1 hover:opacity-70"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Header */}
            <div className="flex items-end justify-center">
              <div className="w-full">
                <h2 className={`heading-font text-center text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  የጥምቀት መዝሙሮች
                </h2>
              </div>
            </div>

            {/* Grid */}
            {filteredMezmurs.length === 0 ? (
              <div className={`col-span-full py-16 text-center ethiopic-font ${isDark ? 'text-white/40' : 'text-stone-600'}`}>
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-medium mb-2">ውጤት አልተገኘም</p>
                <p className="text-sm">እባክዎ የፍለጋ ቃሉን ያስተካክሉ እና እንደገና ይሞክሩ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {filteredMezmurs.map((mezmur, index) => (
                  <div
                    key={mezmur.id}
                    onClick={() => handleSelectMezmur(mezmur.id)}
                    className={`group cursor-pointer relative overflow-hidden transition-all duration-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:-translate-y-2 hover:shadow-2xl ${isDark
                      ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-amber-500/30 hover:shadow-amber-500/10'
                      : 'bg-[#fffaf0]/90 backdrop-blur-sm border border-amber-200/70 hover:border-amber-400/80 hover:shadow-amber-100/60'
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isDark
                      ? 'bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5'
                      : 'bg-gradient-to-br from-amber-50/50 via-transparent to-yellow-50/30'
                      }`} />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(mezmur.id);
                      }}
                      className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${favorites.includes(mezmur.id)
                        ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-900 border border-amber-200/70'
                        : isDark ? 'bg-white/10 text-white/40 hover:text-white hover:bg-white/20' : 'bg-[#fffaf0]/85 text-stone-500 hover:text-stone-800 hover:bg-[#fffaf0] border border-amber-200/60'
                        }`}
                    >
                      <Bookmark size={14} fill={favorites.includes(mezmur.id) ? 'currentColor' : 'none'} />
                    </button>

                    {/* Number */}
                    <div className="relative z-10 mb-4 sm:mb-6">
                      <span className={`font-bold tracking-tight transition-all duration-300 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl ${isDark
                        ? 'text-white/10 group-hover:text-amber-500/40'
                        : 'text-amber-200/60 group-hover:text-amber-600/20'
                        }`}>
                        {String(mezmur.id).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="relative z-10">
                      <h3 className={`heading-font font-bold ethiopic-font leading-tight transition-colors text-lg sm:text-xl lg:text-2xl ${isDark
                        ? 'text-white group-hover:text-amber-100'
                        : 'text-stone-900'
                        }`}>
                        {mezmur.title}
                      </h3>
                      <p className={`mt-2 sm:mt-3 text-sm line-clamp-2 ${isDark ? 'text-white/60' : 'text-stone-600'}`}>
                        {mezmur.lyrics[0]}...
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 transition-all duration-300 ${isDark
                      ? 'text-white/20 group-hover:text-amber-400'
                      : 'text-stone-300 group-hover:text-amber-800'
                      } opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0`}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Reading View with Sidebar */
          <div className="animate-fadeIn flex gap-8">

            {/* Mobile Sidebar Overlay */}
            <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${showMobileSidebar ? 'visible opacity-100' : 'invisible opacity-0'}`}>
              <div className={`absolute inset-0 backdrop-blur-sm bg-black/40 transition-opacity duration-500 ${showMobileSidebar ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMobileSidebar(false)} />
              <aside className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${showMobileSidebar ? 'translate-x-0 shadow-2xl' : 'translate-x-full'} ${isDark
                ? 'bg-[#0f172a] border-l border-white/10'
                : 'bg-white border-l border-amber-100'
                }`}>
                {/* Mobile Sidebar Header */}
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/5' : 'border-amber-100/50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                      <BookOpen size={18} className={isDark ? 'text-amber-400' : 'text-amber-700'} />
                    </div>
                    <h3 className={`font-bold text-sm tracking-widest uppercase ${isDark ? 'text-white/90' : 'text-stone-800'}`}>
                      ሁሉም መዝሙራት
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-black/5 text-stone-500'}`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="relative">
                    <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-stone-400'}`} />
                    <input
                      type="text"
                      value={sidebarQuery}
                      onChange={(e) => setSidebarQuery(e.target.value)}
                      placeholder="ለመፈለግ ይጻፉ..."
                      className={`w-full pl-10 pr-10 py-3 rounded-2xl outline-none text-sm transition-all ${isDark
                        ? 'bg-white/5 border border-white/10 focus:border-amber-500/50 text-white'
                        : 'bg-amber-50/50 border border-amber-100 focus:border-amber-500/50 text-stone-900'
                        }`}
                    />
                  </div>
                </div>

                {/* Mobile Sidebar List */}
                <div className="overflow-y-auto h-[calc(100vh-10rem)] p-4 custom-scrollbar">
                  {sidebarMezmurs.map((mezmur) => (
                    <button
                      key={mezmur.id}
                      onClick={() => {
                        handleSelectMezmur(mezmur.id);
                        setShowMobileSidebar(false);
                      }}
                      className={`w-full text-left px-4 py-4 rounded-2xl mb-2 transition-all flex items-center gap-4 ${selectedId === mezmur.id
                        ? isDark
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                          : 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                        : isDark
                          ? 'hover:bg-white/5 text-white/70'
                          : 'hover:bg-amber-50 text-stone-600'
                        }`}
                    >
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg ${selectedId === mezmur.id ? 'bg-white/20' : isDark ? 'bg-white/5' : 'bg-stone-100'}`}>
                        {mezmur.id}
                      </span>
                      <span className="flex-1 truncate font-medium ethiopic-font">
                        {mezmur.title}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>
            </div>

            {/* Sidebar - Hymn List */}
            <aside className={`hidden lg:block w-80 flex-shrink-0 sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-hidden rounded-3xl ${isDark
              ? 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10'
              : 'bg-[#fffaf0]/90 backdrop-blur-xl border border-amber-200/70 shadow-xl shadow-amber-100/30'
              }`}>
              {/* Sidebar Header */}
              <div className={`p-5 border-b ${isDark ? 'border-white/10' : 'border-amber-200/60'}`}>
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className={isDark ? 'text-amber-400' : 'text-amber-800'} />
                  <h3 className={`heading-font text-sm font-bold uppercase tracking-[0.15em] ${isDark ? 'text-white/60' : 'text-stone-600'}`}>
                    ሁሉም መዝሙራት
                  </h3>
                </div>

                <div className="mt-4 relative">
                  <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-stone-500'}`} />
                  <input
                    type="text"
                    value={sidebarQuery}
                    onChange={(e) => setSidebarQuery(e.target.value)}
                    placeholder="የመዝሙር ስንኝ ያስገቡ ለመፈለግ..."
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none text-sm transition-all duration-300 ${isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/40'
                      : 'bg-[#fffaf0] border-amber-200/80 text-stone-900 placeholder:text-stone-500 focus:border-amber-500/70'
                      }`}
                  />
                  {sidebarQuery && (
                    <button
                      onClick={() => setSidebarQuery('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg ${isDark ? 'text-white/40 hover:bg-white/10' : 'text-stone-500 hover:bg-amber-50'}`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar List */}
              <div className="overflow-y-auto max-h-[calc(100vh-14rem)] p-3 custom-scrollbar">
                {sidebarMezmurs.map((mezmur) => (
                  <button
                    key={mezmur.id}
                    onClick={() => handleSelectMezmur(mezmur.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl mb-1 transition-all duration-300 flex items-center gap-4 group ${selectedId === mezmur.id
                      ? isDark
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/10 border border-amber-500/30 text-white'
                        : 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-950 shadow-sm'
                      : isDark
                        ? 'hover:bg-white/5 text-white/60 hover:text-white border border-transparent'
                        : 'hover:bg-[#fffaf0] hover:text-amber-900 border border-transparent hover:border-amber-200/60 shadow-sm'
                      }`}
                  >
                    <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${selectedId === mezmur.id
                      ? isDark ? 'bg-amber-500/30 text-amber-300' : 'bg-amber-100 text-amber-900'
                      : isDark ? 'bg-white/10 text-white/40 group-hover:bg-white/20' : 'bg-amber-50 text-stone-600 group-hover:bg-amber-100'
                      }`}>
                      {mezmur.id}
                    </span>
                    <span className="flex-1 truncate ethiopic-font text-sm font-medium">
                      {mezmur.title}
                    </span>
                    {selectedId === mezmur.id && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-700'}`} />
                    )}
                  </button>
                ))}

                {sidebarMezmurs.length === 0 && (
                  <div className={`px-4 py-6 text-sm text-center ethiopic-font ${isDark ? 'text-white/40' : 'text-stone-600'}`}>
                    ውጤት አልተገኘም
                  </div>
                )}
              </div>
            </aside>

            {/* Main Reading Content */}
            <div className="flex-1 min-w-0">

              {/* Reading Card */}
              <article className={`relative overflow-hidden rounded-[2.5rem] transition-all duration-500 ${isDark
                ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 shadow-2xl shadow-black/50'
                : 'bg-[#fffaf0] border border-amber-200/70 shadow-2xl shadow-amber-100/20'
                }`}>

                {/* Decorative top gradient */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${isDark
                  ? 'from-amber-600 via-yellow-500 to-amber-600'
                  : 'from-amber-700 via-yellow-600 to-amber-700'
                  }`} />

                <div className="p-6 sm:p-8 lg:p-12 xl:p-16">

                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {/* Number Badge */}
                    <div className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl ${isDark
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20'
                      : 'bg-amber-50 border border-amber-200/70'
                      }`}>
                      <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-amber-400/70' : 'text-stone-600'}`}>

                      </span>
                      <span className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
                        {String(currentMezmur?.id).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(currentMezmur?.id || 0)}
                        className={`p-2 sm:p-3 rounded-xl border transition-all ${favorites.includes(currentMezmur?.id || 0)
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-500'
                          : isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'
                            : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-stone-700 hover:text-stone-900'
                          }`}
                      >
                        <Bookmark size={18} fill={favorites.includes(currentMezmur?.id || 0) ? 'currentColor' : 'none'} />
                      </button>

                      <div className={`flex items-center rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-amber-50 border-amber-200'
                        }`}>
                        <button
                          onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                          className={`p-2 sm:p-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-amber-100 text-stone-700'}`}
                        >
                          <Minus size={14} />
                        </button>
                        <TypeIcon size={14} className={isDark ? 'text-white/30' : 'text-stone-500'} />
                        <button
                          onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                          className={`p-2 sm:p-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-amber-100 text-stone-700'}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className={`p-2 sm:p-3 rounded-xl border transition-all ${copied
                          ? 'bg-green-500/20 border-green-500/30 text-green-500'
                          : isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'
                            : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-stone-700 hover:text-stone-900'
                          }`}
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className={`heading-font text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold ethiopic-font text-center leading-tight mb-12 sm:mb-16 ${isDark
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950'
                    }`}>
                    {currentMezmur?.title}
                  </h1>

                  {/* Lyrics */}
                  <div
                    className="space-y-6 sm:space-y-8 ethiopic-font text-center leading-relaxed"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {currentMezmur?.lyrics.map((line, idx) => {
                      const isChorus = line.includes('አዝ');
                      return (
                        <p
                          key={idx}
                          className={`transition-colors ${isChorus
                            ? `font-semibold py-6 px-8 rounded-2xl ${isDark
                              ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
                              : 'text-amber-950 bg-amber-50 border border-amber-200/70'
                            }`
                            : isDark ? 'text-white/80' : 'text-stone-800'
                            }`}
                        >
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  {/* Meaning Section */}
                  {currentMezmur?.['ትርጉም'] && (
                    <div className={`mt-16 sm:mt-20 p-6 sm:p-8 lg:p-10 rounded-3xl relative overflow-hidden ${isDark
                      ? 'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10'
                      : 'bg-gradient-to-br from-amber-50 to-[#fffaf0] border border-amber-200/70'
                      }`}>
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDark
                        ? 'bg-gradient-to-b from-amber-500 to-purple-500'
                        : 'bg-gradient-to-b from-amber-500 to-amber-800'
                        }`} />
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <Info size={16} className={isDark ? 'text-amber-400' : 'text-amber-800'} />
                        <h3 className={`heading-font text-sm font-bold uppercase tracking-[0.2em] ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
                          ትርጉም
                        </h3>
                      </div>
                      <p className={`text-base sm:text-lg ethiopic-font leading-relaxed italic ${isDark ? 'text-white/60' : 'text-stone-700'}`}>
                        "{currentMezmur['ትርጉም']}"
                      </p>
                    </div>
                  )}
                </div>
              </article>

              {/* Quick Navigation */}
              <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl ${isDark
                ? 'bg-white/5 border border-white/10'
                : 'bg-[#fffaf0] border border-amber-200/70 shadow-sm shadow-amber-100/30'
                }`}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSelectMezmur(Math.max(1, (currentMezmur?.id || 1) - 1))}
                    disabled={(currentMezmur?.id || 1) <= 1}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all ${(currentMezmur?.id || 1) <= 1
                      ? 'opacity-30 cursor-not-allowed'
                      : isDark
                        ? 'hover:bg-white/10 text-white/60 hover:text-white'
                        : 'hover:bg-amber-50 text-stone-700 hover:text-stone-900 border border-transparent hover:border-amber-200/70'
                      }`}
                  >
                    <ArrowLeft size={14} />
                    <span className="text-xs sm:text-sm font-medium">Previous</span>
                  </button>
                  <span className={`text-xs sm:text-sm ${isDark ? 'text-white/30' : 'text-stone-500'}`}>
                    {currentMezmur?.id} of {MEZMURS.length}
                  </span>
                  <button
                    onClick={() => handleSelectMezmur(Math.min(MEZMURS.length, (currentMezmur?.id || 1) + 1))}
                    disabled={(currentMezmur?.id || 1) >= MEZMURS.length}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all ${(currentMezmur?.id || 1) >= MEZMURS.length
                      ? 'opacity-30 cursor-not-allowed'
                      : isDark
                        ? 'hover:bg-white/10 text-white/60 hover:text-white'
                        : 'hover:bg-amber-50 text-stone-700 hover:text-stone-900 border border-transparent hover:border-amber-200/70'
                      }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`relative z-10 mt-16 sm:mt-20 py-8 sm:py-12 border-t ${isDark ? 'border-white/5' : 'border-amber-200/60'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bottom Bar */}
          <div className={`pt-6 sm:pt-8 border-t ${isDark ? 'border-white/5' : 'border-amber-200/60'} text-center`}>
            <p className={`ethiopic-font text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-stone-800'} mb-3`}>
              ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
            </p>

            <p className={`text-xs mt-2 ${isDark ? 'text-white/30' : 'text-stone-500'}`}>
              Made with <Heart size={12} className="inline text-red-400 mx-1" />
            </p>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideInFromBottom 0.8s ease-out forwards;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        .ethiopic-font {
          font-family: 'Noto Sans Ethiopic', 'Inter', sans-serif;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.8);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.2);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.4);
        }
        
        .premium-card {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .text-glow {
          text-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
        }

        .dark .text-glow {
          text-shadow: 0 0 25px rgba(251, 191, 36, 0.4);
        }
        
        /* Loading shimmer effect */
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-property: color, background-color, border-color, transform, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
        
        /* Enhanced focus states */
        input:focus-visible {
          outline: none;
          box-shadow: none;
        }

        .dark input:focus-visible {
          box-shadow: none;
        }

        button:focus-visible {
          outline: none;
          box-shadow: none;
        }

        .dark button:focus-visible {
          box-shadow: none;
        }
        
        /* Text selection styling */
        ::selection {
          background-color: rgba(251, 191, 36, 0.3);
          color: inherit;
        }
        
        .dark ::selection {
          background-color: rgba(251, 191, 36, 0.5);
        }
      `}} />
    </div>
  );
};

export default App;
