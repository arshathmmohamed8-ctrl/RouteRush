import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';

const FAQ_DATA = [
  { question: "How do I book a ticket on RouteRush?", answer: "Enter your source and destination cities along with your travel date on our homepage or search page. Browse available buses, choose your preferred seats, enter passenger names and primary mobile number, and complete secure checkout." },
  { question: "Can I cancel my booking?", answer: "Yes, you can cancel your confirmed ticket from the 'My Bookings' section. Cancellation charges follow the operator's policy and automatic refunds are processed to your original payment method." },
  { question: "Do I need to carry a printed ticket?", answer: "No, RouteRush supports paperless digital m-tickets. Simply show the SMS or e-ticket on your phone to the coach conductor along with any government-issued photo ID." },
  { question: "How can I partner as a bus operator on RouteRush?", answer: "Bus operators can register via the Operator Portal. Our onboarding team verifies documentation, coach safety ratings, and assists with instant route listing." },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', type: 'Support Question', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', type: 'Support Question', message: '' });
    }, 600);
  };

  return (
    <PageWrapper title="Contact Support">
      <div className="min-h-screen bg-surface dark:bg-surface-dark pt-24 pb-16 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h1 className="text-3xl sm:text-4xl font-black text-charcoal dark:text-white mb-3 font-display tracking-tight">
              Get in Touch with RouteRush
            </h1>
            <p className="text-sm sm:text-base text-charcoal-lighter dark:text-gray-400">
              Have questions about your bus ticket, cancellation, or operator partnerships? Our 24/7 support desk is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Contact Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark p-6 sm:p-7">
                <h3 className="text-lg font-bold text-charcoal dark:text-white mb-6">Contact Channels</h3>
                
                <div className="space-y-6 text-xs sm:text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-light dark:bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-lighter dark:text-gray-400">Phone Support</p>
                      <a href="tel:+916379585628" className="text-sm font-bold text-charcoal dark:text-white hover:text-brand-primary transition-colors">
                        +91 63795 85628
                      </a>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">24/7 Traveler Helpdesk</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-light dark:bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-lighter dark:text-gray-400">Email Helpdesk</p>
                      <a href="mailto:support@routerush.in" className="text-sm font-bold text-charcoal dark:text-white hover:text-brand-primary transition-colors">
                        support@routerush.in
                      </a>
                      <p className="text-[11px] text-charcoal-lighter dark:text-gray-400 mt-0.5">Prompt response within 4 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-light dark:bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-lighter dark:text-gray-400">Corporate HQ</p>
                      <p className="text-sm font-bold text-charcoal dark:text-white">RouteRush Technologies</p>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400">Chennai, Tamil Nadu, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Form & FAQs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Form */}
              <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark p-6 sm:p-8">
                <h3 className="text-xl font-bold text-charcoal dark:text-white mb-1">Send a Message</h3>
                <p className="text-xs text-charcoal-lighter dark:text-gray-400 mb-6">
                  Fill in your query details below and our team will get in touch with you.
                </p>
                
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center"
                  >
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-bold text-charcoal dark:text-white mb-1">Message Sent Successfully!</h4>
                    <p className="text-xs text-charcoal-lighter dark:text-gray-300 mb-4 max-w-md mx-auto">
                      Thank you for contacting RouteRush. Our traveler support specialist has received your inquiry.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="primary" size="sm">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          placeholder="e.g. Rahul Sharma"
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          placeholder="rahul@example.com"
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Inquiry Topic</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        value={formData.type} 
                        onChange={e => setFormData({...formData, type: e.target.value})}
                      >
                        <option>Support Question</option>
                        <option>Booking & Cancellation</option>
                        <option>Feedback & Suggestions</option>
                        <option>Bus Operator Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Message</label>
                      <textarea 
                        required 
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                        placeholder="How can our support team assist you today?"
                        value={formData.message} 
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    <Button 
                      type="submit"
                      variant="primary"
                      size="md"
                      rightIcon={<Send className="w-4 h-4" />}
                      className="shadow-brand-lg"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>

              {/* FAQ Section */}
              <div id="faq" className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <HelpCircle className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-xl font-bold text-charcoal dark:text-white">Frequently Asked Questions</h3>
                </div>
                
                <div className="space-y-3">
                  {FAQ_DATA.map((faq, index) => (
                    <div key={index} className="border border-border dark:border-border-dark rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        className="w-full px-5 py-3.5 text-left flex justify-between items-center hover:bg-surface dark:hover:bg-surface-muted-dark/50 transition-colors focus:outline-none"
                      >
                        <span className="font-bold text-xs sm:text-sm text-charcoal dark:text-white pr-4">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeFaq === index ? 'transform rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-4 text-charcoal-lighter dark:text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-border dark:border-border-dark pt-3 bg-surface dark:bg-surface-muted-dark/30">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
