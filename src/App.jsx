import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Server,
  ExternalLink,
  User,
  Terminal,
  LayoutGrid,
  BarChart3,
  Globe,
  Heart,
  Sun,
  Moon
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { servicesData, hostedWebsites, socials } from './config/config';
import { categoryIcons, categoryColors } from './config/iconMap';
import { useTheme } from './hooks/useTheme';

const HomeLabDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'websites'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serviceStatus, setServiceStatus] = useState({});
  const [websiteStatus, setWebsiteStatus] = useState({});
  const { isDark, toggleTheme } = useTheme();

  // Horloge en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if a URL is responding
  const checkStatus = async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true; // If fetch completes without error, consider it online
    } catch (error) {
      return false; // If fetch fails, consider it offline
    }
  };

  // Check status of all services and websites
  useEffect(() => {
    const checkAllStatus = async () => {
      // Check services
      const servicePromises = servicesData.map(async (service) => {
        const isOnline = await checkStatus(service.url);
        return { id: service.id, status: isOnline };
      });

      // Check hosted websites
      const websitePromises = hostedWebsites.map(async (site) => {
        const isOnline = await checkStatus(site.url);
        return { id: site.id, status: isOnline };
      });

      const serviceResults = await Promise.all(servicePromises);
      const websiteResults = await Promise.all(websitePromises);

      // Update state
      const newServiceStatus = {};
      serviceResults.forEach(({ id, status }) => {
        newServiceStatus[id] = status;
      });
      setServiceStatus(newServiceStatus);

      const newWebsiteStatus = {};
      websiteResults.forEach(({ id, status }) => {
        newWebsiteStatus[id] = status;
      });
      setWebsiteStatus(newWebsiteStatus);
    };

    // Initial check
    checkAllStatus();

    // Check every 60 seconds
    const interval = setInterval(checkAllStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  // Filtrage des services (Recherche affecte les deux listes)
  const filteredServices = servicesData.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHosted = hostedWebsites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped = {};
    filteredServices.forEach(service => {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    });
    return grouped;
  }, [filteredServices]);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 p-6 font-sans selection:bg-blue-500/20 zelda-background">
      {/* Hyrule Field Night background */}
      <div className="zelda-stars" />
      <div className="hyrule-moon" />
      <div className="hyrule-hills">
        <div className="hill hill--far-left" />
        <div className="hill hill--far-right" />
        <div className="hill hill--mid" />
        <div className="hill hill--near" />
      </div>
      <div className="hyrule-grass" />

      {/* Fireflies */}
      <div className="firefly" style={{ top: '35%', left: '8%', '--duration': '7s', '--delay': '0s', '--dx': '45px', '--dy': '-55px', '--ex': '-25px', '--ey': '-90px' }} />
      <div className="firefly" style={{ top: '55%', left: '82%', '--duration': '9s', '--delay': '2s', '--dx': '-50px', '--dy': '-40px', '--ex': '20px', '--ey': '-75px' }} />
      <div className="firefly" style={{ top: '68%', left: '22%', '--duration': '6.5s', '--delay': '1s', '--dx': '35px', '--dy': '-50px', '--ex': '-15px', '--ey': '-80px' }} />
      <div className="firefly" style={{ top: '42%', left: '62%', '--duration': '8s', '--delay': '3.5s', '--dx': '-25px', '--dy': '-65px', '--ex': '35px', '--ey': '-55px' }} />
      <div className="firefly firefly--navi" style={{ top: '38%', left: '45%', '--duration': '11s', '--delay': '5s', '--dx': '60px', '--dy': '-30px', '--ex': '-40px', '--ey': '-50px' }} />
      <div className="firefly" style={{ top: '60%', left: '72%', '--duration': '7.5s', '--delay': '4s', '--dx': '-40px', '--dy': '-50px', '--ex': '30px', '--ey': '-85px' }} />
      <div className="firefly" style={{ top: '75%', left: '50%', '--duration': '8.5s', '--delay': '6s', '--dx': '25px', '--dy': '-45px', '--ex': '-35px', '--ey': '-70px' }} />

      {/* Header Global */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-blue-200/30 dark:border-blue-900/20 pb-6 relative z-10">
        <div className="text-center md:text-left w-full md:w-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-2 rounded-2xl shadow-lg shadow-blue-900/40">
              <Terminal className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-blue-300 bg-clip-text text-transparent tracking-tight">
              q2r
            </h1>
          </div>
          <div className="flex items-center gap-2 text-blue-600/60 dark:text-blue-200/60 text-sm">
            <User className="h-3 w-3" />
            <span>Lab Operator: <span className="text-slate-700 dark:text-slate-200 font-medium">Quadeare</span></span>
            <span className="text-blue-300/40 dark:text-blue-900/40 hidden sm:inline">•</span>
            <span className="hidden sm:inline">{currentTime.toLocaleDateString()}</span>
            <span className="text-blue-300/40 dark:text-blue-900/40 hidden sm:inline">•</span>
            <span className="font-mono text-blue-500 dark:text-blue-400 hidden sm:inline">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full md:w-auto items-center">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl border border-blue-200/30 dark:border-blue-900/20 bg-blue-50/60 dark:bg-slate-950/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4 text-blue-200/60" /> : <Moon className="h-4 w-4 text-blue-600/60" />}
          </button>

          {/* Tabs */}
          <div className="flex bg-blue-50/60 dark:bg-slate-950/40 p-1.5 rounded-2xl border border-blue-200/30 dark:border-blue-900/20 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 text-white shadow-lg shadow-blue-900/50'
                  : 'text-blue-500/60 dark:text-blue-200/50 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutGrid size={16} />
              Services
            </button>
            <button
              onClick={() => setActiveTab('websites')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'websites'
                  ? 'bg-gradient-to-br from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-500 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-blue-500/60 dark:text-blue-200/50 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <Globe size={16} />
              Websites
            </button>
            <a
              href="https://stats.uptimerobot.com/k2GAYTY5Ol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-blue-500/60 dark:text-blue-200/50 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50"
            >
              <BarChart3 size={16} />
              Status
            </a>
          </div>

          {/* Search Bar (Visible on Dashboard and Websites tabs) */}
          {(activeTab === 'dashboard' || activeTab === 'websites') && (
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-blue-200/30 dark:border-blue-900/20 rounded-2xl leading-5 bg-white/60 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 placeholder-blue-400/40 dark:placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/80 dark:focus:bg-slate-900/60 transition-all shadow-sm text-sm backdrop-blur-sm"
                placeholder={activeTab === 'dashboard' ? "Find a service..." : "Find a website..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto min-h-[500px] relative z-10">

        {/* Tab Content: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Services grouped by category */}
            {Object.keys(servicesByCategory).length > 0 ? (
              Object.entries(servicesByCategory).map(([category, services]) => {
                const CategoryIcon = categoryIcons[category] || Server;
                const categoryColor = categoryColors[category] || 'text-blue-600 dark:text-blue-400';

                return (
                  <section key={category}>
                    <div className="flex items-center justify-between mb-6 px-1">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`h-5 w-5 ${categoryColor}`} />
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{category}</h2>
                      </div>
                      {searchTerm && (
                        <span className="text-xs text-blue-500/40 dark:text-blue-200/40 font-mono">Found: {services.length}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {services.map((service) => (
                        <a
                          key={service.id}
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block h-full"
                        >
                          <Card className="h-full bg-white/60 dark:bg-slate-900/40 border-blue-200/30 dark:border-blue-900/20 hover:border-blue-500/40 hover:bg-white/80 dark:hover:bg-slate-800/60 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm rounded-2xl">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${service.color.replace('text', 'bg')} opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl`}></div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors flex items-center gap-2">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    serviceStatus[service.id] === undefined
                                      ? 'bg-blue-600 animate-pulse'
                                      : serviceStatus[service.id]
                                        ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                                        : 'bg-red-400 shadow-lg shadow-red-400/50'
                                  }`}
                                  title={serviceStatus[service.id] === undefined ? 'Checking...' : serviceStatus[service.id] ? 'Online' : 'Offline'}
                                />
                                {service.name}
                              </CardTitle>
                              <service.icon className={`h-5 w-5 ${service.color} opacity-80 group-hover:opacity-100 transition-all group-hover:scale-110`} />
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="text-blue-600/60 dark:text-blue-200/50 text-sm line-clamp-1">
                                {service.desc}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        </a>
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              <div className="text-center py-20 text-blue-500/40 dark:text-blue-200/40">
                <p className="text-lg">No services found for "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline mt-2 text-sm transition-colors">Clear search</button>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: HOSTED WEBSITES */}
        {activeTab === 'websites' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Hosted Websites</h2>
                </div>
                {searchTerm && (
                  <span className="text-xs text-blue-500/40 dark:text-blue-200/40 font-mono">Found: {filteredHosted.length}</span>
                )}
              </div>

              {filteredHosted.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredHosted.map((site) => (
                    <a
                      key={site.id}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block h-full"
                    >
                      <Card className="h-full bg-white/60 dark:bg-slate-900/40 border-blue-200/30 dark:border-blue-900/20 hover:border-indigo-500/40 hover:bg-white/80 dark:hover:bg-slate-800/60 hover:shadow-xl hover:shadow-indigo-900/30 transition-all duration-300 backdrop-blur-sm rounded-2xl">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                          <div className="p-2 rounded-xl bg-blue-50/60 dark:bg-slate-950/60 border border-indigo-200/30 dark:border-indigo-900/30 group-hover:border-indigo-500/50 transition-colors">
                            <site.icon className={`h-6 w-6 ${site.color}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                websiteStatus[site.id] === undefined
                                  ? 'bg-blue-600 animate-pulse'
                                  : websiteStatus[site.id]
                                    ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                                    : 'bg-red-400 shadow-lg shadow-red-400/50'
                              }`}
                              title={websiteStatus[site.id] === undefined ? 'Checking...' : websiteStatus[site.id] ? 'Online' : 'Offline'}
                            />
                            <CardTitle className="text-base font-medium text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                              {site.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-1 text-xs text-blue-500/40 dark:text-blue-200/40 mt-1">
                            <ExternalLink size={10} />
                            <span className="truncate max-w-[150px]">{site.url.replace('https://', '')}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-blue-500/40 dark:text-blue-200/40">
                  <p className="text-lg">No websites found for "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline mt-2 text-sm transition-colors">Clear search</button>
                </div>
              )}
            </section>
          </div>
        )}

      </main>

      <footer className="max-w-7xl mx-auto mt-24 pt-8 border-t border-blue-200/30 dark:border-blue-900/20 text-blue-500/40 dark:text-blue-200/40 text-sm pb-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <p className="flex items-center gap-1">© {currentTime.getFullYear()} Q2r Lab • Hosting at home, with love <Heart className="h-4 w-4 text-red-400 fill-red-400 animate-pulse" /></p>
          <p className="flex items-center gap-1 opacity-70">
            Maintained by <span className="text-blue-600/60 dark:text-blue-200/60 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-default">Quadeare</span>
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 pt-4 border-t border-blue-200/10 dark:border-blue-900/10">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500/30 dark:text-blue-200/30 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              title={social.name}
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default HomeLabDashboard;
