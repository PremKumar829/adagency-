import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Printer, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Calendar, 
  User, 
  Hash, 
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { CustomInvoice, InvoiceItem, AgencySettings, ClientInquiry } from '../types';
import { AVAILABLE_SERVICE_CATEGORIES, detectServiceCategory } from '../utils/emailTemplateGenerator';

interface InvoiceGeneratorProps {
  agencySettings: AgencySettings;
  inquiries?: ClientInquiry[];
  initialInquiry?: ClientInquiry | null;
  onClearInitialInquiry?: () => void;
}

const STORAGE_KEY = 'prime_ads_saved_invoices';

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  agencySettings,
  inquiries = [],
  initialInquiry,
  onClearInitialInquiry,
}) => {
  // Mode: 'editor' | 'saved_list'
  const [viewMode, setViewMode] = useState<'editor' | 'saved_list'>('editor');
  const [savedInvoices, setSavedInvoices] = useState<CustomInvoice[]>([]);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate Default Invoice
  const createDefaultInvoice = (inq?: ClientInquiry | null): CustomInvoice => {
    const today = new Date().toISOString().split('T')[0];
    const invNum = `INV-PA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const category = inq ? detectServiceCategory(inq.category) : 'Telegram Channel & Group Growth';
    const stampCode = `AUTH-PG-${Math.floor(100000 + Math.random() * 900000)}`;

    let initialAmount = 149;
    if (inq?.budget) {
      const parsedNum = parseInt(inq.budget.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        initialAmount = parsedNum;
      }
    }

    return {
      id: invNum,
      invoiceNumber: invNum,
      date: today,
      dueDate: today,
      category,
      clientName: inq?.name || 'Vikram Singh',
      clientCompany: inq?.name ? `${inq.name} Network` : 'VIP Trading Group',
      clientContact: inq?.contact || '+91 9821034491',
      clientAddress: 'New Delhi, India',
      agencyName: agencySettings.brandName || 'Prime Ads Agency',
      agencyAddress: agencySettings.address || 'Katihar, Bihar - 854101',
      agencyPhone: agencySettings.primaryWhatsapp || '+91 7004166377',
      agencyEmail: agencySettings.email || 'pk4030794@gmail.com',
      agencyWebsite: typeof window !== 'undefined' ? window.location.origin : 'https://primeads.agency',
      ceoName: 'Prem Gupta',
      ceoDesignation: 'Founder & CEO',
      includeDigitalSignature: true,
      signatureDate: today,
      digitalStampCode: stampCode,
      currency: 'INR',
      items: [
        {
          id: 'item-1',
          description: inq ? `${category} - Promotional Campaign Execution` : 'Telegram Channel Growth - 10,000 Verified Targeted Members',
          quantity: 1,
          rate: initialAmount > 500 ? initialAmount : 12500,
          amount: initialAmount > 500 ? initialAmount : 12500,
        },
      ],
      subtotal: initialAmount > 500 ? initialAmount : 12500,
      taxPercent: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: initialAmount > 500 ? initialAmount : 12500,
      paymentMode: 'UPI',
      transactionId: `UPI/2026/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      paymentStatus: 'Paid',
      paymentDate: today,
      notes: '1. All promotional metrics are backed by our 30-day retention and replacement guarantee.\n2. For any operational queries, contact our direct 24/7 campaign desk.',
    };
  };

  const [invoice, setInvoice] = useState<CustomInvoice>(() => createDefaultInvoice(initialInquiry));

  // Load saved invoices from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedInvoices(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load saved invoices', err);
    }
  }, []);

  // Update when initialInquiry changes
  useEffect(() => {
    if (initialInquiry) {
      setInvoice(createDefaultInvoice(initialInquiry));
      setViewMode('editor');
    }
  }, [initialInquiry]);

  // Recalculate financial totals
  const updateFinancials = (
    items: InvoiceItem[],
    taxPercent: number,
    discount: number
  ) => {
    const subtotal = items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const taxAmount = Math.round((subtotal * (Number(taxPercent) || 0)) / 100);
    const totalAmount = Math.max(0, subtotal + taxAmount - (Number(discount) || 0));

    setInvoice((prev) => ({
      ...prev,
      items,
      subtotal,
      taxPercent,
      taxAmount,
      discountAmount: discount,
      totalAmount,
    }));
  };

  // Line item handlers
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...invoice.items];
    const current = { ...updated[index] };

    if (field === 'quantity') {
      current.quantity = Number(value) || 0;
      current.amount = current.quantity * current.rate;
    } else if (field === 'rate') {
      current.rate = Number(value) || 0;
      current.amount = current.quantity * current.rate;
    } else if (field === 'description') {
      current.description = String(value);
    }

    updated[index] = current;
    updateFinancials(updated, invoice.taxPercent, invoice.discountAmount);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: 'Additional Media / View Reaction Boost Package',
      quantity: 1,
      rate: invoice.currency === 'INR' ? 2500 : 49,
      amount: invoice.currency === 'INR' ? 2500 : 49,
    };
    const updated = [...invoice.items, newItem];
    updateFinancials(updated, invoice.taxPercent, invoice.discountAmount);
  };

  const handleDeleteItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    const updated = invoice.items.filter((_, idx) => idx !== index);
    updateFinancials(updated, invoice.taxPercent, invoice.discountAmount);
  };

  // Quick Preset Category loader
  const handleCategorySelect = (category: string) => {
    let presetDesc = `${category} - High-Impact Scaling Campaign`;
    let presetRate = invoice.currency === 'INR' ? 12500 : 149;

    if (category.includes('Telegram')) {
      presetDesc = 'Telegram Channel Growth - 10,000 Real Target Members with Post Views';
      presetRate = invoice.currency === 'INR' ? 12500 : 149;
    } else if (category.includes('Gambling')) {
      presetDesc = 'Gambling & Casino Ad Push - 50,000 High-Intent Popunder & CPA Direct Clicks';
      presetRate = invoice.currency === 'INR' ? 25000 : 299;
    } else if (category.includes('Crypto')) {
      presetDesc = 'Crypto Web3 Trending Push - DexScreener Top 5 Placement & Shilling Blast';
      presetRate = invoice.currency === 'INR' ? 35000 : 420;
    } else if (category.includes('Social')) {
      presetDesc = 'Meta Dark Ads & Viral Reels Seeding - 250,000 Target Video Views';
      presetRate = invoice.currency === 'INR' ? 18000 : 220;
    } else if (category.includes('Reseller')) {
      presetDesc = 'Agency Wholesale Bulk Credit Package - 100K API Units';
      presetRate = invoice.currency === 'INR' ? 50000 : 600;
    }

    const updatedItems = [
      {
        id: 'item-1',
        description: presetDesc,
        quantity: 1,
        rate: presetRate,
        amount: presetRate,
      },
    ];

    setInvoice((prev) => ({
      ...prev,
      category,
    }));
    updateFinancials(updatedItems, invoice.taxPercent, invoice.discountAmount);
  };

  // Pre-fill from existing inquiry dropdown
  const handleLoadInquiry = (inquiryId: string) => {
    const found = inquiries.find((i) => i.id === inquiryId);
    if (found) {
      setInvoice(createDefaultInvoice(found));
    }
  };

  // Save to persistent storage
  const handleSaveInvoice = () => {
    const updatedList = [invoice, ...savedInvoices.filter((inv) => inv.id !== invoice.id)];
    setSavedInvoices(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save invoice', err);
    }
  };

  // Delete saved invoice
  const handleDeleteSaved = (id: string) => {
    const filtered = savedInvoices.filter((i) => i.id !== id);
    setSavedInvoices(filtered);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to delete saved invoice', err);
    }
  };

  // Copy WhatsApp receipt text
  const handleCopyWhatsAppReceipt = () => {
    const symbol = invoice.currency === 'INR' ? '₹' : invoice.currency === 'USD' ? '$' : 'USDT ';
    const text = `🧾 *OFFICIAL PAYMENT RECEIPT & INVOICE*
*${invoice.agencyName}*
---------------------------------------
*Invoice No:* ${invoice.invoiceNumber}
*Date:* ${invoice.date}
*Client:* ${invoice.clientName} (${invoice.clientCompany || 'Direct Client'})
*Service Category:* ${invoice.category}
---------------------------------------
*Items:*
${invoice.items.map((it, idx) => `${idx + 1}. ${it.description} (Qty: ${it.quantity}) - ${symbol}${it.amount.toLocaleString()}`).join('\n')}

*Total Amount:* *${symbol}${invoice.totalAmount.toLocaleString()}*
*Payment Mode:* ${invoice.paymentMode}
*Transaction ID / UTR:* \`${invoice.transactionId}\`
*Payment Status:* *${invoice.paymentStatus.toUpperCase()}* ✅
---------------------------------------
*Authorized Signatory:* ${invoice.ceoName} (${invoice.ceoDesignation})
*Digital Auth Code:* ${invoice.digitalStampCode}
*Agency Support:* ${invoice.agencyPhone}
Website: ${invoice.agencyWebsite}

_Thank you for choosing ${invoice.agencyName}!_`;

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  // Print Invoice
  const handlePrint = () => {
    window.print();
  };

  const currencySymbol = invoice.currency === 'INR' ? '₹' : invoice.currency === 'USD' ? '$' : 'USDT ';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Action & Sub-navigation Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-display flex items-center gap-2">
              <span>Custom Invoice & Billing Generator</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
                CEO Digital Signature Enabled
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Create branded tax invoices, payment receipts with Prem Gupta's digital signature and transaction UTR verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Invoice Editor
            </button>
            <button
              onClick={() => setViewMode('saved_list')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'saved_list'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Saved Invoices</span>
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-emerald-400">
                {savedInvoices.length}
              </span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleCopyWhatsAppReceipt}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Copy formatted receipt text for WhatsApp/Telegram"
          >
            {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedReceipt ? 'Copied Receipt!' : 'Copy for WhatsApp'}</span>
          </button>

          <button
            onClick={handleSaveInvoice}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'Saved to History!' : 'Save Invoice'}</span>
          </button>
        </div>
      </div>

      {/* VIEW: Saved Invoices List */}
      {viewMode === 'saved_list' && (
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Saved Invoices & Issued Receipts ({savedInvoices.length})
            </h4>
            <button
              onClick={() => {
                setInvoice(createDefaultInvoice(null));
                setViewMode('editor');
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Invoice</span>
            </button>
          </div>

          {savedInvoices.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs border border-slate-800 rounded-2xl bg-slate-950/40">
              No saved invoices found yet. Create and save your first invoice from the editor.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono">
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Mode & TxID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {savedInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-emerald-400">{inv.invoiceNumber}</td>
                      <td className="p-3 text-slate-400 whitespace-nowrap">{inv.date}</td>
                      <td className="p-3 font-semibold text-white">
                        {inv.clientName}
                        {inv.clientCompany && (
                          <span className="block text-[10px] text-slate-400 font-normal">{inv.clientCompany}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                          {inv.category}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-amber-300">
                        {inv.currency === 'INR' ? '₹' : inv.currency === 'USD' ? '$' : '₮'}
                        {inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-200 block">{inv.paymentMode}</span>
                        <span className="font-mono text-[10px] text-slate-400">{inv.transactionId}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                            : 'bg-amber-950 border border-amber-800 text-amber-300'
                        }`}>
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setInvoice(inv);
                              setViewMode('editor');
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                            title="Open in Editor"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSaved(inv.id)}
                            className="p-1.5 rounded bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900 text-rose-300 cursor-pointer"
                            title="Delete Saved Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: Invoice Editor & Live Preview Split */}
      {viewMode === 'editor' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT FORM PANEL (Customization controls) */}
          <div className="w-full lg:w-[48%] border-b lg:border-b-0 lg:border-r border-slate-800 p-5 overflow-y-auto space-y-5 bg-slate-950 text-xs">
            {/* Quick Load Inquiry Banner */}
            {inquiries.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  ⚡ Pre-fill Details from Existing Client Inquiry:
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) handleLoadInquiry(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-300 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Select an inquiry to auto-fill customer & budget...</option>
                  {inquiries.map((inq) => (
                    <option key={inq.id} value={inq.id}>
                      {inq.name} ({inq.category}) - Budget: {inq.budget} [{inq.contact}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Customer Details Block */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-emerald-400">
                <User className="w-3.5 h-3.5" /> Customer & Billing Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Customer / Client Name *</label>
                  <input
                    type="text"
                    value={invoice.clientName}
                    onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                    placeholder="e.g. Vikram Singh"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Company / Channel Name</label>
                  <input
                    type="text"
                    value={invoice.clientCompany || ''}
                    onChange={(e) => setInvoice({ ...invoice, clientCompany: e.target.value })}
                    placeholder="e.g. Vikram VIP Trading Channel"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Contact Handle / Phone / Email *</label>
                  <input
                    type="text"
                    value={invoice.clientContact}
                    onChange={(e) => setInvoice({ ...invoice, clientContact: e.target.value })}
                    placeholder="e.g. +91 9821034491 or @handle"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Billing City / Country</label>
                  <input
                    type="text"
                    value={invoice.clientAddress || ''}
                    onChange={(e) => setInvoice({ ...invoice, clientAddress: e.target.value })}
                    placeholder="e.g. Delhi, India"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Category & Invoice Meta */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-cyan-400">
                <Hash className="w-3.5 h-3.5" /> Service Category & Invoice Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Service Category Preset</label>
                  <select
                    value={invoice.category}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {AVAILABLE_SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Currency</label>
                  <select
                    value={invoice.currency}
                    onChange={(e) => {
                      const newCurr = e.target.value as any;
                      setInvoice({ ...invoice, currency: newCurr });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="USDT">USDT (₮)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber}
                    onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoice.date}
                    onChange={(e) => setInvoice({ ...invoice, date: e.target.value, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Builder */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-amber-400">
                  <Receipt className="w-3.5 h-3.5" /> Campaign Deliverables & Line Items
                </h4>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>

              <div className="space-y-2.5">
                {invoice.items.map((item, idx) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">Item #{idx + 1}</span>
                      {invoice.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      placeholder="Service / Package Description"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Rate ({currencySymbol})</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Line Total</label>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-bold text-amber-300">
                          {currencySymbol}{item.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Adjustments (Tax & Discount) */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tax / GST (%)</label>
                  <input
                    type="number"
                    value={invoice.taxPercent}
                    onChange={(e) => updateFinancials(invoice.items, Number(e.target.value) || 0, invoice.discountAmount)}
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Discount Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    value={invoice.discountAmount}
                    onChange={(e) => updateFinancials(invoice.items, invoice.taxPercent, Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment & Transaction Mode */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-emerald-400">
                <CreditCard className="w-3.5 h-3.5" /> Payment Mode & Transaction ID
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Payment Mode *</label>
                  <select
                    value={invoice.paymentMode}
                    onChange={(e) => setInvoice({ ...invoice, paymentMode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                    <option value="Bank Transfer">Bank Transfer (IMPS / NEFT)</option>
                    <option value="Crypto (USDT)">Crypto USDT (TRC20 / BEP20)</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cash">Cash / Direct Settlement</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Transaction ID / UTR / TxID *</label>
                  <input
                    type="text"
                    value={invoice.transactionId}
                    onChange={(e) => setInvoice({ ...invoice, transactionId: e.target.value })}
                    placeholder="e.g. UPI/2026/9821038421 or Hash"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Payment Status</label>
                  <select
                    value={invoice.paymentStatus}
                    onChange={(e) => setInvoice({ ...invoice, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Paid">PAID (Full Settlement)</option>
                    <option value="Partially Paid">Partially Paid (Advance Received)</option>
                    <option value="Pending">Pending (Awaiting Confirmation)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Total Amount Payable</label>
                  <div className="px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-sm font-bold text-emerald-400">
                    {currencySymbol}{invoice.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* CEO Digital Signature Config */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> Owner / CEO Digital Signature
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Authentic cryptographic signature of Prem Gupta with verification stamp
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={invoice.includeDigitalSignature}
                    onChange={(e) => setInvoice({ ...invoice, includeDigitalSignature: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Signatory Name</label>
                  <input
                    type="text"
                    value={invoice.ceoName}
                    onChange={(e) => setInvoice({ ...invoice, ceoName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Designation</label>
                  <input
                    type="text"
                    value={invoice.ceoDesignation}
                    onChange={(e) => setInvoice({ ...invoice, ceoDesignation: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Invoice Notes / Guarantee Terms</label>
              <textarea
                rows={2}
                value={invoice.notes || ''}
                onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* RIGHT PREVIEW PANEL (High-resolution, Print-Ready A4 Document) */}
          <div className="w-full lg:w-[52%] p-4 lg:p-6 overflow-y-auto bg-[#070b13] flex justify-center items-start">
            {/* PRINTABLE INVOICE CARD */}
            <div 
              id="printable-invoice"
              className="w-full max-w-[700px] bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 font-sans border border-slate-200 relative overflow-hidden"
            >
              {/* Top Decorative Header Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-6 pt-2">
                {/* Agency Brand & Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-emerald-500/30">
                    P
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-950 tracking-tight">
                      {invoice.agencyName}
                    </h2>
                    <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
                      Elite Advertising & Growth Network
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {invoice.agencyAddress}
                    </p>
                  </div>
                </div>

                {/* Invoice Meta */}
                <div className="text-left sm:text-right">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-2 bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {invoice.paymentStatus === 'Paid' ? '✓ PAYMENT RECEIVED' : invoice.paymentStatus.toUpperCase()}
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {invoice.invoiceNumber}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Date: <strong className="text-slate-800">{invoice.date}</strong>
                  </p>
                  {invoice.dueDate && (
                    <p className="text-[11px] text-slate-500">
                      Due Date: <span className="text-slate-700 font-semibold">{invoice.dueDate}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Billed To & Payment Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Client Info */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Billed To (Customer):
                  </span>
                  <h3 className="font-bold text-slate-950 text-sm">{invoice.clientName}</h3>
                  {invoice.clientCompany && (
                    <p className="font-semibold text-emerald-800">{invoice.clientCompany}</p>
                  )}
                  <p className="text-slate-600 font-mono">Contact: {invoice.clientContact}</p>
                  {invoice.clientAddress && (
                    <p className="text-slate-500">{invoice.clientAddress}</p>
                  )}
                </div>

                {/* Transaction & Settlement Info */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Settlement & Transaction Details:
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Payment Mode:</span>
                    <strong className="text-slate-900 font-semibold">{invoice.paymentMode}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Transaction ID / UTR:</span>
                    <span className="font-mono font-bold text-emerald-700 select-all">{invoice.transactionId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Service Category:</span>
                    <span className="text-slate-800 font-medium">{invoice.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <th className="p-3 w-10 text-center">#</th>
                      <th className="p-3">Deliverable / Campaign Description</th>
                      <th className="p-3 text-center w-16">Qty</th>
                      <th className="p-3 text-right w-24">Rate ({currencySymbol})</th>
                      <th className="p-3 text-right w-28">Total ({currencySymbol})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {invoice.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/60">
                        <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-medium">
                          {item.description}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-600">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-600">{item.rate.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-950">
                          {item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="text-[11px] text-slate-500 max-w-xs space-y-1">
                  <strong className="text-slate-700 block font-semibold">Terms & Warranty:</strong>
                  <p className="whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">{currencySymbol}{invoice.subtotal.toLocaleString()}</span>
                  </div>
                  {invoice.taxPercent > 0 && (
                    <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                      <span>Tax / GST ({invoice.taxPercent}%):</span>
                      <span className="font-mono font-semibold">+{currencySymbol}{invoice.taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 py-1 border-b border-slate-100">
                      <span>Discount:</span>
                      <span className="font-mono font-semibold">-{currencySymbol}{invoice.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                    <span>Total Paid:</span>
                    <span className="font-mono text-emerald-700">{currencySymbol}{invoice.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* CEO Digital Signature & Stamp Box */}
              {invoice.includeDigitalSignature && (
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Digital Verification Code & Security Note */}
                  <div className="flex items-center gap-3">
                    {/* Official Circular Digital Stamp Seal */}
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-700 flex flex-col items-center justify-center text-center p-1 bg-emerald-50/60 rotate-[-4deg] shrink-0 shadow-sm">
                      <span className="text-[8px] font-black uppercase text-emerald-900 tracking-tighter leading-none">
                        PRIME ADS
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 uppercase leading-tight my-0.5">
                        VERIFIED
                      </span>
                      <span className="text-[7px] font-mono text-emerald-800 leading-none">
                        {invoice.digitalStampCode}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500">
                      <p className="font-mono font-bold text-slate-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        SECURE DIGITAL SIGNATURE
                      </p>
                      <p>Digitally validated on {invoice.signatureDate}</p>
                      <p className="font-mono text-slate-400 text-[9px]">Hash: {invoice.digitalStampCode}</p>
                    </div>
                  </div>

                  {/* Elegant Prem Gupta Signature */}
                  <div className="text-right">
                    <div className="relative inline-block pr-2">
                      {/* Stylized Signature Typography / Calligraphy */}
                      <div className="font-serif italic text-2xl font-bold text-slate-900 tracking-wide select-none transform -rotate-2 scale-y-110">
                        Prem Gupta
                      </div>
                      {/* Signature under-stroke flourish line */}
                      <svg className="w-32 h-3 text-emerald-700 mt-[-4px]" viewBox="0 0 120 12" fill="none">
                        <path d="M2 8 C 30 2, 80 12, 118 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <p className="font-bold text-slate-950 text-xs mt-1">
                      {invoice.ceoName}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      {invoice.ceoDesignation}
                    </p>
                    <p className="text-[9px] text-emerald-800 font-bold">
                      {invoice.agencyName}
                    </p>
                  </div>
                </div>
              )}

              {/* Invoice Footer */}
              <div className="text-center pt-4 border-t border-slate-100 text-[10px] text-slate-400">
                <p>
                  Official Invoice issued by <strong>{invoice.agencyName}</strong> • WhatsApp: {invoice.agencyPhone} • Telegram: @PREMGUPTA2M
                </p>
                <p className="mt-0.5">
                  Computer-generated legal tax invoice with cryptographic CEO signature verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
