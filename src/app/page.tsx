'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Globe, Search, Folder, PlusCircle, HelpCircle, Archive,
  Bell, Settings, User, MoreVertical, Layers, ChevronDown, Monitor, Map
} from 'lucide-react';
import { useTranslation } from '../stores/useI18nStore';

export default function Dashboard() {
  const { t, lang, setLang } = useTranslation();
  const [activeSidebar, setActiveSidebar] = useState('projects');
  const [filterTab, setFilterTab] = useState('projects');
  const [popover, setPopover] = useState<string | null>(null);

  const togglePopover = (id: string) => {
    setPopover((prev) => (prev === id ? null : id));
  };

  const inventoryItems = [
    { id: '1', name: 'Untitled Map', icon: <Map size={16}/>, owner: 'Me', size: '14.2 MB', date: '2 mins ago', link: '/explorer', type: 'map' },
    { id: '2', name: 'Urban Expansion Analysis', icon: <Layers size={16}/>, owner: 'Team Alpha', size: '1.4 GB', date: 'Yesterday, 4:12 PM', link: '/explorer', type: 'layers' },
    { id: '3', name: 'Grid Network Beta', icon: <Globe size={16}/>, owner: 'Me', size: '84 KB', date: 'Oct 24, 2023', link: '/explorer', type: 'globe' }
  ];

  return (
    <div className="flex h-screen w-full bg-[#101214] text-zinc-300 font-sans overflow-hidden" onClick={() => setPopover(null)}>
      {/* Sidebar */}
      <aside className="w-16 md:w-20 bg-[#16181A] border-r border-zinc-800 flex flex-col items-center py-6 gap-8 shrink-0 transition-all">
        <div className="text-blue-500">
          <Globe size={28} />
        </div>
        <nav className="flex flex-col gap-6 flex-1 w-full items-center">
          <button 
            title={t('sidebar.search')}
            onClick={() => setActiveSidebar('search')}
            className={`transition-colors p-2 rounded-lg border-l-2 ${activeSidebar === 'search' ? 'text-zinc-300 bg-zinc-800/50 border-blue-500' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <Search size={22} />
          </button>
          <button 
            title={t('sidebar.projects')}
            onClick={() => setActiveSidebar('projects')}
            className={`transition-colors p-2 rounded-lg border-l-2 ${activeSidebar === 'projects' ? 'text-zinc-300 bg-zinc-800/50 border-blue-500 -ml-0.5' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <Folder size={22} />
          </button>
          <button 
            title={t('sidebar.new')}
            onClick={() => setActiveSidebar('new')}
            className={`transition-colors p-2 rounded-lg border-l-2 ${activeSidebar === 'new' ? 'text-zinc-300 bg-zinc-800/50 border-blue-500' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <PlusCircle size={22} />
          </button>
        </nav>
        <div className="flex flex-col gap-6 w-full items-center">
          <button 
            title={t('sidebar.help')}
            onClick={() => setActiveSidebar('help')}
            className={`transition-colors p-2 rounded-lg border-l-2 ${activeSidebar === 'help' ? 'text-zinc-300 bg-zinc-800/50 border-blue-500' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <HelpCircle size={22} />
          </button>
          <button 
            title={t('sidebar.archive')}
            onClick={() => setActiveSidebar('archive')}
            className={`transition-colors p-2 rounded-lg border-l-2 ${activeSidebar === 'archive' ? 'text-zinc-300 bg-zinc-800/50 border-blue-500' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <Archive size={22} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-12">
            <h1 className="text-zinc-100 font-bold text-lg tracking-tight">{t('header.title')}</h1>
            <nav className="flex gap-8 text-sm h-full hidden md:flex">
              <Link href="/explorer" className="text-zinc-500 hover:text-zinc-300 py-5 flex items-center">{t('header.explorer')}</Link>
              <div className="relative py-5 flex items-center">
                <span className="text-zinc-100 font-medium">{t('header.projects')}</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></span>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 py-5 flex items-center cursor-pointer">{t('header.assets')}</button>
            </nav>
          </div>
          
          <div className="flex items-center gap-6 text-zinc-400">
            {/* Bell Notification */}
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); togglePopover('bell'); }} className={`hover:text-zinc-200 transition-colors ${popover === 'bell' ? 'text-white' : ''}`}>
                <Bell size={18} />
              </button>
              {popover === 'bell' && (
                <div className="absolute right-0 top-8 w-48 p-3 bg-[#1e2024] border border-zinc-800 rounded-lg shadow-xl text-xs z-50 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                  <p className="text-zinc-300">{t('popovers.notifications')}</p>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); togglePopover('settings'); }} className={`hover:text-zinc-200 transition-colors ${popover === 'settings' ? 'text-white' : ''}`}>
                <Settings size={18} />
              </button>
              {popover === 'settings' && (
                <div className="absolute right-0 top-8 w-48 bg-[#1e2024] border border-zinc-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')} className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm text-zinc-300 font-medium transition-colors">
                    {lang === 'ko' ? 'Change to English' : '한국어로 변경'}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); togglePopover('user'); }} className={`h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition-all ${popover === 'user' ? 'ring-2 ring-blue-500 bg-zinc-700 text-white' : 'text-zinc-300'}`}>
                <User size={14} />
              </button>
              {popover === 'user' && (
                <div className="absolute right-0 top-10 w-40 bg-[#1e2024] border border-zinc-800 rounded-lg shadow-xl py-2 z-50 flex flex-col text-sm text-zinc-300 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                  <div className="px-4 py-1.5 border-b border-zinc-800 mb-1 font-semibold text-white">
                    {t('popovers.profile')}
                  </div>
                  <button className="px-4 py-2 hover:bg-zinc-800 w-full text-left">{t('popovers.settings')}</button>
                  <button className="px-4 py-2 hover:bg-zinc-800 w-full text-left text-red-400">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 pb-32">
          
          {/* Banner */}
          <div className="relative rounded-2xl bg-[#1e2024] border border-zinc-800 flex items-stretch h-56 md:h-48 shrink-0 shadow-sm overflow-hidden">
            <div className="z-10 bg-[#1e2024]/90 p-6 md:p-8 flex flex-col justify-center w-full md:w-3/5 lg:w-1/2 min-w-[280px] h-full backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-2 block">{t('banner.release')}</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2 md:mb-3 line-clamp-2 md:line-clamp-none">{t('banner.title')}</h2>
              <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-4 md:mb-6 line-clamp-3">
                {t('banner.description')}
              </p>
              <div>
                <Link href="/explorer" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm whitespace-nowrap">
                  {t('banner.button')}
                </Link>
              </div>
            </div>
            
            {/* Banner Background Pattern */}
            <div className="absolute inset-0 right-0 left-auto w-2/3 overflow-hidden pointer-events-none flex items-center justify-end pr-8 opacity-10 hidden sm:flex">
              <div className="grid grid-cols-4 md:grid-cols-5 gap-12 transform -rotate-12 scale-150">
                <Globe size={64} className="opacity-50" />
                <Map size={64} className="opacity-50" />
                <Layers size={64} className="opacity-50" />
                <Globe size={64} className="opacity-50" />
                <Map size={64} className="opacity-50" />
                <Layers size={64} className="opacity-50" />
                <Globe size={64} className="opacity-50" />
                <Map size={64} className="opacity-50" />
                <Layers size={64} className="opacity-50" />
                <Globe size={64} className="opacity-50" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e2024] via-[#1e2024]/80 to-transparent pointer-events-none w-2/3 hidden sm:block" />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800/80">
              <button 
                onClick={() => setFilterTab('projects')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filterTab === 'projects' ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                {t('filters.projects')}
              </button>
              <button 
                onClick={() => setFilterTab('archived')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filterTab === 'archived' ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                {t('filters.archived')}
              </button>
            </div>
            <div className="flex gap-2 md:gap-3 flex-wrap">
              <button className="flex items-center gap-2 px-3 md:px-4 py-1.5 text-sm font-medium rounded-md border border-zinc-800 bg-[#16181A] hover:bg-zinc-800/80 transition-colors">
                <span className="text-zinc-400">{t('filters.filterBy')}:</span> <span className="text-zinc-200 truncate max-w-[80px] md:max-w-none">{t('filters.ownerAll')}</span>
                <ChevronDown size={14} className="ml-1 opacity-50 shrink-0" />
              </button>
              <button className="flex items-center gap-2 px-3 md:px-4 py-1.5 text-sm font-medium rounded-md border border-zinc-800 bg-[#16181A] hover:bg-zinc-800/80 transition-colors">
                <span className="text-zinc-400">{t('filters.sort')}:</span> <span className="text-zinc-200 truncate max-w-[80px] md:max-w-none">{t('filters.lastModified')}</span>
              </button>
            </div>
          </div>

          {/* Project List */}
          <div className="bg-[#16181A] rounded-xl border border-zinc-800 shadow-sm">
            <div className="flex px-4 md:px-6 py-4 border-b border-zinc-800/70 justify-between items-center text-sm">
              <h3 className="font-semibold text-zinc-100">{t('inventory.title')}</h3>
              <span className="text-zinc-500 text-xs font-medium pl-2">{t('inventory.activeProjects', { count: inventoryItems.length })}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[600px]">
                <thead className="text-[10px] uppercase text-zinc-500 bg-[#1a1c1e] border-b border-zinc-800/70 font-semibold">
                  <tr>
                    <th className="px-6 py-3 tracking-wider">{t('inventory.colName')}</th>
                    <th className="px-6 py-3 tracking-wider hidden sm:table-cell">{t('inventory.colOwner')}</th>
                    <th className="px-6 py-3 tracking-wider hidden md:table-cell">{t('inventory.colStorage')}</th>
                    <th className="px-6 py-3 tracking-wider">{t('inventory.colLastModified')}</th>
                    <th className="px-6 py-3 tracking-wider text-right">{t('inventory.colActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-400">
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40 group transition-colors">
                      <td className="px-6 py-4">
                        <Link href={item.link} className="flex items-center gap-3 w-fit">
                          <div className={`p-2 rounded-md border shrink-0 ${
                            item.type === 'map' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            item.type === 'layers' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                            'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                          }`}>
                            {item.icon}
                          </div>
                          <span className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors truncate">{item.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">{item.owner}</td>
                      <td className="px-6 py-4 hidden md:table-cell whitespace-nowrap">{item.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4 text-right relative">
                         <button 
                           onClick={(e) => { e.stopPropagation(); togglePopover(`action-${item.id}`); }} 
                           className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
                         >
                           <MoreVertical size={16} />
                         </button>

                         {/* Action Menu Popover */}
                         {popover === `action-${item.id}` && (
                          <div className="absolute right-6 top-8 w-32 bg-[#1e2024] border border-zinc-700 rounded-lg shadow-2xl py-1 z-50 text-sm text-zinc-300 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                            <button className="w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors">{t('popovers.edit')}</button>
                            <button className="w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors">{t('popovers.share')}</button>
                            <div className="h-px bg-zinc-800 my-1"></div>
                            <button className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-red-400 transition-colors">{t('popovers.delete')}</button>
                          </div>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Floating Action Button */}
        <div className="absolute right-4 md:right-8 bottom-[4.5rem] md:bottom-20 z-40">
          <Link href="/explorer" className="flex items-center gap-2 bg-blue-100 hover:bg-white text-blue-900 font-bold px-5 md:px-6 py-3 md:py-3.5 rounded-full shadow-[0_8px_30px_rgb(59,130,246,0.3)] transition-all hover:scale-105 active:scale-95 border border-blue-200">
            <PlusCircle size={18} />
            <span className="hidden sm:inline">{t('footer.newProject')}</span>
          </Link>
        </div>

        {/* Footer */}
        <footer className="h-10 md:h-12 border-t border-zinc-800 px-4 md:px-8 flex items-center justify-between text-[10px] md:text-[11px] text-zinc-500 bg-[#121415] shrink-0 font-medium">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 ring-4 ring-green-500/20 animate-pulse shrink-0"></span>
              <span className="truncate max-w-[100px] sm:max-w-none">{t('footer.systemOnline')}: Node-West-01</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Monitor size={12} className="opacity-70" />
              <span>8.2 GB / 15 GB {t('footer.used')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
             <button className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"><Folder size={12} className="opacity-70 shrink-0" /> <span className="hidden md:inline">{t('footer.modifyKml')}</span></button>
             <span className="border-l border-zinc-800 pl-4 md:pl-6 text-zinc-600 truncate">{t('footer.lat')}: 34.05° N, {t('footer.lon')}: 118.24° W</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
