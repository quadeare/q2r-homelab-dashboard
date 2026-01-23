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
  Heart
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { servicesData, hostedWebsites, socials } from './config/config';
import { categoryIcons, categoryColors } from './config/iconMap';

const HomeLabDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'websites'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serviceStatus, setServiceStatus] = useState({});
  const [websiteStatus, setWebsiteStatus] = useState({});

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
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans selection:bg-blue-500/30">
      {/* Header Global */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-6">
        <div className="text-center md:text-left w-full md:w-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Terminal className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
              q2r
            </h1>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <User className="h-3 w-3" />
            <span>Lab Operator: <span className="text-slate-200 font-medium">Quadeare</span></span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline">{currentTime.toLocaleDateString()}</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="font-mono text-emerald-400 hidden sm:inline">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full md:w-auto items-center">

          {/* Tabs */}
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutGrid size={16} />
              Services
            </button>
            <button
              onClick={() => setActiveTab('websites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'websites'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe size={16} />
              Websites
            </button>
            <a
              href="https://stats.uptimerobot.com/k2GAYTY5Ol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <BarChart3 size={16} />
              Status
            </a>
          </div>

          {/* Search Bar (Visible on Dashboard and Websites tabs) */}
          {(activeTab === 'dashboard' || activeTab === 'websites') && (
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-800 rounded-xl leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-900 transition-all shadow-sm text-sm"
                placeholder={activeTab === 'dashboard' ? "Find a service..." : "Find a website..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto min-h-[500px]">

        {/* Tab Content: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Services grouped by category */}
            {Object.keys(servicesByCategory).length > 0 ? (
              Object.entries(servicesByCategory).map(([category, services]) => {
                const CategoryIcon = categoryIcons[category] || Server;
                const categoryColor = categoryColors[category] || 'text-indigo-400';

                return (
                  <section key={category}>
                    <div className="flex items-center justify-between mb-6 px-1">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`h-5 w-5 ${categoryColor}`} />
                        <h2 className="text-xl font-semibold text-slate-200">{category}</h2>
                      </div>
                      {searchTerm && (
                        <span className="text-xs text-slate-600 font-mono">Found: {services.length}</span>
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
                          <Card className="h-full bg-slate-900/60 border-slate-800/80 hover:border-blue-500/30 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${service.color.replace('text', 'bg')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-lg font-medium text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    serviceStatus[service.id] === undefined
                                      ? 'bg-slate-600 animate-pulse'
                                      : serviceStatus[service.id]
                                        ? 'bg-emerald-500'
                                        : 'bg-red-500'
                                  }`}
                                  title={serviceStatus[service.id] === undefined ? 'Checking...' : serviceStatus[service.id] ? 'Online' : 'Offline'}
                                />
                                {service.name}
                              </CardTitle>
                              <service.icon className={`h-5 w-5 ${service.color} opacity-80 group-hover:opacity-100 transition-all group-hover:scale-110`} />
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="text-slate-400 text-sm line-clamp-1">
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
              <div className="text-center py-20 text-slate-500">
                <p className="text-lg">No services found for "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="text-blue-400 hover:underline mt-2 text-sm">Clear search</button>
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
                  <Globe className="h-5 w-5 text-purple-400" />
                  <h2 className="text-xl font-semibold text-slate-200">Hosted Websites</h2>
                </div>
                {searchTerm && (
                  <span className="text-xs text-slate-600 font-mono">Found: {filteredHosted.length}</span>
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
                      <Card className="h-full bg-slate-900/40 border-slate-800/60 hover:border-purple-500/30 hover:bg-slate-800 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                          <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors`}>
                            <site.icon className={`h-6 w-6 ${site.color}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                websiteStatus[site.id] === undefined
                                  ? 'bg-slate-600 animate-pulse'
                                  : websiteStatus[site.id]
                                    ? 'bg-emerald-500'
                                    : 'bg-red-500'
                              }`}
                              title={websiteStatus[site.id] === undefined ? 'Checking...' : websiteStatus[site.id] ? 'Online' : 'Offline'}
                            />
                            <CardTitle className="text-base font-medium text-slate-200 group-hover:text-purple-400 transition-colors">
                              {site.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <ExternalLink size={10} />
                            <span className="truncate max-w-[150px]">{site.url.replace('https://', '')}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500">
                  <p className="text-lg">No websites found for "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} className="text-purple-400 hover:underline mt-2 text-sm">Clear search</button>
                </div>
              )}
            </section>
          </div>
        )}

      </main>

      <footer className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-800/50 text-slate-600 text-sm pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <p className="flex items-center gap-1">© {currentTime.getFullYear()} Q2r Lab • Hosting at home, with love <Heart className="h-4 w-4 text-red-400 fill-red-400" /></p>
          <p className="flex items-center gap-1 opacity-70">
            Maintained by <span className="text-slate-400 hover:text-blue-400 transition-colors cursor-default">Quadeare</span>
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 pt-4 border-t border-slate-800/30">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
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