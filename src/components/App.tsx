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
  Heart,
  X,
  Bookmark,
  Shuffle,
  Home,
  Menu,
  ChevronLeft
} from 'lucide-react';

// Content length classification for dynamic layout
type ContentSize = 'compact' | 'medium' | 'expanded';

const getContentSize = (lyricsCount: number): ContentSize => {
  if (lyricsCount <= 5) return 'compact';
  if (lyricsCount <= 15) return 'medium';
  return 'expanded';
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('mezmur_theme');
    if (savedTheme) return savedTheme as Theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    const savedSize = localStorage.getItem('mezmur_font_size');
    return savedSize ? parseInt(savedSize) : 20;
  });
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavs = localStorage.getItem('mezmur_favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });
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

  // Dynamic content size based on lyrics length
  const contentSize = useMemo((): ContentSize => {
    if (!currentMezmur) return 'medium';
    return getContentSize(currentMezmur.lyrics.length);
  }, [currentMezmur]);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setFontSize(prev => prev > 18 ? 18 : prev);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mezmur_theme', theme);
  }, [theme]);

  // Persist Font Size
  useEffect(() => {
    localStorage.setItem('mezmur_font_size', fontSize.toString());
  }, [fontSize]);

  // Persist Favorites
  useEffect(() => {
    localStorage.setItem('mezmur_favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  // Dynamic padding/spacing based on content size
  const getContentPadding = () => {
    switch (contentSize) {
      case 'compact': return 'p-5 sm:p-6 lg:p-8';
      case 'medium': return 'p-6 sm:p-8 lg:p-10 xl:p-12';
      case 'expanded': return 'p-6 sm:p-8 lg:p-12 xl:p-16';
    }
  };

  // Dynamic title sizing based on content size
  const getTitleSize = () => {
    switch (contentSize) {
      case 'compact': return 'text-2xl sm:text-3xl lg:text-4xl';
      case 'medium': return 'text-3xl sm:text-4xl lg:text-5xl';
      case 'expanded': return 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl';
    }
  };

  // Dynamic spacing between lyrics lines
  const getLyricsSpacing = () => {
    switch (contentSize) {
      case 'compact': return 'space-y-3 sm:space-y-4';
      case 'medium': return 'space-y-5 sm:space-y-6';
      case 'expanded': return 'space-y-6 sm:space-y-8';
    }
  };

  // Dynamic margin for meaning section
  const getMeaningMargin = () => {
    switch (contentSize) {
      case 'compact': return 'mt-8 sm:mt-10';
      case 'medium': return 'mt-12 sm:mt-16';
      case 'expanded': return 'mt-16 sm:mt-20';
    }
  };

  // Dynamic container max-width for centered reading
  const getContainerWidth = () => {
    switch (contentSize) {
      case 'compact': return 'max-w-2xl';
      case 'medium': return 'max-w-3xl';
      case 'expanded': return 'max-w-4xl';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0d0d12] text-white' : 'bg-[#fefdfb] text-black'}`}>

      {/* Global Mobile Sidebar Overlay - Covers everything when open */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${showMobileSidebar ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${showMobileSidebar ? 'opacity-100' : 'opacity-0'} ${isDark ? 'bg-[#0d0d12]' : 'bg-[#fefdfb]'}`}
          onClick={() => setShowMobileSidebar(false)}
        />
        <aside className={`absolute top-0 right-0 h-full w-full flex flex-col transform transition-transform duration-500 ease-out ${showMobileSidebar ? 'translate-x-0' : 'translate-x-full'} ${isDark
          ? 'bg-[#0d0d12]'
          : 'bg-[#fefdfb]'
          }`}>
          {/* Mobile Sidebar Header */}
          <div className={`flex-shrink-0 p-5 border-b flex items-center justify-between ${isDark ? 'border-white/10' : 'border-amber-100/50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <BookOpen size={18} className={isDark ? 'text-amber-400' : 'text-amber-700'} />
              </div>
              <h3 className={`font-bold text-sm tracking-widest uppercase ethiopic-font ${isDark ? 'text-white/90' : 'text-stone-800'}`}>
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

          {/* Search Section */}
          <div className="flex-shrink-0 p-4">
            <div className="relative">
              <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-stone-400'}`} />
              <input
                type="text"
                value={sidebarQuery}
                onChange={(e) => setSidebarQuery(e.target.value)}
                placeholder="በመዝሙር ርዕስ ይፈልጉ..."
                className={`w-full pl-10 pr-10 py-4 rounded-2xl outline-none appearance-none focus:ring-0 text-sm transition-all ethiopic-font ${isDark
                  ? 'bg-white/5 border border-white/10 focus:border-amber-500/50 text-white'
                  : 'bg-amber-50/70 border border-amber-200 focus:border-amber-500/50 text-stone-900'
                  }`}
              />
            </div>
          </div>

          {/* Mobile Sidebar List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-2">
              {sidebarMezmurs.map((mezmur) => (
                <button
                  key={mezmur.id}
                  onClick={() => {
                    handleSelectMezmur(mezmur.id);
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full text-left px-4 py-4 rounded-2xl transition-all flex items-center gap-4 ${selectedId === mezmur.id
                    ? isDark
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                    : isDark
                      ? 'hover:bg-white/5 text-white/80 border border-transparent'
                      : 'hover:bg-amber-50 text-stone-700 border border-transparent'
                    }`}
                >
                  <span className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-xl ${selectedId === mezmur.id
                    ? isDark ? 'bg-amber-500/30 text-amber-200' : 'bg-amber-200 text-amber-900'
                    : isDark ? 'bg-white/10 text-white/60' : 'bg-stone-100 text-stone-600'}`}>
                    {mezmur.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium ethiopic-font text-base leading-tight">
                      {mezmur.title}
                    </p>
                    <p className={`text-xs mt-1 truncate ethiopic-font ${isDark ? 'text-white/40' : 'text-stone-500'}`}>
                      {mezmur.lyrics[0]}
                    </p>
                  </div>
                  {selectedId === mezmur.id && (
                    <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-700'}`} />
                  )}
                </button>
              ))}

              {sidebarMezmurs.length === 0 && (
                <div className="py-20 text-center opacity-40">
                  <Search size={32} className="mx-auto mb-4" />
                  <p className="ethiopian-font">ውጤት አልተገኘም</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${isDark
        ? 'bg-[#0d0d12]/90 border-amber-500/10'
        : 'bg-[#fefdfb]/90 border-amber-200/60'
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
                  <h1 className={`heading-font text-base sm:text-lg lg:text-xl 
                    font-bold tracking-tight ${isDark ? 'text-amber-50' : 'text-stone-900'}`}>
                    የጥምቀት <span className={isDark ? "text-amber-500" : "text-amber-800"}>መዝሙሮች</span>
                  </h1>
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
                className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition-all duration-500 group relative ${showFavoritesOnly
                  ? isDark ? 'bg-gradient-to-br from-amber-500/40 to-orange-600/20 border border-amber-500/40' : 'bg-amber-100 border border-amber-200 shadow-sm shadow-amber-900/10'
                  : isDark ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-[#fffaf0] border border-amber-200 shadow-sm'
                  }`}
                title="Favorites"
              >
                <Bookmark size={18} className={showFavoritesOnly ? (isDark ? 'text-amber-400' : 'text-amber-900') : (isDark ? 'text-white/60' : 'text-stone-700')} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-transparent">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition-all duration-500 group ${isDark
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/10 hover:from-amber-500/30 hover:to-orange-600/20 border border-amber-500/20'
                  : 'bg-[#fffaf0] hover:bg-amber-50 border border-amber-200 shadow-sm'
                  }`}>
                {isDark ? (
                  <Sun size={18} className="text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
                ) : (
                  <Moon size={18} className="text-amber-900 group-hover:-rotate-12 transition-transform duration-500" />
                )}
              </button>

              {/* Burger Menu for mobile - Now visible on home page too */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${isDark
                  ? 'hover:bg-white/10 text-white/60 hover:text-white'
                  : 'hover:bg-black/5 text-black/40 hover:text-black'
                  }`}
              >
                <Menu size={20} />
              </button>
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
                    className={`flex-1 bg-transparent !border-0 !outline-none !shadow-none !ring-0 appearance-none text-sm sm:text-base lg:text-lg ${isDark
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
                <p className={`mt-4 text-center ethiopic-font text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-amber-200/60' : 'text-stone-600'}`}>
                  ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
                </p>
              </div>
            </div>

            {/* Grid */}
            {filteredMezmurs.length === 0 ? (
              <div className={`col-span-full py-20 text-center ethiopic-font ${isDark ? 'text-white/40' : 'text-stone-600'}`}>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-amber-50'}`}>
                  <Search size={32} className={isDark ? 'text-white/20' : 'text-amber-300'} />
                </div>
                <p className="text-lg font-medium mb-2">ውጤት አልተገኘም</p>
                <p className="text-sm opacity-70">እባክዎ የፍለጋ ቃሉን ያስተካክሉ እና እንደገና ይሞክሩ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {filteredMezmurs.map((mezmur, index) => {
                  // Determine content size for this mezmur
                  const mezmurContentSize = getContentSize(mezmur.lyrics.length);

                  return (
                    <div
                      key={mezmur.id}
                      onClick={() => handleSelectMezmur(mezmur.id)}
                      className={`group cursor-pointer relative overflow-hidden transition-all duration-500 ease-out rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl animate-fadeIn ${isDark
                        ? 'bg-[#16161d] border border-white/[0.08] hover:border-amber-500/40 hover:shadow-amber-500/10'
                        : 'bg-[#fffaf0]/95 backdrop-blur-sm border border-amber-200/70 hover:border-amber-400/80 hover:shadow-amber-100/60'
                        }`}
                      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                    >
                      {/* Hover gradient overlay */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark
                        ? 'bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5'
                        : 'bg-gradient-to-br from-amber-50/50 via-transparent to-yellow-50/30'
                        }`} />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(mezmur.id);
                        }}
                        className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${favorites.includes(mezmur.id)
                          ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-900 border border-amber-200/70'
                          : isDark ? 'bg-white/5 text-white/30 hover:text-white hover:bg-white/15' : 'bg-white/50 text-stone-400 hover:text-stone-700 hover:bg-white/80 border border-amber-200/40'
                          }`}
                      >
                        <Bookmark size={14} fill={favorites.includes(mezmur.id) ? 'currentColor' : 'none'} />
                      </button>

                      {/* Number */}
                      <div className="relative z-10 mb-3 sm:mb-4">
                        <span className={`font-bold tracking-tight transition-all duration-300 text-4xl sm:text-5xl lg:text-6xl ${isDark
                          ? 'text-white/[0.12] group-hover:text-amber-500/40'
                          : 'text-amber-200/50 group-hover:text-amber-500/20'
                          }`}>
                          {String(mezmur.id).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="relative z-10">
                        <h3 className={`heading-font font-bold ethiopic-font leading-tight transition-colors text-base sm:text-lg lg:text-xl ${isDark
                          ? 'text-white group-hover:text-amber-100'
                          : 'text-stone-900 group-hover:text-amber-900'
                          }`}>
                          {mezmur.title}
                        </h3>
                        <p className={`mt-2 text-sm line-clamp-2 ethiopic-font ${isDark ? 'text-white/50' : 'text-stone-600'}`}>
                          {mezmur.lyrics[0]}{mezmur.lyrics[0].length < 40 ? '...' : ''}
                        </p>
                      </div>

                      {/* Arrow indicator */}
                      <div className={`absolute bottom-4 right-4 z-10 transition-all duration-300 ${isDark
                        ? 'text-white/15 group-hover:text-amber-400'
                        : 'text-stone-200 group-hover:text-amber-700'
                        } opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0`}>
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Reading View with Sidebar */
          <div className="animate-fadeIn flex gap-8">


            {/* Sidebar - Hymn List */}
            <aside className={`hidden lg:block w-80 flex-shrink-0 sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-hidden rounded-3xl ${isDark
              ? 'bg-[#14141c] border border-amber-500/10'
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
                    placeholder="በመዝሙር ርዕስ ይፈልጉ..."
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl outline-none appearance-none focus:ring-0 text-sm transition-all duration-300 ${isDark
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

              {/* Reading Card - Dynamic sizing based on content length */}
              <article className={`relative overflow-hidden transition-all duration-500 ${contentSize === 'compact' ? 'rounded-2xl sm:rounded-3xl' : 'rounded-[2rem] sm:rounded-[2.5rem]'
                } ${isDark
                  ? 'bg-[#14141c] border border-amber-500/10 shadow-2xl shadow-black/50'
                  : 'bg-[#fffaf0] border border-amber-200/70 shadow-2xl shadow-amber-100/20'
                }`}>

                {/* Decorative top gradient - thinner for compact content */}
                <div className={`absolute top-0 left-0 right-0 ${contentSize === 'compact' ? 'h-1' : 'h-1.5'} bg-gradient-to-r ${isDark
                  ? 'from-amber-600 via-yellow-500 to-amber-600'
                  : 'from-amber-700 via-yellow-600 to-amber-700'
                  }`} />

                {/* Dynamic padding based on content size */}
                <div className={getContentPadding()}>

                  {/* Header - more compact for short content */}
                  <div className={`flex flex-wrap items-start justify-between gap-3 sm:gap-4 ${contentSize === 'compact' ? 'mb-6 sm:mb-8' : 'mb-8 sm:mb-12'}`}>
                    {/* Number Badge */}
                    <div className={`flex items-center gap-2 sm:gap-3 ${contentSize === 'compact' ? 'px-3 sm:px-4 py-2 sm:py-3' : 'px-4 sm:px-6 py-3 sm:py-4'} rounded-xl sm:rounded-2xl ${isDark
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20'
                      : 'bg-amber-50 border border-amber-200/70'
                      }`}>
                      <span className={`${contentSize === 'compact' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-bold ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
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

                  {/* Title - Dynamic sizing based on content */}
                  <div className={`${getContainerWidth()} mx-auto`}>
                    <h1 className={`heading-font ${getTitleSize()} font-bold ethiopic-font text-center leading-tight ${contentSize === 'compact' ? 'mb-6 sm:mb-8' : 'mb-10 sm:mb-14'} ${isDark
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950'
                      }`}>
                      {currentMezmur?.title}
                    </h1>
                  </div>

                  {/* Lyrics - Dynamic spacing based on content length */}
                  <div className={`${getContainerWidth()} mx-auto`}>
                    <div
                      className={`${getLyricsSpacing()} ethiopic-font text-center leading-relaxed`}
                      style={{ fontSize: `${fontSize}px`, lineHeight: contentSize === 'compact' ? '1.6' : '1.8' }}
                    >
                      {currentMezmur?.lyrics.map((line, idx) => {
                        const isChorus = line.includes('አዝ');
                        const chorusPadding = contentSize === 'compact' ? 'py-4 px-5' : 'py-6 px-8';
                        return (
                          <p
                            key={idx}
                            className={`transition-colors ${isChorus
                              ? `font-semibold ${chorusPadding} rounded-xl sm:rounded-2xl ${isDark
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
                  </div>

                  {/* Meaning Section - Dynamic margin based on content */}
                  {currentMezmur?.['ትርጉም'] && currentMezmur['ትርጉም'].length > 0 && (
                    <div className={`${getContainerWidth()} mx-auto`}>
                      <div className={`${getMeaningMargin()} ${contentSize === 'compact' ? 'p-4 sm:p-5' : 'p-6 sm:p-8 lg:p-10'} ${contentSize === 'compact' ? 'rounded-xl sm:rounded-2xl' : 'rounded-2xl sm:rounded-3xl'} relative overflow-hidden ${isDark
                        ? 'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10'
                        : 'bg-gradient-to-br from-amber-50 to-[#fffaf0] border border-amber-200/70'
                        }`}>
                        <div className={`absolute left-0 top-0 bottom-0 ${contentSize === 'compact' ? 'w-0.5' : 'w-1'} ${isDark
                          ? 'bg-gradient-to-b from-amber-500 to-purple-500'
                          : 'bg-gradient-to-b from-amber-500 to-amber-800'
                          }`} />
                        <div className={`flex items-center gap-2 sm:gap-3 ${contentSize === 'compact' ? 'mb-3 sm:mb-4' : 'mb-4 sm:mb-6'}`}>
                          <Info size={contentSize === 'compact' ? 14 : 16} className={isDark ? 'text-amber-400' : 'text-amber-800'} />
                          <h3 className={`heading-font ${contentSize === 'compact' ? 'text-xs' : 'text-sm'} font-bold uppercase tracking-[0.2em] ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
                            ትርጉም
                          </h3>
                        </div>
                        <p className={`${contentSize === 'compact' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'} ethiopic-font leading-relaxed italic ${isDark ? 'text-white/60' : 'text-stone-700'}`}>
                          "{currentMezmur['ትርጉም']}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>

              {/* Quick Navigation - Dynamic spacing */}
              <div className={`${contentSize === 'compact' ? 'mt-4 sm:mt-6' : 'mt-6 sm:mt-8'} ${contentSize === 'compact' ? 'p-3 sm:p-4' : 'p-4 sm:p-6'} ${contentSize === 'compact' ? 'rounded-xl' : 'rounded-2xl'} ${isDark
                ? 'bg-white/5 border border-white/10'
                : 'bg-[#fffaf0] border border-amber-200/70 shadow-sm shadow-amber-100/30'
                }`}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSelectMezmur(Math.max(1, (currentMezmur?.id || 1) - 1))}
                    disabled={(currentMezmur?.id || 1) <= 1}
                    className={`group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all ${(currentMezmur?.id || 1) <= 1
                      ? 'opacity-30 cursor-not-allowed'
                      : isDark
                        ? 'hover:bg-white/10 text-white/60 hover:text-white'
                        : 'hover:bg-amber-50 text-stone-700 hover:text-stone-900 border border-transparent hover:border-amber-200/70'
                      }`}
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-xs sm:text-sm font-medium ethiopic-font hidden sm:inline">ቀዳሚ</span>
                  </button>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white/50' : 'text-stone-500'}`}>
                      <span className={isDark ? 'text-amber-400' : 'text-amber-700'}>{currentMezmur?.id}</span>
                      <span className="mx-1">/</span>
                      {MEZMURS.length}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectMezmur(Math.min(MEZMURS.length, (currentMezmur?.id || 1) + 1))}
                    disabled={(currentMezmur?.id || 1) >= MEZMURS.length}
                    className={`group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all ${(currentMezmur?.id || 1) >= MEZMURS.length
                      ? 'opacity-30 cursor-not-allowed'
                      : isDark
                        ? 'hover:bg-white/10 text-white/60 hover:text-white'
                        : 'hover:bg-amber-50 text-stone-700 hover:text-stone-900 border border-transparent hover:border-amber-200/70'
                      }`}
                  >
                    <span className="text-xs sm:text-sm font-medium ethiopic-font hidden sm:inline">ቀጣይ</span>
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer - Elegant and minimal */}
      <footer className={`relative z-10 ${selectedId !== null ? (contentSize === 'compact' ? 'mt-10 sm:mt-14' : 'mt-16 sm:mt-24') : 'mt-16 sm:mt-24'} py-8 sm:py-12 border-t ${isDark ? 'border-white/5' : 'border-amber-200/60'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            {/* Church name with gradient */}
            <p className={`ethiopic-font text-sm sm:text-base leading-relaxed font-medium ${isDark ? 'text-white/80' : 'text-stone-800'}`}>
              ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል
            </p>
            <p className={`ethiopic-font text-xs sm:text-sm ${isDark ? 'text-white/50' : 'text-stone-600'}`}>
              ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
            </p>

            {/* Divider */}
            <div className={`w-16 h-px mx-auto my-4 ${isDark ? 'bg-white/10' : 'bg-amber-200/70'}`} />

            <p className={`text-xs ${isDark ? 'text-white/30' : 'text-stone-400'} flex items-center justify-center gap-1`}>
              “ከፀሐይ መውጫ ጀምሮ እስከ መግቢያው ድረስ የእግዚአብሔር ስም ይመስገን።” መዝ 113 ፥ 3
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
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.1); }
          50% { box-shadow: 0 0 35px rgba(251, 191, 36, 0.25); }
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
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeInScale {
          animation: fadeInScale 0.4s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideInFromBottom 0.6s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInFromRight 0.5s ease-out forwards;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        /* Custom breakpoints */
        @media (min-width: 400px) {
          .xs\\:inline { display: inline; }
          .xs\\:hidden { display: none; }
        }
        @media (max-width: 399px) {
          .xs\\:inline { display: none; }
          .xs\\:hidden { display: inline; }
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        html, body {
          background-color: ${isDark ? '#0d0d12' : '#fefdfb'};
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        #root {
          background-color: ${isDark ? '#0d0d12' : '#fefdfb'};
          min-height: 100vh;
        }

        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          line-height: 1.6;
        }
        
        .ethiopic-font {
          font-family: 'Noto Sans Ethiopic', 'Kefa', 'Inter', sans-serif;
          letter-spacing: 0.01em;
        }
        
        /* Responsive typography */
        @media (max-width: 640px) {
          html {
            font-size: 14px;
          }
        }
        
        @media (min-width: 1280px) {
          html {
            font-size: 16px;
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)'};
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
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
        
        /* Smooth transitions for interactive elements */
        button, a, input {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Disable cursor-pointer transition to avoid jank */
        * {
          cursor: inherit;
        }
        
        /* Enhanced focus states for accessibility */
        input:focus-visible,
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid ${isDark ? 'rgba(251, 191, 36, 0.5)' : 'rgba(180, 83, 9, 0.5)'};
          outline-offset: 2px;
        }
        
        /* Text selection styling */
        ::selection {
          background-color: ${isDark ? 'rgba(251, 191, 36, 0.4)' : 'rgba(251, 191, 36, 0.3)'};
          color: inherit;
        }
        
        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Prevent text overflow */
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        /* Better touch targets on mobile */
        @media (pointer: coarse) {
          button {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}} />
    </div>
  );
};

export default App;
