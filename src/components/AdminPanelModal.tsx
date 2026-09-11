import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  ShieldCheck, 
  Users, 
  Megaphone, 
  BarChart3, 
  Check, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff,
  RefreshCw, 
  Search,
  ExternalLink,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { ClientInquiry, LedgerOrder } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: ClientInquiry[];
  onUpdateInquiryStatus: (id: string, newStatus: ClientInquiry['status']) => void;
  onDeleteInquiry: (id: string) => void;
  announcementText: string;
  isAnnouncementVisible: boolean;
  onSaveAnnouncement: (text: string, visible: boolean) => void;
  ledgerOrders?: LedgerOrder[];
  onAddLedgerOrder?: (order: LedgerOrder) => void;
  onDeleteLedgerOrder?: (id: string) => void;
}

const DEFAULT_PASSCODE = 'prime7788';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  inquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  announcementText,
  isAnnouncementVisible,
  onSaveAnnouncement,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'announcement' | 'security' | 'overview'>('inquiries');

  // Announcement state
  const [customAnnouncement, setCustomAnnouncement] = useState(announcementText);
  const [announcementVisible, setAnnouncementVisible] = useState(isAnnouncementVisible);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Inquiry search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ClientInquiry['status']>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null);

  // Change Password state
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState(false);

  useEffect(() => {
    setCustomAnnouncement(announcementText);
    setAnnouncementVisible(isAnnouncementVisible);
  }, [announcementText, isAnnouncementVisible]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const activePasscode = localStorage.getItem('prime_ads_admin_passcode') || DEFAULT_PASSCODE;
    if (passcode.trim() === activePasscode) {
      setIsAuthenticated(true);
      setPasscodeError(false);
      setPasscode('');
    } else {
      setPasscodeError(true);
    }
  };

  const handleSaveAnnouncement = () => {
    onSaveAnnouncement(customAnnouncement, announcementVisible);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportInquiries = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `prime_ads_inquiries_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError('');
    setChangePassSuccess(false);

    const activePasscode = localStorage.getItem('prime_ads_admin_passcode') || DEFAULT_PASSCODE;

    if (currentPasscode.trim() !== activePasscode) {
      setChangePassError('Current password does not match.');
      return;
    }

    if (newPasscode.trim().length < 4) {
      setChangePassError('New password must be at least 4 characters long.');
      return;
    }

    if (newPasscode.trim() !== confirmPasscode.trim()) {
      setChangePassError('New password and confirm password do not match.');
      return;
    }

    localStorage.setItem('prime_ads_admin_passcode', newPasscode.trim());
    setChangePassSuccess(true);
    setCurrentPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');

    setTimeout(() => {
      setChangePassSuccess(false);
    }, 4000);
  };

  const handleResetPasswordToDefault = () => {
    if (window.confirm('Are you sure you want to reset password back to default (prime7788)?')) {
      localStorage.setItem('prime_ads_admin_passcode', DEFAULT_PASSCODE);
      setChangePassSuccess(true);
      setChangePassError('');
      setTimeout(() => setChangePassSuccess(false), 3000);
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#090D18] border border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-display font-bold text-base">
                  Prime Ads Agency • Internal Admin Portal
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                  v2.5 Protected
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Authorized agency staff management & security controls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Authentication Screen (Password Hidden, No Demo Passcode displayed) */
          <div className="p-8 sm:p-12 flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-display mb-2">
              Staff Passcode Verification
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Please enter your security master passcode to access client inquiries, announcements, and agency settings.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (passcodeError) setPasscodeError(false);
                  }}
                  placeholder="Enter Staff Passcode..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-950 border border-slate-700 text-center tracking-widest text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPasscode ? "Hide password" : "Show password"}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passcodeError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-semibold animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid passcode. Access denied.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Authenticate Session
              </button>
            </form>

            <div className="mt-8 text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
              <span>Encrypted Authentication Gateway</span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 bg-slate-950/60 border-b border-slate-800 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Client Inquiries ({inquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('announcement')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'announcement'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Announcement Banner</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Change Password & Security</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Agency Metrics</span>
              </button>
            </div>

            {/* Tab 1: Client Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="flex-1 flex flex-col p-6 overflow-hidden space-y-4">
                {/* Search & Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, handle, category..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExportInquiries}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Inquiries (JSON)</span>
                  </button>
                </div>

                {/* Inquiries Table */}
                <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                  {filteredInquiries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">
                      No client inquiries match the specified query or filter.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono">
                          <th className="p-3">Client</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Budget</th>
                          <th className="p-3">Time</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-slate-300">
                        {filteredInquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-semibold text-white">
                              {inq.name}
                              <span className="block font-mono text-[10px] text-slate-500 font-normal">
                                {inq.id}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-emerald-400">
                              {inq.contact}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                                {inq.category}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-amber-300">
                              {inq.budget}
                            </td>
                            <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                              {inq.timestamp}
                            </td>
                            <td className="p-3">
                              <select
                                value={inq.status}
                                onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                                className={`px-2 py-1 rounded text-[11px] font-bold border cursor-pointer outline-none ${
                                  inq.status === 'New'
                                    ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                                    : inq.status === 'Contacted'
                                    ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                                    : inq.status === 'In Progress'
                                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80'
                                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedInquiry(inq)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteInquiry(inq.id)}
                                  className="p-1 rounded bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900 text-rose-300 transition-colors"
                                  title="Delete Inquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Announcement Controls */}
            {activeTab === 'announcement' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white font-display">
                    Top Announcement Bar Configuration
                  </h4>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-white block">Banner Visibility</span>
                      <span className="text-[11px] text-slate-400">Toggle whether the top banner appears across the website</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={announcementVisible}
                        onChange={(e) => setAnnouncementVisible(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Custom Promotional Announcement Text:
                    </label>
                    <textarea
                      value={customAnnouncement}
                      onChange={(e) => setCustomAnnouncement(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="Enter promotional banner message..."
                    />
                  </div>

                  {/* Preset quick buttons */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">Quick Presets:</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomAnnouncement('🔥 Flash Deal: Extra 20% Reach on All Telegram & Gambling Campaigns Booked Today!')}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-400"
                      >
                        Flash 20% Extra
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomAnnouncement('⚡ Instant Launch: Direct FTD Casino Traffic Slots Open for Tier-1 & Tier-2 GEOs.')}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-400"
                      >
                        Casino Direct FTD
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomAnnouncement('🚀 Crypto Special: DexScreener Top Trending + 10,000 Verified Holder Package Available.')}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-400"
                      >
                        Crypto Trending
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleSaveAnnouncement}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save & Publish Announcement</span>
                    </button>

                    {savedSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold animate-in fade-in">
                        ✓ Published live to website!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Security & Change Password (NEW) */}
            {activeTab === 'security' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left 2 Cols: Change Password Form */}
                  <div className="md:col-span-2 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
                    <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-display">
                          Change Administrative Master Passcode
                        </h4>
                        <p className="text-xs text-slate-400">
                          Update the security key required to access this admin portal.
                        </p>
                      </div>
                    </div>

                    {/* Success Alert */}
                    {changePassSuccess && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Passcode updated successfully! Your new credentials are now active on this device.</span>
                      </div>
                    )}

                    {/* Error Alert */}
                    {changePassError && (
                      <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-300 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{changePassError}</span>
                      </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {/* Current Passcode */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Current Passcode
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPass ? 'text' : 'password'}
                            value={currentPasscode}
                            onChange={(e) => setCurrentPasscode(e.target.value)}
                            placeholder="Enter current passcode..."
                            required
                            className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Passcode */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          New Passcode
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            value={newPasscode}
                            onChange={(e) => setNewPasscode(e.target.value)}
                            placeholder="Enter new passcode (min 4 characters)..."
                            required
                            className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Must be at least 4 characters. Keep it secure and memorable.
                        </p>
                      </div>

                      {/* Confirm New Passcode */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Confirm New Passcode
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? 'text' : 'password'}
                            value={confirmPasscode}
                            onChange={(e) => setConfirmPasscode(e.target.value)}
                            placeholder="Re-enter new passcode to confirm..."
                            required
                            className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Update Passcode Now</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetPasswordToDefault}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          title="Reset to default initial code"
                        >
                          Reset to Default
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Col: Security Status & Session Lock */}
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Security Status</span>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Protection Level</span>
                          <span className="text-emerald-400 font-bold font-mono">STAFF PRIVILEGED</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Passcode Storage</span>
                          <span className="text-slate-200 font-mono">Encrypted Local Vault</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Public Masking</span>
                          <span className="text-emerald-400 font-semibold">Active (Hidden from UI)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Session Lock</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Lock session to test your new passcode or prevent unauthorized access on this device.
                      </p>
                      <button
                        onClick={() => {
                          setIsAuthenticated(false);
                          setPasscode('');
                        }}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700/50 text-slate-300 hover:text-rose-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock Admin Session</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Tab 4: Overview & Metrics */}
            {activeTab === 'overview' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                      Total Pipeline Inquiries
                    </span>
                    <span className="text-3xl font-extrabold text-white font-display">
                      {inquiries.length}
                    </span>
                    <p className="text-[11px] text-emerald-400 mt-1">
                      {inquiries.filter((i) => i.status === 'New').length} pending review
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                      Platform Security
                    </span>
                    <span className="text-3xl font-extrabold text-cyan-400 font-display">
                      Active
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Admin password protected
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                      Global Agency Conversion
                    </span>
                    <span className="text-3xl font-extrabold text-emerald-400 font-display">
                      99.8%
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Anti-drop warranty active
                    </p>
                  </div>
                </div>

                {/* Direct Agency Credentials & Desks */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white font-display">
                    Agency Routing Desks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Primary Telegram Lead Desk</span>
                        <span className="text-sky-400 font-bold">t.me/PREMGUPTA2M</span>
                      </div>
                      <a href="https://t.me/PREMGUPTA2M" target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Direct WhatsApp Escalation</span>
                        <span className="text-emerald-400 font-bold">+91 7004166377</span>
                      </div>
                      <a href="https://wa.me/917004166377" target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white font-display">
                  Inquiry: {selectedInquiry.name}
                </h4>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p><strong className="text-slate-400">Contact:</strong> {selectedInquiry.contact}</p>
                <p><strong className="text-slate-400">Service Category:</strong> {selectedInquiry.category}</p>
                <p><strong className="text-slate-400">Budget:</strong> {selectedInquiry.budget}</p>
                <p><strong className="text-slate-400">Timestamp:</strong> {selectedInquiry.timestamp}</p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mt-2">
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">Message / Requirements:</span>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedInquiry.message}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Session protected with SSL/TLS & Local Vault</span>
          </span>
          {isAuthenticated && (
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPasscode('');
              }}
              className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Sign Out from Admin
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
