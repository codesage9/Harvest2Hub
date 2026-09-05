import React from 'react';
import { Sprout, ShieldCheck, Award, Heart, HelpCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#081C15] text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Problem Statement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white font-['Manrope',sans-serif]">
                Harvest<span className="text-emerald-400">2</span>Hub
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Empowering Indian farmers through automated slot booking, transparent grain grading, weighbridge automation, and instantaneous direct benefit transfers (DBT).
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 border border-emerald-800 rounded text-[11px] text-emerald-300 font-semibold">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              SIH Problem Statement: 26032
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Manrope',sans-serif]">
              Farmer Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/farmer/book-slot" className="hover:text-emerald-400 transition">
                  Book Mandi Procurement Slot
                </Link>
              </li>
              <li>
                <Link to="/farmer/track-order" className="hover:text-emerald-400 transition">
                  Live Gate Pass & Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-emerald-400 transition">
                  Kisan Community & Advisory Forum
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-emerald-400 transition">
                  Procurement Officer Direct Helpdesk
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="hover:text-emerald-400 transition">
                  DBT Payment Receipts & Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government & Compliance */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Manrope',sans-serif]">
              Institution & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/gov/dashboard" className="hover:text-emerald-400 transition">
                  Central APMC Hub Operations
                </Link>
              </li>
              <li>
                <Link to="/gov/demands" className="hover:text-emerald-400 transition">
                  MSP Quotas & Buffer Stocking
                </Link>
              </li>
              <li>
                <Link to="/ledger" className="hover:text-emerald-400 transition flex items-center gap-1 text-emerald-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Transparency Blockchain Ledger
                </Link>
              </li>
              <li>
                <span className="text-stone-400">Fair Average Quality (FAQ) Standards</span>
              </li>
              <li>
                <span className="text-stone-400">Public Financial Management System (PFMS)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: National Mandate Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Manrope',sans-serif]">
              National Support & Helpline
            </h4>
            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs space-y-1">
              <p className="text-stone-400">Kisan Call Center (Toll-Free):</p>
              <p className="text-white font-bold text-sm">1800-180-1551</p>
              <p className="text-[11px] text-emerald-400">Operating 24x7 in 22 Languages</p>
            </div>
            <p className="text-[11px] text-stone-400">
              Developed as an intelligent open-governance prototype for Smart India Hackathon (SIH 2026).
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 Harvest2Hub Portal. Ministry of Agriculture & Farmers Welfare, Government of India.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-stone-400">SIH Team Harvest2Hub</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Problem Statement #26032</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
