import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    q: '📌 What are the benefits of NSM Giveaways?',
    a: (
      <div className="space-y-2">
        <div>NSM Giveaways rewards real users with real value — no bots, no fluff.</div>
        <ul className="list-disc pl-6 space-y-1">
          <li>🎁 Win KRC20 tokens, KRC721 NFTs, and $KASPA</li>
          <li>🔍 Verified giveaways only – vetted by NSM & A-Team</li>
          <li>🧑‍🤝‍🧑 Community-first – we give back to our true supporters</li>
          <li>🤝 Collaborate & get exposure if you're a builder or project owner</li>
        </ul>
        <div className="italic text-primary-400">"Join. Win. Repeat. It's that simple."</div>
      </div>
    )
  },
  {
    q: '💎 Why is NSM Giveaways a core project of #KRC20 & #KRC721?',
    a: (
      <div className="space-y-2">
        <div>NSM is not just a giveaway bot — it's a trusted launchpad for exposure on the Kaspa chain:</div>
        <ul className="list-disc pl-6 space-y-1">
          <li>🚀 Actively promotes KRC20/KRC721 projects</li>
          <li>🧠 Collaborates only with vetted & transparent builders</li>
          <li>🔥 Brings real visibility to new tokens, NFTs, and communities</li>
          <li>📢 Uses X (Twitter), Telegram, and YouTube for multi-channel reach</li>
        </ul>
        <div className="italic text-primary-400">"When NSM backs a project, people pay attention."</div>
      </div>
    )
  },
  {
    q: '🌱 What is the future plan of NSM Giveaways?',
    a: (
      <div className="space-y-2">
        <div>NSM is just getting started. Here's what's ahead:</div>
        <ul className="list-disc pl-6 space-y-1">
          <li>✅ A dedicated dashboard for giveaway tracking</li>
          <li>🎮 Gamified experience for participants (badges, ranks, loyalty rewards)</li>
          <li>🌍 Partner onboarding for KRC20/NFT creators & influencers</li>
          <li>💰 Bigger reward pools via community contributions & sponsorships</li>
          <li>📊 Transparent on-chain verification tools for winners</li>
        </ul>
        <div className="italic text-primary-400">"This isn't a one-time drop game. It's a growing platform."</div>
      </div>
    )
  },
  {
    q: '🎁 What else is in store for NSM Giveaways?',
    a: (
      <div className="space-y-2">
        <div>More than just giveaways:</div>
        <ul className="list-disc pl-6 space-y-1">
          <li>🔄 Donations model: Support the mission with NFTs, $KAS, or tokens</li>
          <li>🛠️ Exposure tools for new projects (features, shoutouts, audit checks)</li>
          <li>💬 AMA Sessions with builders and influencers</li>
          <li>👥 A-Team curation: Only quality projects make it through</li>
        </ul>
        <div className="italic text-primary-400">"If it's on NSM, it's been through fire."</div>
      </div>
    )
  },
  {
    q: '🙋 How can I get involved with the NSM Giveaways community?',
    a: (
      <div className="space-y-2">
        <div>You can join in several ways:</div>
        <ul className="list-disc pl-6 space-y-1">
          <li>🐦 Follow on X (Twitter) for active drops</li>
          <li>💬 Join the Telegram community for updates & instant wins</li>
          <li>📺 Watch the YouTube channel for collabs & featured tokens</li>
          <li>🤝 DM for collaborations or giveaways</li>
        </ul>
        <div className="italic text-primary-400">"This is community-first. Everyone's welcome."</div>
      </div>
    )
  },
  {
    q: '🧬 What makes NSM Giveaways unique from other projects?',
    a: (
      <div className="space-y-2">
        <ul className="list-disc pl-6 space-y-1">
          <li>✅ 100% Transparency</li>
          <li>✅ No edited videos. No scripts. Just facts.</li>
          <li>✅ Built around $KASPA, not on hype</li>
          <li>✅ Backed by a trusted A-Team</li>
          <li>✅ Every reward backed by the community</li>
          <li>✅ Grassroots. Real people. Real results.</li>
        </ul>
        <div className="italic text-primary-400">"Other projects promise. NSM delivers."</div>
      </div>
    )
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 bg-dark-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            FAQ
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about NSM Giveaways
          </p>
        </motion.div>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-dark-800/50 border border-dark-700 rounded-xl">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none hover:bg-dark-700/50 transition-colors rounded-xl"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-xl font-bold text-white">{faq.q}</span>
                {openIndex === idx ? (
                  <ChevronUp className="h-6 w-6 text-primary-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-primary-400" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-6 pb-6 text-gray-300"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 