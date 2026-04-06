import Link from 'next/link';
import {
  Globe, Search, Folder, PlusCircle, HelpCircle, Archive,
  Bell, Settings, User, MoreVertical, Layers, ChevronDown, Monitor, Map
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-[#101214] text-zinc-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 bg-[#16181A] border-r border-zinc-800 flex flex-col items-center py-6 gap-8">
        <div className="text-blue-500">
          <Globe size={28} />
        </div>
        <nav className="flex flex-col gap-6 flex-1">
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <Search size={22} />
          </button>
          <button className="text-zinc-300 bg-zinc-800/50 p-2 rounded-lg border-l-2 border-blue-500 -ml-0.5">
            <Folder size={22} />
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <PlusCircle size={22} />
          </button>
        </nav>
        <div className="flex flex-col gap-6">
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <HelpCircle size={22} />
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <Archive size={22} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-12">
            <h1 className="text-zinc-100 font-bold text-lg tracking-tight">WorMap Geospatial</h1>
            <nav className="flex gap-8 text-sm h-full">
              <Link href="/explorer" className="text-zinc-500 hover:text-zinc-300 py-5 flex items-center">Explorer</Link>
              <div className="relative py-5 flex items-center">
                <span className="text-zinc-100 font-medium">Projects</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></span>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 py-5 flex items-center cursor-pointer">Assets</button>
            </nav>
          </div>
          <div className="flex items-center gap-6 text-zinc-400">
            <button className="hover:text-zinc-200"><Bell size={18} /></button>
            <button className="hover:text-zinc-200"><Settings size={18} /></button>
            <button className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors">
              <User size={14} />
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 pb-32">
          
          {/* Banner */}
          <div className="relative rounded-2xl bg-[#1e2024] border border-zinc-800 overflow-hidden flex items-stretch h-48">
            <div className="z-10 bg-[#1e2024]/90 p-8 flex flex-col justify-center w-1/2 min-w-[500px] h-full backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-2">New Release</span>
              <h2 className="text-3xl font-semibold text-white mb-3">Experience WorMap v4.0</h2>
              <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-6">
                Introducing multi-layered topographic contouring and real-time 3D terrain rendering. Optimized for large-scale enterprise spatial data management.
              </p>
              <div>
                <Link href="/explorer" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm">
                  Explore Layers
                </Link>
              </div>
            </div>
            
            {/* Banner Background Pattern using Lucide Icons */}
            <div className="absolute inset-0 right-0 left-auto w-2/3 overflow-hidden pointer-events-none flex items-center justify-end pr-8 opacity-10">
              <div className="grid grid-cols-5 gap-12 transform -rotate-12 scale-150">
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
            {/* Gradient fade to blend left and right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e2024] via-[#1e2024]/80 to-transparent pointer-events-none w-2/3" />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800/80">
              <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50">Google Drive</button>
              <button className="px-4 py-1.5 text-sm font-medium rounded-md text-zinc-400 hover:text-zinc-200 transition-colors">Local Device</button>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md border border-zinc-800 bg-[#16181A] hover:bg-zinc-800/80 transition-colors">
                <span className="text-zinc-400">Filter by:</span> <span className="text-zinc-200">Owner: All</span>
                <ChevronDown size={14} className="ml-1 opacity-50" />
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md border border-zinc-800 bg-[#16181A] hover:bg-zinc-800/80 transition-colors">
                <span className="text-zinc-400">Sort:</span> <span className="text-zinc-200">Last Modified</span>
              </button>
            </div>
          </div>

          {/* Project List */}
          <div className="bg-[#16181A] rounded-xl border border-zinc-800 overflow-hidden shadow-sm">
            <div className="flex px-6 py-4 border-b border-zinc-800/70 justify-between items-center text-sm">
              <h3 className="font-semibold text-zinc-100">Project Inventory</h3>
              <span className="text-zinc-500 text-xs font-medium">4 Active Projects</span>
            </div>
            
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase text-zinc-500 bg-[#1a1c1e] border-b border-zinc-800/70 font-semibold">
                <tr>
                  <th className="px-6 py-3 tracking-wider">Name</th>
                  <th className="px-6 py-3 tracking-wider">Owner</th>
                  <th className="px-6 py-3 tracking-wider">Storage Used</th>
                  <th className="px-6 py-3 tracking-wider">Last Modified</th>
                  <th className="px-6 py-3 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-400">
                {[
                  { name: 'Untitled Map', icon: <Map size={16}/>, owner: 'Me', size: '14.2 MB', date: '2 mins ago', link: '/explorer', type: 'map' },
                  { name: 'Urban Expansion Analysis', icon: <Layers size={16}/>, owner: 'Team Alpha', size: '1.4 GB', date: 'Yesterday, 4:12 PM', link: '/explorer', type: 'layers' },
                  { name: 'Grid Network Beta', icon: <Globe size={16}/>, owner: 'Me', size: '84 KB', date: 'Oct 24, 2023', link: '/explorer', type: 'globe' }
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-zinc-800/40 group transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <Link href={item.link} className="flex items-center gap-3 w-fit">
                        <div className={`p-2 rounded-md border ${
                          item.type === 'map' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          item.type === 'layers' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                          'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                        }`}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">{item.name}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">{item.owner}</td>
                    <td className="px-6 py-4">{item.size}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4 text-right pr-6">
                       <button className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-md hover:bg-zinc-700 transition-colors">
                         <MoreVertical size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Floating Action Button */}
        <div className="absolute right-8 bottom-[4.5rem]">
          <Link href="/explorer" className="flex items-center gap-2 bg-blue-100 hover:bg-white text-blue-900 font-bold px-6 py-3.5 rounded-full shadow-xl shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 border border-blue-200">
            <PlusCircle size={18} />
            <span>New Project</span>
          </Link>
        </div>

        {/* Footer */}
        <footer className="h-10 border-t border-zinc-800 px-8 flex items-center justify-between text-[11px] text-zinc-500 bg-[#121415] shrink-0 font-medium">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 ring-4 ring-green-500/20 animate-pulse"></span>
              <span>System Online: Node-West-01</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor size={12} className="opacity-70" />
              <span>8.2 GB / 15 GB Used</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <button className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"><Folder size={12} className="opacity-70" /> Modify Local KML</button>
             <span className="border-l border-zinc-800 pl-6 text-zinc-600">Lat: 34.0522° N, Lon: 118.2437° W</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
