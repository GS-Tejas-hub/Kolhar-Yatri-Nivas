import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Hotel, Home, Building2, Info, Phone, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsAdmin(currentUser?.role === 'admin');
      } catch (error) {
        setUser(null);
        setIsAdmin(false);
      }
    };
    checkUser();
  }, []);

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    base44.auth.logout();
  };

  const isActive = (pageName) => location.pathname === createPageUrl(pageName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <style>{`
        :root {
          --primary: #D4745C;
          --primary-dark: #B85C45;
          --secondary: #2D5F4F;
          --accent: #C9A96E;
          --cream: #F9F6F1;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-400 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <Hotel className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Kolhar Yatri Nivas
                </h1>
                <p className="text-xs text-gray-500 font-medium">Your Home Away From Home</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to={createPageUrl("Home")}>
                <Button 
                  variant="ghost" 
                  className={`gap-2 ${isActive("Home") ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"}`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <Link to={createPageUrl("Lodges")}>
                <Button 
                  variant="ghost" 
                  className={`gap-2 ${isActive("Lodges") ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"}`}
                >
                  <Building2 className="w-4 h-4" />
                  Our Lodges
                </Button>
              </Link>
              <Link to={createPageUrl("About")}>
                <Button 
                  variant="ghost" 
                  className={`gap-2 ${isActive("About") ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"}`}
                >
                  <Info className="w-4 h-4" />
                  About Us
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button 
                  variant="ghost" 
                  className={`gap-2 ${isActive("Contact") ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"}`}
                >
                  <Phone className="w-4 h-4" />
                  Contact
                </Button>
              </Link>
              
              {isAdmin && (
                <Link to={createPageUrl("AdminDashboard")}>
                  <Button 
                    variant="ghost" 
                    className={`gap-2 ml-2 ${isActive("AdminDashboard") ? "bg-green-50 text-green-600" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`}
                  >
                    <User className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              )}

              {user && (
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="gap-2 ml-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              )}

              {!user && (
                <Button 
                  onClick={() => base44.auth.redirectToLogin()}
                  className="ml-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
                >
                  Owner Login
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-20 left-0 right-0 mx-4 rounded-2xl bg-white shadow-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <Link to={createPageUrl("Home")}>
                <Button variant="ghost" className={`w-full justify-start ${isActive("Home") ? "bg-orange-50 text-orange-600" : "text-gray-700"}`}>
                  <Home className="w-4 h-4 mr-2" /> Home
                </Button>
              </Link>
              <Link to={createPageUrl("Lodges")}>
                <Button variant="ghost" className={`w-full justify-start ${isActive("Lodges") ? "bg-orange-50 text-orange-600" : "text-gray-700"}`}>
                  <Building2 className="w-4 h-4 mr-2" /> Our Lodges
                </Button>
              </Link>
              <Link to={createPageUrl("About")}>
                <Button variant="ghost" className={`w-full justify-start ${isActive("About") ? "bg-orange-50 text-orange-600" : "text-gray-700"}`}>
                  <Info className="w-4 h-4 mr-2" /> About Us
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="ghost" className={`w-full justify-start ${isActive("Contact") ? "bg-orange-50 text-orange-600" : "text-gray-700"}`}>
                  <Phone className="w-4 h-4 mr-2" /> Contact
                </Button>
              </Link>
              {isAdmin && (
                <Link to={createPageUrl("AdminDashboard")}>
                  <Button variant="ghost" className={`w-full justify-start ${isActive("AdminDashboard") ? "bg-green-50 text-green-600" : "text-gray-700"}`}>
                    <User className="w-4 h-4 mr-2" /> Admin
                  </Button>
                </Link>
              )}
              {user ? (
                <Button variant="ghost" className="w-full justify-start text-gray-700" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              ) : (
                <Button className="w-full justify-center bg-gradient-to-r from-orange-500 to-rose-500 text-white" onClick={() => base44.auth.redirectToLogin()}>
                  Owner Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-[calc(100vh-320px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-400 rounded-lg flex items-center justify-center">
                  <Hotel className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Kolhar Yatri Nivas</h3>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Experience luxury and comfort in the heart of nature. Your perfect getaway awaits.
              </p>
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-9 h-9 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-sm">𝕏</span>
                </div>
                <div className="w-9 h-9 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={createPageUrl("Home")} className="hover:text-orange-400 transition-colors">Home</Link></li>
                <li><Link to={createPageUrl("Lodges")} className="hover:text-orange-400 transition-colors">Our Lodges</Link></li>
                <li><Link to={createPageUrl("About")} className="hover:text-orange-400 transition-colors">About Us</Link></li>
                <li><Link to={createPageUrl("Contact")} className="hover:text-orange-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Cancellation Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Kolhar Yatri Nivas. All rights reserved. Crafted with care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


