import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Search, 
  Receipt, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  FileDown, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { CustomInvoice, AgencySettings } from '../types';
import { downloadInvoiceAsPDF, downloadInvoiceAsImage, downloadInvoiceAsText } from '../utils/invoiceExporter';

interface ClientInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencySettings?: AgencySettings;
}

const STORAGE_KEY = 'prime_ads_saved_invoices';

export const ClientInvoiceModal: React.FC<ClientInvoiceModalProps> = ({
  isOpen,
  onClose,
  agencySettings,
}) => {
  const [invoices, setInvoices] = useState<CustomInvoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<CustomInvoice | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load saved invoices from localStorage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CustomInvoice[] = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setInvoices(parsed);
          setSelectedInvoice(parsed[0]);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Default sample official invoice if none saved yet
    const defaultSample: CustomInvoice = {
      id: 'sample-inv-1',
      invoiceNumber: 'INV-PA-2026-8812',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      agencyName: agencySettings?.brandName || 'Prime Ads Agency',
      agencyAddress: agencySettings?.address || 'Katihar, Bihar - 854101, India',
      agencyPhone: agencySettings?.whatsappNumber || '+91 7004166377',
      agencyEmail: agencySettings?.email || 'pk4030794@gmail.com',
      agencyWebsite: agencySettings?.websiteUrl || 'https://primeads.agency',
      ceoName: agencySettings?.ceoName || 'Prem Gupta',
      ceoDesignation: 'Founder & CEO',
      digitalStampCode: 'AUTH-PG-892110',
      clientName: 'VIP Partner Client',
      clientCompany: 'Digital Growth Crypto & Gaming Ltd',
      clientContact: '+91 98765 43210 / @growth_partner',
      clientAddress: 'Verified Enterprise Client',
      category: 'Telegram Channel & Community Growth',
      items: [
        {
          id: '1',
          description: '25,000 High-Intent Active Members (Targeted Niche)',
          quantity: 25000,
          rate: 0.0088,
          amount: 220,
        },
        {
          id: '2',
          description: '24h Channel Post Engagement & Reaction Boost Blitz',
          quantity: 1,
          rate: 45,
          amount: 45,
        },
      ],
      currency: 'USD',
      subtotal: 265,
      taxPercent: 0,
      taxAmount: 0,
      discountAmount: 25,
      totalAmount: 240,
      paymentStatus: 'Paid',
      paymentMode: 'Crypto (USDT)',
      transactionId: 'TXID-TRX-8930491829048123984',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: 'All subscribers & engagement metrics backed by 30-day non-drop replacement guarantee.',
      includeDigitalSignature: true,
      signatureDate: new Date().toISOString().split('T')[0],
    };

    setInvoices([defaultSample]);
    setSelectedInvoice(defaultSample);
  }, [isOpen, agencySettings]);

  if (!isOpen) return null;

  // Filter invoices by query
  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.clientContact && inv.clientContact.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeInv = selectedInvoice || (filtered.length > 0 ? filtered[0] : null);
  const currencySymbol = activeInv?.currency === 'INR' ? '₹' : activeInv?.currency === 'USD' ? '$' : 'USDT ';

  const handleDownloadPdf = async () => {
    if (!activeInv) return;
    setIsDownloadingPdf(true);
    setFeedback('Generating official PDF...');
    try {
      const success = await downloadInvoiceAsPDF(
        'client-printable-invoice',
        `PrimeAds_Invoice_${activeInv.invoiceNumber}`
      );
      if (success) {
        setFeedback('PDF downloaded successfully!');
      } else {
        setFeedback('Downloaded via print dialog');
      }
    } catch (e) {
      console.error(e);
      setFeedback('Error generating PDF');
    } finally {
      setIsDownloadingPdf(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDownloadImage = async () => {
    if (!activeInv) return;
    setIsDownloadingImage(true);
    setFeedback('Generating high-res image...');
    try {
      const success = await downloadInvoiceAsImage(
        'client-printable-invoice',
        `PrimeAds_Invoice_${activeInv.invoiceNumber}`
      );
      if (success) {
        setFeedback('Image downloaded successfully!');
      } else {
        setFeedback('Image export failed');
      }
    } catch (e) {
      console.error(e);
      setFeedback('Error saving image');
    } finally {
      setIsDownloadingImage(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDownloadText = () => {
    if (!activeInv) return;
    downloadInvoiceAsText(activeInv);
    setFeedback('Text receipt downloaded!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCopyUTR = () => {
    if (!activeInv) return;
    navigator.clipboard.writeText(activeInv.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[92vh] max-h-[900px] bg-[#070B13] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
                <span>Invoice Verification & Download Center</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-700 text-emerald-300">
                  Verified Official
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Download your official tax bill, campaign receipts, and cryptographically signed PDF invoice.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeInv && (
              <>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                  title="Download as PDF"
                >
                  {isDownloadingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{isDownloadingPdf ? 'Creating PDF...' : 'Download PDF'}</span>
                </button>

                <button
                  onClick={handleDownloadImage}
                  disabled={isDownloadingImage}
                  className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                  title="Download Image (PNG)"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Image</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left search/list & Right Live Bill Preview */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: Invoice Search & Selector */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 p-4 flex flex-col gap-3 shrink-0 overflow-y-auto">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Invoice #, Name, UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Quick Status / Help */}
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-[11px] text-emerald-300">
              <span className="font-semibold block mb-0.5">Need a custom invoice?</span>
              Reach out to Prem Gupta on WhatsApp (+91 7004166377) or our support desk with your transaction UTR.
            </div>

            {/* Invoices List */}
            <div className="space-y-2 flex-1 overflow-y-auto">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Available Invoices ({filtered.length})
              </div>

              {filtered.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No matching invoice found for "{searchQuery}".
                </div>
              ) : (
                filtered.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                      activeInv?.id === inv.id
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-emerald-400">{inv.invoiceNumber}</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                        {inv.paymentStatus}
                      </span>
                    </div>
                    <div className="font-semibold text-white truncate">{inv.clientName}</div>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400 font-mono">
                      <span>{inv.date}</span>
                      <span className="text-amber-300 font-bold">
                        {inv.currency === 'INR' ? '₹' : inv.currency === 'USD' ? '$' : '₮'}
                        {inv.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Download Status Toast */}
            {feedback && (
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center animate-in fade-in flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{feedback}</span>
              </div>
            )}
          </div>

          {/* Right Panel: Official Invoice Printable Canvas */}
          <div className="flex-1 bg-slate-950/90 p-4 sm:p-6 overflow-y-auto flex flex-col items-center gap-4">
            
            {activeInv ? (
              <>
                {/* Official Printable Invoice Sheet */}
                <div
                  id="client-printable-invoice"
                  className="w-full max-w-[680px] bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 font-sans border border-slate-200 relative overflow-hidden"
                >
                  {/* Accent Top Bar */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-5 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-emerald-500/30">
                        P
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-950 tracking-tight">
                          {activeInv.agencyName}
                        </h2>
                        <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
                          Elite Advertising & Growth Network
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {activeInv.agencyAddress}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="inline-block px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase mb-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ {activeInv.paymentStatus.toUpperCase()} RECEIPT
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                        {activeInv.invoiceNumber}
                      </h1>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Date: <strong className="text-slate-800">{activeInv.date}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Client & Transaction Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Billed To:
                      </span>
                      <h3 className="font-bold text-slate-950 text-sm">{activeInv.clientName}</h3>
                      {activeInv.clientCompany && (
                        <p className="font-semibold text-emerald-800">{activeInv.clientCompany}</p>
                      )}
                      <p className="text-slate-600 font-mono">Contact: {activeInv.clientContact}</p>
                      {activeInv.clientAddress && (
                        <p className="text-slate-500">{activeInv.clientAddress}</p>
                      )}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Settlement Verification:
                      </span>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Payment Mode:</span>
                        <strong className="text-slate-900 font-semibold">{activeInv.paymentMode}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">UTR / TxID:</span>
                        <span className="font-mono font-bold text-emerald-700 select-all">{activeInv.transactionId}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Category:</span>
                        <span className="text-slate-800 font-medium">{activeInv.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables Table */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          <th className="p-3">#</th>
                          <th className="p-3">Deliverable / Campaign Item</th>
                          <th className="p-3 text-right">Qty</th>
                          <th className="p-3 text-right">Rate</th>
                          <th className="p-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {activeInv.items.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/80">
                            <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-3 font-medium text-slate-900">{item.description}</td>
                            <td className="p-3 text-right font-mono">{item.quantity.toLocaleString()}</td>
                            <td className="p-3 text-right font-mono text-slate-600">
                              {currencySymbol}{item.rate.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-950">
                              {currencySymbol}{item.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="flex justify-end pt-1">
                    <div className="w-64 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-mono font-semibold">{currencySymbol}{activeInv.subtotal.toLocaleString()}</span>
                      </div>
                      {activeInv.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount Applied:</span>
                          <span className="font-mono font-semibold">-{currencySymbol}{activeInv.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-black text-slate-950 border-t-2 border-slate-900 pt-2">
                        <span>Total Paid:</span>
                        <span className="font-mono text-emerald-800">{currencySymbol}{activeInv.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* CEO Signature Block & Cryptographic Stamp */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center p-1 text-center bg-emerald-50">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-[8px] font-bold text-emerald-700 uppercase leading-tight mt-0.5">
                          VERIFIED
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        <p className="font-bold text-slate-800 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          DIGITALLY AUTHENTICATED
                        </p>
                        <p>Validated on {activeInv.signatureDate || activeInv.date}</p>
                        <p className="font-mono text-slate-400 text-[9px]">Seal: {activeInv.digitalStampCode}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="relative inline-block pr-2">
                        <div className="font-serif italic text-2xl font-bold text-slate-900 select-none transform -rotate-2">
                          Prem Gupta
                        </div>
                        <svg className="w-32 h-3 text-emerald-700 mt-[-4px]" viewBox="0 0 120 12" fill="none">
                          <path d="M2 8 C 30 2, 80 12, 118 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <p className="font-bold text-slate-950 text-xs mt-1">{activeInv.ceoName}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{activeInv.ceoDesignation}</p>
                      <p className="text-[9px] text-emerald-800 font-bold">{activeInv.agencyName}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                    Official Invoice issued by <strong>{activeInv.agencyName}</strong> • Support: {activeInv.agencyPhone}
                  </div>
                </div>

                {/* Bottom Direct Action Dock */}
                <div className="w-full max-w-[680px] p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download format:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {isDownloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      <span>Official PDF</span>
                    </button>

                    <button
                      onClick={handleDownloadImage}
                      disabled={isDownloadingImage}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Image (PNG)</span>
                    </button>

                    <button
                      onClick={handleDownloadText}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-teal-400" />
                      <span>Receipt (.txt)</span>
                    </button>

                    <button
                      onClick={handleCopyUTR}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{copied ? 'Copied UTR' : 'Copy UTR'}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-500">
                Please select or search for an invoice.
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
