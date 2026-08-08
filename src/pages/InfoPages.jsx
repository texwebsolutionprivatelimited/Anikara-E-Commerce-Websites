import React, { useState, useEffect } from "react";
import { 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  ChevronRight, 
  Search, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  MapPin, 
  Package, 
  Lock, 
  Mail, 
  Phone,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function InfoPages({ navigate, currentParams = {} }) {
  const initialTab = currentParams.tab || currentParams.page || "shipping";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    if (currentParams.tab || currentParams.page) {
      setActiveTab(currentParams.tab || currentParams.page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentParams]);

  const tabs = [
    { id: "shipping", label: "Shipping & Delivery", icon: Truck },
    { id: "returns", label: "15-Day Easy Returns", icon: RotateCcw },
    { id: "privacy", label: "Privacy Policy", icon: ShieldCheck },
    { id: "terms", label: "Terms & Conditions", icon: FileText },
    { id: "faqs", label: "FAQs & Help Center", icon: HelpCircle },
  ];

  const faqsList = [
    {
      category: "Orders & Tracking",
      question: "How can I track the live status of my shipment?",
      answer: "Once your order is dispatched, we send a live tracking link via SMS, WhatsApp, and Email. You can also view real-time courier updates anytime in your Account Order History."
    },
    {
      category: "Orders & Tracking",
      question: "Can I modify or cancel my order after placing it?",
      answer: "Orders can be modified or cancelled within 2 hours of placing them. Please reach out to our VIP support at support@anikara.com or call us directly with your Order ID."
    },
    {
      category: "Shipping & Delivery",
      question: "What are the shipping charges and delivery timelines?",
      answer: "We offer FREE Express Delivery across India on all orders above ₹1,500. Orders under ₹1,500 incur a flat ₹99 shipping fee. Standard delivery takes 3-5 business days, while metro cities receive orders in 1-2 business days."
    },
    {
      category: "Shipping & Delivery",
      question: "Do you offer International Shipping?",
      answer: "Currently we ship across 28,000+ pincodes in India. International express shipping to global destinations will be launched soon!"
    },
    {
      category: "Returns & Exchanges",
      question: "What is the 15-Day Doorstep Return & Exchange policy?",
      answer: "We offer a hassle-free 15-day return and exchange policy from the date of delivery. Our courier partner will pick up the item directly from your doorstep free of cost."
    },
    {
      category: "Returns & Exchanges",
      question: "How and when will I receive my refund?",
      answer: "Once our quality team receives and verifies the returned item, refunds are processed within 24 hours back to your original payment method (Bank account/UPI/Card) or issued as instant store credit."
    },
    {
      category: "Payment & Security",
      question: "Is Cash on Delivery (COD) available?",
      answer: "Yes! Cash on Delivery is available across all serviceable pincodes in India. You can pay via cash or scan & pay via UPI on delivery."
    },
    {
      category: "Payment & Security",
      question: "Are my online payments secure on Anikara?",
      answer: "100% Yes. All transactions are encrypted via 256-bit SSL and processed directly through RBI-certified payment gateways (Razorpay/UPI). We never store your card PINs or CVVs."
    },
    {
      category: "Sizing & Fit",
      question: "How do I ensure I select the perfect size?",
      answer: "Every product page includes a precise Size Guide with chest, waist, and hip measurements in inches. If you fall between sizes, we recommend sizing up for a relaxed luxury fit."
    }
  ];

  const filteredFaqs = faqsList.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pb-16">
      
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden bg-[#0a0a0a] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4">
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#FF4D6D]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1720px] mx-auto text-center relative z-10 space-y-3">
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-[#FF4D6D] uppercase font-display flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-[#FF4D6D]" /> Customer Care & Policies
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-display">
            {tabs.find((t) => t.id === activeTab)?.label || "Help Center"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto">
            Everything you need to know about our luxury services, shipping guidelines, returns, and store policies.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Top / Mobile Category Tabs Row */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-md border border-neutral-200/80 mb-8 flex overflow-x-auto scrollbar-hide gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 180, behavior: "smooth" });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer focus:outline-none ${
                  isActive
                    ? "bg-[#111111] text-white shadow-md scale-[1.02]"
                    : "text-neutral-600 hover:text-[#FF4D6D] hover:bg-neutral-50"
                }`}
              >
                <Icon size={15} className={isActive ? "text-[#FF4D6D]" : ""} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Area */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-200/60 min-h-[500px]">
          
          {/* TAB 1: SHIPPING & DELIVERY */}
          {activeTab === "shipping" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-neutral-100 pb-5">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                  Shipping & Delivery Information
                </h2>
                <p className="text-xs text-neutral-500 mt-1 font-light">
                  Fast, reliable, and insured luxury doorstep delivery across India.
                </p>
              </div>

              {/* Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/50 to-white border border-[#FF4D6D]/20 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4D6D] text-white flex items-center justify-center shadow-md">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-sm font-extrabold text-neutral-900 font-display">FREE Express Shipping</h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Complimentary doorstep shipping on all prepaid & COD orders above ₹1,500. Flat ₹99 on orders below.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/50 to-white border border-purple-200/50 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-sm font-extrabold text-neutral-900 font-display">Fast Dispatch & Delivery</h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Orders placed before 12:00 PM are dispatched same-day. Metro delivery in 1-2 days, pan-India in 3-5 days.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-200/50 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Package size={20} />
                  </div>
                  <h3 className="text-sm font-extrabold text-neutral-900 font-display">Luxury Gift Packaging</h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Every garment is hand-folded in acid-free satin tissue paper inside eco-friendly hardbound luxury boxes.
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4 pt-4 text-xs text-neutral-700 font-light leading-relaxed">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider font-display">
                  Courier Partners & Live Tracking
                </h3>
                <p>
                  We partner with top-tier courier networks including BlueDart, Delhivery, ExpressBees, and DTDC to ensure prompt and secure delivery. As soon as your order leaves our fulfillment center, you will receive an SMS and WhatsApp message containing your live tracking ID.
                </p>

                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider font-display pt-2">
                  Cash on Delivery (COD) Guidelines
                </h3>
                <p>
                  COD is available for orders up to ₹10,000 across 28,000+ pincodes. Please ensure your contact details and shipping address are correct at checkout to avoid delivery delays.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 15-DAY EASY RETURNS */}
          {activeTab === "returns" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-neutral-100 pb-5">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                  15-Day Easy Returns & Exchanges
                </h2>
                <p className="text-xs text-neutral-500 mt-1 font-light">
                  Complete peace of mind with doorstep return pickup and instant refunds.
                </p>
              </div>

              {/* Step-by-Step Return Process */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs mx-auto">1</div>
                  <h4 className="text-xs font-bold text-neutral-900 font-display">Request Return</h4>
                  <p className="text-[11px] text-neutral-500 font-light">Submit return or size exchange request via Profile or Email within 15 days.</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs mx-auto">2</div>
                  <h4 className="text-xs font-bold text-neutral-900 font-display">Doorstep Pickup</h4>
                  <p className="text-[11px] text-neutral-500 font-light">Our courier agent picks up the parcel directly from your address within 24-48 hours.</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs mx-auto">3</div>
                  <h4 className="text-xs font-bold text-neutral-900 font-display">Quality Check</h4>
                  <p className="text-[11px] text-neutral-500 font-light">Garment quality inspection conducted within 24 hours of arrival at facility.</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center font-bold text-xs mx-auto">4</div>
                  <h4 className="text-xs font-bold text-neutral-900 font-display">Instant Refund</h4>
                  <p className="text-[11px] text-neutral-500 font-light">Refund credited directly to original payment account or instant store credit.</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 text-xs text-neutral-700 font-light leading-relaxed">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider font-display">
                  Return Conditions
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li>Items must be unworn, unwashed, unaltered, and free of odors/stains.</li>
                  <li>Original brand tags, security ribbons, and luxury packaging box must be intact.</li>
                  <li>Innerwear, bodysuits, and customized products are non-returnable due to hygiene standards.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-6 animate-fade-in text-xs text-neutral-700 font-light leading-relaxed">
              <div className="border-b border-neutral-100 pb-5">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                  Privacy Policy & Data Security
                </h2>
                <p className="text-xs text-neutral-500 mt-1 font-light">
                  Last updated: August 2026. Your privacy and trust are our highest priority.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">1. Information We Collect</h3>
                <p>When you create an account, browse Anikara, or make a purchase, we collect necessary personal details including your name, email address, phone number, shipping address, and payment confirmation tokens processed through encrypted gateways.</p>

                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">2. How We Use Your Data</h3>
                <p>We use your personal data strictly to fulfill your orders, provide real-time shipping updates, send customer support responses, and improve your shopping experience with personalized recommendations.</p>

                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">3. 256-Bit SSL Payment Protection</h3>
                <p>Anikara employs bank-grade 256-bit SSL encryption. All card details, UPI IDs, and net banking credentials are handled directly by PCI-DSS compliant financial partners (Razorpay/UPI). Anikara NEVER stores your private financial credentials.</p>

                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">4. No Data Sharing Guarantee</h3>
                <p>We promise to NEVER sell, rent, or trade your personal information to third-party marketing companies.</p>
              </div>
            </div>
          )}

          {/* TAB 4: TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <div className="space-y-6 animate-fade-in text-xs text-neutral-700 font-light leading-relaxed">
              <div className="border-b border-neutral-100 pb-5">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                  Terms & Conditions
                </h2>
                <p className="text-xs text-neutral-500 mt-1 font-light">
                  Please review the terms governing your use of Anikara E-Commerce services.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">1. Store Terms</h3>
                <p>By placing an order on Anikara, you represent that you are at least 18 years of age or accessing the site under parental supervision, and that all information provided is accurate and current.</p>

                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">2. Product Pricing & Accuracy</h3>
                <p>Prices displayed on the website include GST and applicable taxes. While we strive to maintain absolute price accuracy, in the rare event of a system error, we reserve the right to correct pricing prior to order dispatch.</p>

                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">3. Intellectual Property</h3>
                <p>All brand graphics, high-definition lookbook photography, website designs, logo trademarks, and editorial copy are protected intellectual property owned exclusively by Anikara.</p>

                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">4. Governing Law</h3>
                <p>These terms are governed by and construed in accordance with the laws of India. Any legal proceedings shall be subject to the jurisdiction of the courts of New Delhi.</p>
              </div>
            </div>
          )}

          {/* TAB 5: FAQS & HELP CENTER */}
          {activeTab === "faqs" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 font-light">
                    Search or browse answers to popular questions.
                  </p>
                </div>
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search FAQs..."
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-[#FF4D6D] focus:bg-white transition-all font-light"
                  />
                  <Search size={15} className="absolute left-3 top-3 text-neutral-400" />
                </div>
              </div>

              {/* Accordion FAQ Items */}
              <div className="space-y-3">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => {
                    const isOpen = expandedFaq === index;
                    return (
                      <div
                        key={index}
                        className="border border-neutral-200/80 rounded-2xl overflow-hidden transition-all duration-300 bg-white hover:border-[#FF4D6D]/30"
                      >
                        <button
                          onClick={() => setExpandedFaq(isOpen ? null : index)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#FF4D6D]/10 text-[#FF4D6D] text-[10px] font-extrabold uppercase tracking-wider">
                              {faq.category}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-neutral-900 font-display">
                              {faq.question}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={16} className="text-[#FF4D6D] shrink-0" />
                          ) : (
                            <ChevronDown size={16} className="text-neutral-400 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 font-light border-t border-neutral-100 leading-relaxed bg-neutral-50/50">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-neutral-400 text-xs font-light">
                    No matching questions found for "{faqSearch}". Please reach out to our support team directly.
                  </div>
                )}
              </div>

              {/* Contact Support Banner */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#111111] via-[#222222] to-[#111111] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold font-display text-white">Still have questions?</h4>
                  <p className="text-xs text-neutral-300 font-light mt-0.5">Our VIP support team is available 24/7 to assist you.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="mailto:support@anikara.com"
                    className="px-4 py-2.5 bg-[#FF4D6D] hover:bg-[#FF1E46] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Mail size={14} /> Email Support
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
