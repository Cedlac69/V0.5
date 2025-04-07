import React from 'react';
import { Menu, X, Home, Users, Briefcase, Building2, Settings, ClipboardList, GraduationCap } from 'lucide-react';
import QualificationManager from '../qualifications/QualificationManager';
import AgencyManager from '../agencies/AgencyManager';
import InterimManager from '../interims/InterimManager';

interface NavbarProps {
  onViewChange: (view: 'commandes' | 'interimaires' | 'clients') => void;
  className?: string;
}

const Navbar = ({ onViewChange, className = '' }: NavbarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showQualifications, setShowQualifications] = React.useState(false);
  const [showAgencies, setShowAgencies] = React.useState(false);
  const [showInterims, setShowInterims] = React.useState(false);

  const menuItems = [
    { icon: Home, text: 'Tableau de bord', href: '/' },
    { icon: Users, text: 'Intérimaires', onClick: () => onViewChange('interimaires') },
    { icon: Building2, text: 'Clients', onClick: () => onViewChange('clients') },
    { icon: ClipboardList, text: 'Commandes', onClick: () => onViewChange('commandes') },
  ];

  const handleQualificationsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowQualifications(true);
    setShowSettings(false);
  };

  const handleAgenciesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAgencies(true);
    setShowSettings(false);
  };

  return (
    <>
      <nav className={`${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <span className="text-[#FF9F00] text-2xl font-bold tracking-wide">ArchiFlow</span>
            </div>
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="flex-shrink-0">
                <div className="flex items-baseline space-x-4">
                  {menuItems.map((item) => (
                    <a
                      key={item.href || item.text}
                      href={item.href || '#'}
                      onClick={item.onClick}
                      className="text-white hover:bg-[#4CAF50]/20 px-4 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-[#4CAF50]/20 p-2 rounded-md transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={handleQualificationsClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      role="menuitem"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Qualifications
                    </button>
                    <button
                      onClick={handleAgenciesClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      role="menuitem"
                    >
                      <Building2 className="h-4 w-4" />
                      Agences
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-teal-600 focus:outline-none transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <a
                  key={item.href || item.text}
                  href={item.href || '#'}
                  onClick={item.onClick}
                  className="text-white hover:bg-teal-600 block px-4 py-3 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.text}
                </a>
              ))}
              <div className="border-t border-teal-600 pt-2">
                <p className="px-3 text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                  Paramètres
                </p>
                <button
                  onClick={handleQualificationsClick}
                  className="text-white hover:bg-teal-600 block w-full text-left px-4 py-3 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
                >
                  <GraduationCap className="h-5 w-5" />
                  Qualifications
                </button>
                <button
                  onClick={handleAgenciesClick}
                  className="text-white hover:bg-teal-600 block w-full text-left px-4 py-3 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
                >
                  <Building2 className="h-5 w-5" />
                  Agences
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {showQualifications && (
        <QualificationManager onClose={() => setShowQualifications(false)} />
      )}

      {showAgencies && (
        <AgencyManager onClose={() => setShowAgencies(false)} />
      )}

      {showInterims && (
        <InterimManager onClose={() => setShowInterims(false)} />
      )}
    </>
  );
};

export default Navbar;