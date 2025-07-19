import React from 'react'
import { motion } from 'framer-motion'
import { FileText, HelpCircle, Shield, Wallet, Users, Award, TrendingUp } from 'lucide-react'

export function DocumentationSection() {
  const faqItems = [
    {
      question: "How do I get my rewards?",
      answer: "Log in to the SHERK website via Google, enter your nickname and Kaspa wallet address, then click 'Check' - the system will automatically detect your NFTs and display your reward rate."
    },
    {
      question: "Can I sell my NFT?",
      answer: "Yes, you can sell it. However, rewards are only paid for NFTs that are on your wallet at the time of snapshot."
    },
    {
      question: "What if I held an NFT for less than a week?",
      answer: "It doesn't matter. Even if you minted or bought your NFT the day before — you will still receive the reward the next day."
    },
    {
      question: "What wallets are supported?",
      answer: "SHERK supports KASWARE, KSPR, and GHOSTWALLET. These wallets support KRC20 and KRC721 tokens."
    },
    {
      question: "How are rewards distributed?",
      answer: "All staking rewards are manually processed via the SHERK website and payouts are distributed via kaspa.com's official airdrop system."
    },
    {
      question: "Is there smart contract risk?",
      answer: "No. SHERK operates temporarily without smart contracts, ensuring maximum control, transparency, and user safety."
    }
  ]

  const tokenSpecs = [
    { label: 'Token Name', value: 'SHERK' },
    { label: 'Ticker', value: 'SHERK' },
    { label: 'Network', value: 'BLOCKDAG (Kaspa)' },
    { label: 'Total Supply', value: '999,999,999 SHERK' },
    { label: 'Format', value: 'Fixed supply — no inflation, no resets' },
    { label: 'Exchange Rate', value: '1 Kaspa = 15,000 SHERK' },
  ]

  const nftCollection = [
    { label: 'Total NFTs', value: '2,222' },
    { label: 'Common NFTs', value: '1,110 (1 pickaxe each)' },
    { label: 'Rare NFTs', value: '555 (2 pickaxes each)' },
    { label: 'Ultra Rare NFTs', value: '333 (3 pickaxes each)' },
    { label: 'BOOM NFTs', value: '54 (4 pickaxes each)' },
    { label: 'Total Pickaxes', value: '3,686' },
  ]

  const rewardSystem = [
    { label: 'Total Rewards Pool', value: '300,000,000 SHERK' },
    { label: 'Duration', value: '52 weeks' },
    { label: 'Reward per Pickaxe', value: '1,562 SHERK/week' },
    { label: 'Common NFT Reward', value: '1,562 SHERK/week' },
    { label: 'Rare NFT Reward', value: '3,124 SHERK/week' },
    { label: 'Ultra Rare NFT Reward', value: '4,686 SHERK/week' },
    { label: 'BOOM NFT Reward', value: '6,248 SHERK/week' },
  ]

  return (
    <section className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            SHERK Documentation
          </h2>
          <p className="text-xl text-gray-400">
            Complete guide to the SHERK token ecosystem and staking mechanics
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Token Specifications */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-dark-800/50 border border-primary-500/30 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-primary-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Token Specifications</h3>
              </div>
              <div className="space-y-4">
                {tokenSpecs.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">{spec.label}</span>
                    <span className="text-white font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-800/50 border border-yellow-500/30 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Award className="h-6 w-6 text-yellow-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">NFT Collection</h3>
              </div>
              <div className="space-y-4">
                {nftCollection.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Reward System & FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-dark-800/50 border border-green-500/30 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Reward System</h3>
              </div>
              <div className="space-y-4">
                {rewardSystem.map((reward, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">{reward.label}</span>
                    <span className="text-white font-medium">{reward.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-800/50 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <HelpCircle className="h-6 w-6 text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-700/50 pb-4 last:border-b-0">
                    <h4 className="text-white font-semibold mb-2">{item.question}</h4>
                    <p className="text-gray-400 text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 border border-primary-500/30 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">SHERK Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
                SHERK is a next-generation token created to promote the Kaspa ecosystem and support white tigers through real charitable initiatives. 
                Our blue tiger is more than just a symbol - he is a king, a hero uniting meme culture, community power, NFT staking, and weekly rewards. 
                SHERK is not your typical coin with boring mechanics. It's a token with soul, vision, and power.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security & Team Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-dark-800/50 border border-green-500/30 rounded-2xl p-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-400 mr-3" />
              <h4 className="text-xl font-bold text-white">Security Features</h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• No smart contract risk</li>
              <li>• Manual reward processing</li>
              <li>• Wallets not connected - only address submitted</li>
              <li>• Maximum control and transparency</li>
              <li>• Official kaspa.com airdrop system</li>
            </ul>
          </div>

          <div className="bg-dark-800/50 border border-blue-500/30 rounded-2xl p-8">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-400 mr-3" />
              <h4 className="text-xl font-bold text-white">Core Team</h4>
            </div>
            <div className="space-y-3 text-gray-300">
              <p><span className="text-blue-400 font-semibold">NSM GIVEAWAYS</span> - Strategic director, concept founder, and lead community coordinator</p>
              <p><span className="text-blue-400 font-semibold">KOMA</span> - Lead artist, visual designer, and the creative engine behind SHERK</p>
              <p><span className="text-blue-400 font-semibold">MANO</span> - Technical architect responsible for website, reward logic, and system automation</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 