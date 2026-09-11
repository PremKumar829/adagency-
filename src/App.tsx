import React, { useState, useEffect } from 'react';
import { Language, Currency, ServiceItem, CaseStudy, ClientInquiry, GoalMessageConfig, LedgerOrder } from './types';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveLedgerTicker } from './components/LiveLedgerTicker';
import { ServicesGrid } from './components/ServicesGrid';
import { CampaignEstimator } from './components/CampaignEstimator';
import { CaseStudies } from './components/CaseStudies';
import { HowItWorks } from './components/HowItWorks';
import { ResellerBanner } from './components/ResellerBanner';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingSupportWidget } from './components/FloatingSupportWidget';
import { LaunchCampaignModal } from './components/LaunchCampaignModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { INITIAL_CLIENT_INQUIRIES } from './data/inquiriesData';
import { INITIAL_LEDGER_ORDERS } from './data/ledgerData';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [selectedEstimatorCategory, setSelectedEstimatorCategory] = useState<string>('telegram');
  const [contactInitialCategory, setContactInitialCategory] = useState<string>(
    'Telegram Channel & Group Growth'
  );

  // Client Goal dynamic state
  const [clientGoalConfig, setClientGoalConfig] = useState<GoalMessageConfig | null>(null);

  // Announcement Bar State
  const [customAnnouncement, setCustomAnnouncement] = useState<string>(
    '🔥 Special Offer: Get Extra Reach on All Telegram & Gambling Campaigns Today! Instant Setup Available.'
  );
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState<boolean>(true);

  // Live Ledger Orders State (synced with admin)
  const [ledgerOrders, setLedgerOrders] = useState<LedgerOrder[]>(INITIAL_LEDGER_ORDERS);

  // Inquiries State (synced with localStorage & admin)
  const [inquiries, setInquiries] = useState<ClientInquiry[]>(() => {
    try {
      const stored = localStorage.getItem('prime_ads_inquiries');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_CLIENT_INQUIRIES;
  });

  // Admin Modal State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Modal State
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState<boolean>(false);
  const [modalPrefill, setModalPrefill] = useState<{
    category?: string;
    volume?: number;
    estimatedCostUsd?: number;
    deliveryTime?: string;
  } | null>(null);

  // Listen for #admin URL hash or keyboard shortcut
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminModalOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handlers for Inquiries
  const handleInquirySubmitted = (newInquiry: ClientInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const handleUpdateInquiryStatus = (id: string, newStatus: ClientInquiry['status']) => {
    setInquiries((prev) => {
      const updated = prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
      try {
        localStorage.setItem('prime_ads_inquiries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries((prev) => {
      const updated = prev.filter((inq) => inq.id !== id);
      try {
        localStorage.setItem('prime_ads_inquiries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Handlers for Announcement Bar
  const handleSaveAnnouncement = (text: string, visible: boolean) => {
    setCustomAnnouncement(text);
    setIsAnnouncementVisible(visible);
  };

  // Handlers for Ledger Orders
  const handleAddLedgerOrder = (newOrder: LedgerOrder) => {
    setLedgerOrders((prev) => [newOrder, ...prev]);
  };

  const handleDeleteLedgerOrder = (id: string) => {
    setLedgerOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // Quick Action Handlers
  const handleOpenLaunchModal = () => {
    setModalPrefill(null);
    setIsLaunchModalOpen(true);
  };

  const handleBookService = (service: ServiceItem) => {
    setModalPrefill({
      category: service.title,
      estimatedCostUsd: service.startingPriceUsd,
    });
    setIsLaunchModalOpen(true);
  };

  const handleConfigureInEstimator = (serviceId: string) => {
    setSelectedEstimatorCategory(serviceId);
    const elem = document.getElementById('estimator');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookEstimatedCampaign = (config: {
    category: string;
    volume: number;
    estimatedCostUsd: number;
    deliveryTime: string;
    bonusReach: number;
  }) => {
    setModalPrefill({
      category: config.category,
      volume: config.volume,
      estimatedCostUsd: config.estimatedCostUsd,
      deliveryTime: config.deliveryTime,
    });
    setIsLaunchModalOpen(true);
  };

  const handleSelectCaseStudy = (study: CaseStudy) => {
    setContactInitialCategory(study.category);
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyReseller = () => {
    setContactInitialCategory('Agency Wholesale / Reseller');
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInstantSupport = () => {
    window.open('https://t.me/PREMGUPTA2M', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-[#E2E8F0] flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 1. Top Announcement Bar & Language Support */}
      <AnnouncementBar
        language={language}
        onLanguageChange={setLanguage}
        customAnnouncement={customAnnouncement}
        isVisible={isAnnouncementVisible}
      />

      {/* 2. Navigation Bar */}
      <Navbar
        language={language}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenLaunchModal={handleOpenLaunchModal}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          language={language}
          onBookCampaign={handleOpenLaunchModal}
          onInstantSupport={handleInstantSupport}
        />

        {/* 3. Live Social Proof, Trust & Live Order Ticker */}
        <LiveLedgerTicker
          language={language}
          currency={currency}
          onSelectOrderCategory={handleConfigureInEstimator}
          orders={ledgerOrders}
        />

        {/* 4. Category-Wise Promotion Services Grid */}
        <ServicesGrid
          language={language}
          currency={currency}
          onBookService={handleBookService}
          onConfigureInEstimator={handleConfigureInEstimator}
        />

        {/* 5. Campaign Price Estimator & Currency Switcher */}
        <CampaignEstimator
          language={language}
          currency={currency}
          onCurrencyChange={setCurrency}
          selectedCategory={selectedEstimatorCategory}
          onSelectCategory={setSelectedEstimatorCategory}
          onBookEstimatedCampaign={handleBookEstimatedCampaign}
        />

        {/* 5. Case Studies / Results Showcase */}
        <CaseStudies
          language={language}
          onSelectCaseStudy={handleSelectCaseStudy}
        />

        {/* 5. Step-by-Step Guide ("How It Works") */}
        <HowItWorks
          language={language}
          onStartCampaign={handleOpenLaunchModal}
        />

        {/* 5. Reseller Program Section */}
        <ResellerBanner
          language={language}
          onApplyReseller={handleApplyReseller}
        />

        {/* 6. Comprehensive Contact & Dynamic Goal-Based Message Generator */}
        <ContactSection
          language={language}
          currency={currency}
          initialCategory={contactInitialCategory}
          onInquirySubmitted={handleInquirySubmitted}
          onGoalConfigChange={setClientGoalConfig}
        />

        {/* 8. FAQ Section */}
        <FaqSection language={language} />
      </main>

      {/* 8. Secure Footer with Admin Trigger */}
      <Footer
        language={language}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 6. Floating Live Chat / Direct Redirect Widget */}
      <FloatingSupportWidget
        language={language}
        clientGoalConfig={clientGoalConfig}
      />

      {/* Quick Launch Campaign Modal */}
      <LaunchCampaignModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        language={language}
        currency={currency}
        prefillData={modalPrefill}
      />

      {/* 7. Hidden Admin Panel Feature */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', window.location.pathname);
          }
        }}
        inquiries={inquiries}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
        announcementText={customAnnouncement}
        isAnnouncementVisible={isAnnouncementVisible}
        onSaveAnnouncement={handleSaveAnnouncement}
        ledgerOrders={ledgerOrders}
        onAddLedgerOrder={handleAddLedgerOrder}
        onDeleteLedgerOrder={handleDeleteLedgerOrder}
      />
    </div>
  );
}
