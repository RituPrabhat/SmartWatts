'use client';

import { useState } from 'react';
import { HelpCircle, Mail, MessageCircle, BookOpen, Zap, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How is my electricity bill calculated?',
    a: 'We use the formula: Monthly Units = (Watts x Hours/Day x Days/Week x 4) / 1000. The bill is then calculated as Monthly Units x Rate per kWh (₹8).',
  },
  {
    q: 'How do I add a new appliance?',
    a: 'Go to the Devices page and click "Add Device". You can either fill in the details manually or use a preset for common appliances.',
  },
  {
    q: 'What does the savings simulation show?',
    a: 'The Savings page simulates how much you could save if you reduce each appliance\'s usage by 1 hour per day. It shows per-device and total potential savings.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Your data is stored securely in our database and is only accessible through your authenticated account. Each user\'s data is completely isolated.',
  },
  {
    q: 'What does "Active" vs "Standby" mean?',
    a: 'Active devices are currently in regular use. Standby devices are registered but may not be actively contributing to your daily consumption calculations.',
  },
  {
    q: 'How accurate are the projections?',
    a: 'Projections are based on the usage patterns you enter. The more accurate your hours/day and days/week inputs, the more precise the estimates will be.',
  },
];

const quickLinks = [
  { icon: BookOpen, title: 'Documentation', desc: 'Learn how to use SmartWatts' },
  { icon: MessageCircle, title: 'Feedback', desc: 'Share your suggestions' },
  { icon: Mail, title: 'Contact', desc: 'support@smartwatts.app' },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Help &amp; Support</h1>
        <p className="text-muted-foreground mt-1 text-sm">Find answers to common questions and get help</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <div
              key={link.title}
              className="card p-5 flex items-center gap-4 cursor-pointer hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))] transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm">{link.title}</p>
                <p className="text-xs text-muted-foreground truncate">{link.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-accent-foreground" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-lg border transition-colors ${
                  isOpen ? 'border-primary bg-accent' : 'border-border bg-muted/40'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >

                  <p className={`font-medium text-sm flex-1 ${isOpen ? 'text-accent-foreground' : 'text-foreground'}`}>
                    {faq.q}
                  </p>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-muted-foreground px-4 pb-4 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
