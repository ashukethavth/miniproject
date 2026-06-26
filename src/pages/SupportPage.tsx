import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MagnifyingGlassIcon, 
  QuestionMarkCircleIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  LifebuoyIcon,
  EnvelopeIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/utils/cn';

const faqs = [
  { q: 'How do I enable Multi-Factor Authentication?', a: 'You can enable MFA in your Security Settings. We support Google Authenticator, Authy, and SMS-based verification.' },
  { q: 'What encryption standards does CloudLock use?', a: 'CloudLock uses AES-256 for data at rest and TLS 1.3 for data in transit. All encryption is zero-knowledge, meaning only you hold the keys.' },
  { q: 'How can I recover a deleted file?', a: 'Deleted files are moved to the Trash and kept for 30 days. You can restore them from the Trash folder in your File Manager.' },
  { q: 'Can I share files with people outside my organization?', a: 'Yes, you can create secure sharing links with optional password protection and expiration dates.' },
];

const categories = [
  { title: 'Getting Started', icon: BookOpenIcon, count: 12 },
  { title: 'Security & Privacy', icon: ShieldCheckIcon, count: 24 },
  { title: 'File Management', icon: DocumentTextIcon, count: 18 },
  { title: 'Team Collaboration', icon: UserGroupIcon, count: 15 },
];

import { ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <Container>
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight mb-6"
          >
            How can we help you today?
          </motion.h1>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search knowledge base, documentation, or FAQs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] text-lg shadow-xl shadow-slate-200/50 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
            />
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="p-8 rounded-[2.5rem] border-slate-200/60 bg-white hover:shadow-xl transition-all group text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <BookOpenIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Documentation</h3>
            <p className="text-sm text-slate-500 mb-6">Detailed guides on every feature and API integration.</p>
            <Button variant="outline" className="rounded-xl font-bold w-full">Browse Docs</Button>
          </Card>
          <Card className="p-8 rounded-[2.5rem] border-slate-200/60 bg-white hover:shadow-xl transition-all group text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <VideoCameraIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Video Tutorials</h3>
            <p className="text-sm text-slate-500 mb-6">Watch step-by-step videos to master CloudLock.</p>
            <Button variant="outline" className="rounded-xl font-bold w-full">Watch Now</Button>
          </Card>
          <Card className="p-8 rounded-[2.5rem] border-slate-200/60 bg-white hover:shadow-xl transition-all group text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Community</h3>
            <p className="text-sm text-slate-500 mb-6">Join the discussion and learn from other users.</p>
            <Button variant="outline" className="rounded-xl font-bold w-full">Join Discord</Button>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Categories */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Browse by Category</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button key={cat.title} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group text-left">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                        <cat.icon className="h-6 w-6 text-slate-400 group-hover:text-primary-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{cat.title}</p>
                        <p className="text-xs text-slate-500">{cat.count} articles</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-slate-300 group-hover:text-primary-600" />
                  </button>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <Card key={idx} className="p-0 rounded-2xl border-slate-200/60 bg-white overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-900">{faq.q}</span>
                      <ChevronDownIcon className={cn('h-5 w-5 text-slate-400 transition-transform', openFaq === idx && 'rotate-180')} />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-8">
            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold">Still need help?</h3>
              </div>
              <p className="text-sm text-slate-500 mb-8">Our support team is available 24/7 to assist you with any technical issues.</p>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                  <input type="text" placeholder="Brief description..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label>
                  <textarea rows={4} placeholder="Describe your issue in detail..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 resize-none" />
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 cursor-pointer hover:bg-slate-100 transition-colors">
                  <PaperClipIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">Attach files...</span>
                </div>
                <Button className="w-full rounded-xl font-bold shadow-lg shadow-primary-500/20">Submit Ticket</Button>
              </form>
            </Card>

            <Card className="p-8 rounded-[2.5rem] bg-slate-900 text-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <h3 className="text-lg font-bold">System Status</h3>
                </div>
                <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">Operational</Badge>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'API Services', status: 'Online' },
                  { label: 'File Storage', status: 'Online' },
                  { label: 'Encryption Engine', status: 'Online' },
                  { label: 'Auth Systems', status: 'Online' },
                ].map((service) => (
                  <div key={service.label} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{service.label}</span>
                    <span className="font-bold text-emerald-400">{service.status}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-8 text-white border-white/20 hover:bg-white/10 font-bold rounded-xl">
                Status Page <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};
