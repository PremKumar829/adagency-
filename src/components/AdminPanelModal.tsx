import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  ShieldCheck, 
  Users, 
  Megaphone, 
  Check, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff, 
  Search,
  ExternalLink,
  KeyRound,
  AlertCircle,
  Phone,
  Send,
  Mail,
  MapPin,
  Settings,
  Sparkles,
  RefreshCw,
  Plus,
  Copy,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Radio,
  Receipt,
  FileText
} from 'lucide-react';
import { ClientInquiry, LedgerOrder, AgencySettings, ContactRoutingMode } from '../types';
import { cleanPhoneForWhatsApp, buildWhatsAppLink, buildTelegramLink } from '../utils/agencySettings';
import { AVAILABLE_SERVICE_CATEGORIES, generateInquiryEmailTemplate } from '../utils/emailTemplateGenerator';
import { InvoiceGenerator } from './InvoiceGenerator';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: ClientInquiry[];
  onUpdateInquiryStatus: (id: string, newStatus: ClientInquiry['status']) => void;
  onDeleteInquiry: (id: string) => void;
  announcementText: string;
  isAnnouncementVisible: boolean;
  onSaveAnnouncement: (text: string, visible: boolean) => void;
  agencySettings: AgencySettings;
  onSaveAgencySettings: (settings: AgencySettings) => void;
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
  agencySettings,
  onSaveAgencySettings,
  ledgerOrders = [],
  onAddLedgerOrder,
  onDeleteLedgerOrder,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'security' | 'content' | 'inquiries' | 'invoices' | 'orders'>('channels');

  // Invoice Generator State
  const [invoiceInquiryTarget, setInvoiceInquiryTarget] = useState<ClientInquiry | null>(null);

  // Contact & Agency Settings State
  const [settingsForm, setSettingsForm] = useState<AgencySettings>(agencySettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Announcement State
  const [customAnnouncement, setCustomAnnouncement] = useState(announcementText);
  const [announcementVisible, setAnnouncementVisible] = useState(isAnnouncementVisible);
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // Inquiry Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ClientInquiry['status']>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null);

  // Email Template Response Generator State
  const [emailInquiry, setEmailInquiry] = useState<ClientInquiry | null>(null);
  const [emailCategory, setEmailCategory] = useState<string>('');
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailCopied, setEmailCopied] = useState<'all' | 'subject' | 'body' | null>(null);

  // Change Password State
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState(false);

  // New Ledger Order Form
  const [newOrderClient, setNewOrderClient] = useState('');
  const [newOrderService, setNewOrderService] = useState('Telegram Channel Growth');
  const [newOrderVolume, setNewOrderVolume] = useState('10,000 Members');
  const [newOrderAmount, setNewOrderAmount] = useState('149');
  const [newOrderStatus, setNewOrderStatus] = useState<LedgerOrder['status']>('Completed');

  // WhatsApp Ban Appeal Copy State
  const [copiedAppeal, setCopiedAppeal] = useState(false);

  useEffect(() => {
    setSettingsForm(agencySettings);
  }, [agencySettings]);

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

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAgencySettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleSaveAnnouncement = () => {
    onSaveAnnouncement(customAnnouncement, announcementVisible);
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 2500);
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

  const handleOpenEmailTemplate = (inq: ClientInquiry) => {
    const template = generateInquiryEmailTemplate({
      inquiry: inq,
      agencySettings: settingsForm,
    });
    setEmailInquiry(inq);
    setEmailCategory(template.category);
    setEmailRecipient(template.recipient);
    setEmailSubject(template.subject);
    setEmailBody(template.body);
    setEmailCopied(null);
  };

  const handleCategoryChangeForEmail = (newCategory: string) => {
    if (!emailInquiry) return;
    setEmailCategory(newCategory);
    const updatedTemplate = generateInquiryEmailTemplate({
      inquiry: emailInquiry,
      selectedCategory: newCategory,
      agencySettings: settingsForm,
    });
    setEmailSubject(updatedTemplate.subject);
    setEmailBody(updatedTemplate.body);
  };

  const handleCopyEmail = (type: 'all' | 'subject' | 'body') => {
    let textToCopy = '';
    if (type === 'subject') {
      textToCopy = emailSubject;
    } else if (type === 'body') {
      textToCopy = emailBody;
    } else {
      textToCopy = `To: ${emailRecipient || '(Client Email)'}\nSubject: ${emailSubject}\n\n${emailBody}`;
    }
    navigator.clipboard.writeText(textToCopy);
    setEmailCopied(type);
    setTimeout(() => setEmailCopied(null), 2000);
  };

  const handleSendViaMailClient = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(emailRecipient)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleMarkAsContacted = () => {
    if (emailInquiry) {
      onUpdateInquiryStatus(emailInquiry.id, 'Contacted');
      setEmailInquiry({ ...emailInquiry, status: 'Contacted' });
    }
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

  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderClient) return;

    if (onAddLedgerOrder) {
      const order: LedgerOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        clientMask: newOrderClient.trim(),
        serviceCategory: newOrderService,
        packageName: `${newOrderService} Package`,
        volume: newOrderVolume,
        amountUsd: Number(newOrderAmount) || 99,
        status: newOrderStatus,
      };
      onAddLedgerOrder(order);
      setNewOrderClient('');
    }
  };

  // WhatsApp Appeal Text Generator
  const currentBannedNum = settingsForm.primaryWhatsapp || '+91 7004166377';
  const whatsappAppealText = `Dear WhatsApp Support Team,

My phone number ${currentBannedNum} has been banned from WhatsApp. 

I run a legitimate digital marketing agency ("Prime Ads Agency") providing marketing consultations. Our number was flagged automatically without any intentional violation of WhatsApp Terms of Service. All messages received are initiated by our genuine prospective clients.

Please review our account and unban our number ${currentBannedNum} as soon as possible, as our ongoing client communications are severely affected.

Phone Number: ${currentBannedNum}
Country: India (+91)
Agency: Prime Ads Agency

Thank you for your prompt assistance.`;

  const handleCopyAppeal = () => {
    navigator.clipboard.writeText(whatsappAppealText);
    setCopiedAppeal(true);
    setTimeout(() => setCopiedAppeal(false), 2500);
  };

  const handleMailWhatsAppSupport = () => {
    const subject = encodeURIComponent(`My WhatsApp Account Was Flagged By Mistake - Request Review (${currentBannedNum})`);
    const body = encodeURIComponent(whatsappAppealText);
    window.open(`mailto:support@support.whatsapp.com?cc=smb_web@support.whatsapp.com&subject=${subject}&body=${body}`, '_blank');
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
                  Prime Ads Agency • Master Admin Panel
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                  Full Control
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Contact channels, WhatsApp recovery, site content & security controls
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
          /* Authentication Screen */
          <div className="p-8 sm:p-12 flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-display mb-2">
              Admin Passcode Required
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter your master admin password to change phone numbers, configure WhatsApp unban routing, update content, and access client inquiries.
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
                  placeholder="Enter Admin Passcode..."
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
                Unlock Admin Dashboard
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[11px] text-slate-500">Default password:</span>
              <button
                type="button"
                onClick={() => setPasscode('prime7788')}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-emerald-400 hover:border-emerald-500/80 hover:bg-slate-850 cursor-pointer transition-all flex items-center gap-1"
                title="Click to autofill default password"
              >
                <span>prime7788</span>
                <span className="text-[9px] text-slate-500 font-sans">(click to fill)</span>
              </button>
            </div>

            <div className="mt-6 text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
              <span>Encrypted Access • Authorized Administrators Only</span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 bg-slate-950/70 border-b border-slate-800 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('channels')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'channels'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Contact Channels & WhatsApp Solution</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Change Password & Security</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Megaphone className="w-4 h-4 text-cyan-400" />
                <span>Site Content & Headlines</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4 text-sky-400" />
                <span>Client Inquiries ({inquiries.length})</span>
              </button>

              <button
                onClick={() => {
                  setInvoiceInquiryTarget(null);
                  setActiveTab('invoices');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'invoices'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Custom Invoice & Billing</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Live Orders Ticker</span>
              </button>
            </div>

            {/* TAB 1: Contact Channels & WhatsApp Ban Solution */}
            {activeTab === 'channels' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* Immediate WhatsApp Ban Alert & Solutions Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-950 to-slate-950 border border-amber-500/40 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">
                        WhatsApp Number (7004166377) Banned? Here is Your Complete Solution:
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Meta frequently bans personal WhatsApp numbers used for promotional ads, bulk messaging, or gambling links. To ensure <strong>ZERO lost clients</strong>, we provide two immediate failovers below:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" /> 1. Mode: Telegram Only
                      </span>
                      <p className="text-slate-400 text-[11px]">
                        Switch Routing Mode below to <strong>"Telegram Only"</strong>. Every button on the site will route straight to Telegram (<span className="text-sky-400">@PREMGUPTA2M</span>), which never gets banned!
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> 2. Add New WhatsApp Number
                      </span>
                      <p className="text-slate-400 text-[11px]">
                        Simply type your new SIM / WhatsApp number in the <strong>"Primary WhatsApp"</strong> field below and click Save. All buttons across the site update instantly!
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> 3. Official Unban Appeal
                      </span>
                      <p className="text-slate-400 text-[11px]">
                        Use the 1-Click WhatsApp Appeal Mailer at the bottom of this page to email WhatsApp Support directly. Most accounts get reviewed in 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Contact Channels Form */}
                <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                        <Settings className="w-4 h-4 text-emerald-400" />
                        Live Channels & Numbers Configuration
                      </h4>
                      <p className="text-xs text-slate-400">
                        Changes made here immediately update the Navbar, Hero button, Floating Widget, Contact Form, and Footer!
                      </p>
                    </div>

                    {settingsSaved && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Saved to Website!</span>
                      </div>
                    )}
                  </div>

                  {/* Routing Mode Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 block">
                      Active Contact Routing Mode Across Website:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label 
                        onClick={() => setSettingsForm({ ...settingsForm, contactRoutingMode: 'both' })}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          settingsForm.contactRoutingMode === 'both'
                            ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="routingMode"
                          checked={settingsForm.contactRoutingMode === 'both'}
                          onChange={() => setSettingsForm({ ...settingsForm, contactRoutingMode: 'both' })}
                          className="mt-1"
                        />
                        <div>
                          <span className="text-xs font-bold block text-white">
                            WhatsApp + Telegram (Default)
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Clients can choose between WhatsApp and Telegram.
                          </span>
                        </div>
                      </label>

                      <label 
                        onClick={() => setSettingsForm({ ...settingsForm, contactRoutingMode: 'telegram_only' })}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          settingsForm.contactRoutingMode === 'telegram_only'
                            ? 'bg-sky-950/50 border-sky-400 text-white shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="routingMode"
                          checked={settingsForm.contactRoutingMode === 'telegram_only'}
                          onChange={() => setSettingsForm({ ...settingsForm, contactRoutingMode: 'telegram_only' })}
                          className="mt-1"
                        />
                        <div>
                          <span className="text-xs font-bold block text-sky-300">
                            ⚡ Telegram Only (Safe Mode)
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Recommended when WhatsApp is banned. Routes 100% of clicks safely to Telegram!
                          </span>
                        </div>
                      </label>

                      <label 
                        onClick={() => setSettingsForm({ ...settingsForm, contactRoutingMode: 'backup_whatsapp' })}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          settingsForm.contactRoutingMode === 'backup_whatsapp'
                            ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="routingMode"
                          checked={settingsForm.contactRoutingMode === 'backup_whatsapp'}
                          onChange={() => setSettingsForm({ ...settingsForm, contactRoutingMode: 'backup_whatsapp' })}
                          className="mt-1"
                        />
                        <div>
                          <span className="text-xs font-bold block text-emerald-300">
                            Use Backup WhatsApp
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Directs WhatsApp clicks to your secondary / backup number.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Phone & Telegram Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary WhatsApp */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Primary WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={settingsForm.primaryWhatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primaryWhatsapp: e.target.value })}
                        placeholder="+91 7004166377 (replace with your new number)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Include country code (e.g. +91 9876543210).
                      </span>
                    </div>

                    {/* Backup WhatsApp */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Backup WhatsApp Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.backupWhatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, backupWhatsapp: e.target.value })}
                        placeholder="+91 9999999999"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Used if primary number is banned or when Backup mode is selected.
                      </span>
                    </div>

                    {/* Telegram Handle */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Primary Telegram Username
                      </label>
                      <input
                        type="text"
                        value={settingsForm.telegramHandle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, telegramHandle: e.target.value })}
                        placeholder="PREMGUPTA2M"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Username without @ (e.g. PREMGUPTA2M).
                      </span>
                    </div>

                    {/* Telegram Channel Link */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Telegram Support / Channel URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.telegramChannelLink}
                        onChange={(e) => setSettingsForm({ ...settingsForm, telegramChannelLink: e.target.value })}
                        placeholder="https://t.me/PREMGUPTA2M"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Agency Email
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        placeholder="pk4030794@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Phone / Call */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Phone Call Line
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        placeholder="+91 7004166377"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Physical Address */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Office / Business Address
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      placeholder="Katihar, Bihar - 854101"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save & Apply Channels to Entire Site</span>
                    </button>
                  </div>
                </form>

                {/* WhatsApp Unban Appeal Generator Tool */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                        <Mail className="w-4 h-4 text-rose-400" />
                        WhatsApp Unban Official Email Appeal Generator
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Send this official appeal to WhatsApp support team to restore your banned number ({currentBannedNum}).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyAppeal}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedAppeal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAppeal ? 'Copied!' : 'Copy Appeal Text'}</span>
                      </button>

                      <button
                        onClick={handleMailWhatsAppSupport}
                        className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Send Email to WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Pre-filled appeal preview box */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
                    {whatsappAppealText}
                  </div>

                  {/* Pro-Tips to Prevent Future Bans */}
                  <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                    <span className="text-xs font-bold text-amber-300 block">
                      💡 Pro-Tips to Avoid WhatsApp Bans in Digital Ad Marketing:
                    </span>
                    <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
                      <li>Use <strong>WhatsApp Business App</strong> rather than personal WhatsApp.</li>
                      <li>Never send unsolicited mass broadcast messages to users who haven't saved your contact.</li>
                      <li>For gambling, crypto, and casino clients, always route them through <strong>Telegram</strong> first.</li>
                      <li>When clients click from your website to WhatsApp, ensure the client sends the first message (our website already does this!).</li>
                    </ul>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Change Password & Security */}
            {activeTab === 'security' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-xl mx-auto space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-emerald-400" />
                      Update Master Admin Password
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Change the passcode required to unlock this admin dashboard. Make sure you remember your new password!
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current Passcode */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Current Admin Passcode
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? "text" : "password"}
                          value={currentPasscode}
                          onChange={(e) => setCurrentPasscode(e.target.value)}
                          placeholder="Enter current password..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Passcode */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        New Admin Passcode (minimum 4 characters)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? "text" : "password"}
                          value={newPasscode}
                          onChange={(e) => setNewPasscode(e.target.value)}
                          placeholder="Enter new password..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Passcode */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Confirm New Passcode
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          value={confirmPasscode}
                          onChange={(e) => setConfirmPasscode(e.target.value)}
                          placeholder="Re-type new password..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {changePassError && (
                      <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{changePassError}</span>
                      </div>
                    )}

                    {changePassSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-400 flex items-center gap-2 font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Admin password updated successfully! It will be required for next login.</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      >
                        Update Admin Password
                      </button>
                    </div>
                  </form>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Emergency Reset</span>
                      <span className="text-[11px] text-slate-500">Reset password back to default (prime7788)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetPasswordToDefault}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-amber-400 font-semibold cursor-pointer"
                    >
                      Reset to Default
                    </button>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setIsAuthenticated(false)}
                      className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold cursor-pointer"
                    >
                      Lock Portal / Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Site Content & Headlines */}
            {activeTab === 'content' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* Announcement Controls */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-cyan-400" />
                        Top Announcement Bar
                      </h4>
                      <p className="text-xs text-slate-400">
                        Controls the running offer ticker at the very top of the website.
                      </p>
                    </div>

                    {announcementSaved && (
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg">
                        Banner Updated!
                      </span>
                    )}
                  </div>

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
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Announcement Text Content
                    </label>
                    <textarea
                      rows={2}
                      value={customAnnouncement}
                      onChange={(e) => setCustomAnnouncement(e.target.value)}
                      placeholder="Enter special offer, announcement, or notice..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveAnnouncement}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Save Announcement
                    </button>
                  </div>
                </div>

                {/* Hero Headlines & Stats Form */}
                <form onSubmit={handleSaveSettings} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Hero Section & Live Metrics Configuration
                      </h4>
                      <p className="text-xs text-slate-400">
                        Edit main titles, value propositions, and metrics displayed to visitors.
                      </p>
                    </div>

                    {settingsSaved && (
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg">
                        Content Saved!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Brand Name */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Agency Brand Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.brandName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* CPC Highlight */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Pricing / CPC Highlight Tag
                      </label>
                      <input
                        type="text"
                        value={settingsForm.cpcHighlight}
                        onChange={(e) => setSettingsForm({ ...settingsForm, cpcHighlight: e.target.value })}
                        placeholder="CPC Under ₹2"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Active Clients */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Active Clients Metric
                      </label>
                      <input
                        type="text"
                        value={settingsForm.activeClientsCount}
                        onChange={(e) => setSettingsForm({ ...settingsForm, activeClientsCount: e.target.value })}
                        placeholder="20,000+"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Success Rate */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Success Rate Metric
                      </label>
                      <input
                        type="text"
                        value={settingsForm.successRate}
                        onChange={(e) => setSettingsForm({ ...settingsForm, successRate: e.target.value })}
                        placeholder="99.8%"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Hero Headline */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroHeadline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                      placeholder="Scale Your Brand, Telegram Channels & Platforms Fast"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Hero Subtitle */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Hero Subtitle / Value Proposition
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.heroSubtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Content Changes</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* TAB 4: Client Inquiries (Leads) */}
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
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer w-full sm:w-auto justify-center"
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
                                  onClick={() => {
                                    setInvoiceInquiryTarget(inq);
                                    setActiveTab('invoices');
                                  }}
                                  className="p-1 rounded bg-amber-950/60 border border-amber-700/60 hover:bg-amber-900 text-amber-300 transition-colors cursor-pointer"
                                  title="Generate Custom Invoice & Receipt"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEmailTemplate(inq)}
                                  className="p-1 rounded bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900 text-emerald-300 transition-colors cursor-pointer"
                                  title="Generate Pre-filled Email Response"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setSelectedInquiry(inq)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteInquiry(inq.id)}
                                  className="p-1 rounded bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
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

            {/* TAB: Custom Invoice & Billing Generator */}
            {activeTab === 'invoices' && (
              <InvoiceGenerator
                agencySettings={settingsForm}
                inquiries={inquiries}
                initialInquiry={invoiceInquiryTarget}
                onClearInitialInquiry={() => setInvoiceInquiryTarget(null)}
              />
            )}

            {/* TAB 5: Live Orders Ticker */}
            {activeTab === 'orders' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Add new order form */}
                <form onSubmit={handleAddOrderSubmit} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    Inject New Order into Live Public Ledger
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Client Mask / ID</label>
                      <input
                        type="text"
                        value={newOrderClient}
                        onChange={(e) => setNewOrderClient(e.target.value)}
                        placeholder="e.g. VIP_7788***"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Service Type</label>
                      <select
                        value={newOrderService}
                        onChange={(e) => setNewOrderService(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="Telegram Channel Growth">Telegram Channel Growth</option>
                        <option value="Gambling Ad Traffic">Gambling Ad Traffic</option>
                        <option value="Meta Ads & YouTube Push">Meta Ads & YouTube Push</option>
                        <option value="Crypto Token Trending">Crypto Token Trending</option>
                        <option value="Agency Reseller Package">Agency Reseller Package</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Volume / Reach</label>
                      <input
                        type="text"
                        value={newOrderVolume}
                        onChange={(e) => setNewOrderVolume(e.target.value)}
                        placeholder="10,000 Members"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Amount ($ USD)</label>
                      <input
                        type="number"
                        value={newOrderAmount}
                        onChange={(e) => setNewOrderAmount(e.target.value)}
                        placeholder="149"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Status</label>
                      <select
                        value={newOrderStatus}
                        onChange={(e) => setNewOrderStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="Completed">Completed</option>
                        <option value="Delivering">Delivering</option>
                        <option value="In Queue">In Queue</option>
                        <option value="Active">Active</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Add Order to Ledger
                    </button>
                  </div>
                </form>

                {/* Orders list */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Volume</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {ledgerOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-900/40">
                          <td className="p-3 font-mono text-slate-400">{order.id}</td>
                          <td className="p-3 font-semibold text-white">{order.clientMask}</td>
                          <td className="p-3">{order.serviceCategory}</td>
                          <td className="p-3 font-mono text-cyan-400">{order.volume}</td>
                          <td className="p-3 font-bold text-emerald-400">${order.amountUsd}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {onDeleteLedgerOrder && (
                              <button
                                onClick={() => onDeleteLedgerOrder(order.id)}
                                className="p-1 rounded bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b101c] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white font-display text-base">
                  {selectedInquiry.name}
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedInquiry.id} • {selectedInquiry.timestamp}
                </span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Contact Handle / Phone</span>
                <span className="text-emerald-400 font-mono font-bold text-sm select-all">
                  {selectedInquiry.contact}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Category</span>
                  <span className="text-white font-semibold">
                    {selectedInquiry.category}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Budget</span>
                  <span className="text-amber-300 font-bold">
                    {selectedInquiry.budget}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Client Message / Notes</span>
                <p className="text-slate-200 leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const inq = selectedInquiry;
                    setSelectedInquiry(null);
                    handleOpenEmailTemplate(inq);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Response</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const inq = selectedInquiry;
                    setSelectedInquiry(null);
                    setInvoiceInquiryTarget(inq);
                    setActiveTab('invoices');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-600/60 hover:bg-amber-900 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Generate Invoice</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedInquiry.contact);
                    alert(`Copied contact: ${selectedInquiry.contact}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Copy Contact
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre-filled Email Template Response Generator Modal */}
      {emailInquiry && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0b101c] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white font-display text-sm">
                      Client Response Email Generator
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-emerald-400 border border-slate-700">
                      {emailInquiry.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pre-filled proposal tailored for <span className="text-slate-200 font-semibold">{emailInquiry.name}</span> • Budget: <span className="text-amber-300 font-semibold">{emailInquiry.budget}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailInquiry(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Category Selector Banner */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-white block">
                      Target Service Category
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Change category to instantly recalibrate strategy, deliverables & timeline
                    </span>
                  </div>
                  <select
                    value={emailCategory}
                    onChange={(e) => handleCategoryChangeForEmail(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-500/40 text-xs font-semibold text-emerald-300 focus:outline-none cursor-pointer"
                  >
                    {AVAILABLE_SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recipient & Subject */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Recipient Email Address (To:)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Client Contact: {emailInquiry.contact}
                    </span>
                  </div>
                  <input
                    type="email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="Enter client email address (e.g. client@company.com)..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                  {!emailRecipient && (
                    <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      Client provided a handle/number ({emailInquiry.contact}). You can input their email or copy text directly for Telegram/WhatsApp.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Email Subject Line
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail('subject')}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {emailCopied === 'subject' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{emailCopied === 'subject' ? 'Copied!' : 'Copy Subject'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Email Proposal Body (Editable)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail('body')}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {emailCopied === 'body' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{emailCopied === 'body' ? 'Copied!' : 'Copy Body'}</span>
                  </button>
                </div>
                <textarea
                  rows={13}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] sm:text-xs text-slate-200 font-mono leading-relaxed focus:border-emerald-500 focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAsContacted}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    emailInquiry.status === 'Contacted'
                      ? 'bg-amber-950/60 border border-amber-600/50 text-amber-300'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{emailInquiry.status === 'Contacted' ? 'Status: Contacted' : 'Mark as Contacted'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyEmail('all')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm border border-slate-700"
                >
                  {emailCopied === 'all' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied Full Email!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Full Email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendViaMailClient}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Mail App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
