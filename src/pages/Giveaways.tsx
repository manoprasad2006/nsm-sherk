import React, { useState } from 'react'
import { Navbar } from '../components/Layout/Navbar'
import { Footer } from '../components/Layout/Footer'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import { HeroSection } from '../components/Giveaways/HeroSection'
import { AboutSection } from '../components/Giveaways/AboutSection'
import { HistorySection } from '../components/Giveaways/HistorySection'
import { OngoingGiveawaysSection } from '../components/Giveaways/OngoingGiveawaysSection'
import { TestimonialsSection } from '../components/Giveaways/TestimonialsSection'
import { FAQSection } from '../components/Giveaways/FAQSection'
import { ContactSection } from '../components/Giveaways/ContactSection'
import { Gift, Users } from 'lucide-react'
import { Modal } from '../components/UI/Modal'
import { GlowButton } from '../components/UI/GlowButton'

export default function Giveaways() {
  const winners = [
    { name: 'CryptoKing23', amount: '500 KAS', date: '2025-01-10', verified: true, avatar: '👑' },
    { name: 'MemeQueen', amount: '1000 KAS', date: '2025-01-08', verified: true, avatar: '👸' },
    { name: 'DiamondHands', amount: '750 KAS', date: '2025-01-05', verified: true, avatar: '💎' },
    { name: 'KaspaKiller', amount: '1200 KAS', date: '2025-01-03', verified: true, avatar: '⚡' },
    { name: 'MoonWalker', amount: '800 KAS', date: '2025-01-01', verified: true, avatar: '🚀' },
  ]

  const testimonials = [
    {
      text: "NSM actually pays out! Got my 500 KAS in 24 hours. This is the real deal.",
      author: "@CryptoWinner",
      platform: "Telegram",
      rating: 5
    },
    {
      text: "Been following NSM for months. Most trustworthy giveaways in the space.",
      author: "@TrustInNSM",
      platform: "Twitter",
      rating: 5
    },
    {
      text: "Finally found legitimate giveaways. NSM doesn't lie or cheat!",
      author: "@HonestUser",
      platform: "Discord",
      rating: 5
    },
    {
      text: "The Meme King delivers! Got my payout instantly. Legend!",
      author: "@MemeLord",
      platform: "Telegram",
      rating: 5
    }
  ]

  const faqs = [
    {
      q: "What are the benefits of NSM Giveaways?",
      a: "NSM Giveaways offers real rewards, community engagement, and transparent processes. Participants can win $KAS, KRC20 tokens, and NFTs while being part of a trusted and fun community."
    },
    {
      q: "Why is NSM Giveaways a core project for #KRC20 & #KRC721?",
      a: "NSM Giveaways actively promotes and supports the KRC20 and KRC721 ecosystems by providing exposure, education, and real utility through regular, high-quality giveaways."
    },
    {
      q: "What is the future plan of this project?",
      a: "We plan to expand our partnerships, introduce more exclusive giveaways, and build new features that make participation even easier and more rewarding for the community."
    },
    {
      q: "What else is in the store of NSM Giveaways?",
      a: "Expect collaborations with top projects, special event giveaways, educational content, and more ways for the community to get involved and win."
    },
    {
      q: "How can I get involved with NSM Giveaways community?",
      a: "Join our Telegram, follow us on X and YouTube, participate in giveaways, and invite friends. Everyone is welcome to be part of the NSM family!"
    },
    {
      q: "What makes NSM GIVEAWAYS unique from other projects?",
      a: "Our focus on transparency, fairness, and genuine community building sets us apart. We deliver real rewards, no spam or scams, and always put our participants first."
    }
  ]

  const ongoingGiveaways = [
    {
      title: "Weekly KAS Drop",
      prize: "2,500 KAS",
      timeLeft: "3 Days Left",
      entries: 847,
      maxEntries: 1000,
      color: "green",
      icon: Gift,
      requirements: [
        "Join NSM Telegram Channel",
        "Hold at least 1 NSM NFT",
        "Invite 1 friend to community"
      ]
    },
    {
      title: "Community Milestone",
      prize: "1,000 KAS Bonus",
      timeLeft: "7 Days Left",
      entries: 5247,
      maxEntries: 6000,
      color: "primary",
      icon: Users,
      requirements: [
        "Help reach 6,000 Telegram members",
        "Active community participation",
        "Share our mission"
      ]
    }
  ]

  const [showWinnersModal, setShowWinnersModal] = useState(false)

  // Data for previous giveaway winners
  const previousGiveaways = [
    {
      title: '1M $TROK Each',
      winners: [
        '@AlooGold24242', '@O_Nimsi', '@Adityapr1Marwan', '@ecnew24', '@BaakiBaaki001'
      ],
      description: 'Winners are selected randomly using a verified tool like http://Random.org to ensure fairness, as recommended by contest management best practices. You all won 🏆 1M $TROK Each congratulations 🥂',
      proof: 'https://x.com/OnlyNSM/status/1938871630387982473'
    },
    {
      title: 'PXMUTANT NFT GIVEAWAY',
      winners: ['@The__Hitman_'],
      description: 'Utility attached NFT from $MUTANT collection! The winner is @The__Hitman_.',
      proof: 'https://x.com/OnlyNSM/status/1937501498742833417'
    },
    {
      title: '2nd week 1M $TROK Each',
      winners: ['@Onlyoneguy01', '@httpudhay', '@erricccccc', '@Bellrock157', '@AlooGold24242'],
      description: 'For 1M $TROK Each Winners are :- Congratulations 🍻 too all the lucky winners 🍀',
      proof: 'https://x.com/OnlyNSM/status/1936195351503143226'
    },
    {
      title: 'NSM GIVEAWAYS Battle card',
      winners: ['@Dkapital_01'],
      description: "The winner of 'NSM GIVEAWAYS' Battle card is @Dkapital_01. To collect your battle card go to @kasbtc_krc20 TG and Tag the developer ( Samira $KASBTC )",
      proof: 'https://x.com/OnlyNSM/status/1935342313099952373'
    },
    {
      title: '5 lucky 🍀 Winners 🏆 🎉',
      winners: ['@NolaGirl_73', '@_DrLiberty', '@Yeomansprings', '@BaakiBaaki001', '@AbdullahiD62152'],
      description: 'Your rewards will be sent into your Given Addresses in short period of time 1M $TROK Tokens to each 🏆',
      proof: 'https://x.com/OnlyNSM/status/1934259845802438989'
    },
    {
      title: 'KasWarriors Winner',
      winners: ['@novoiceless11'],
      description: 'The winner is @novoiceless11, who followed all accounts, tagged three friends, and provided a valid $KAS wallet address.',
      proof: 'https://x.com/OnlyNSM/status/1933131983263326551'
    },
    {
      title: '4 NFT\'s Giveaway',
      winners: ['@Plutokaspa'],
      description: '4 NFT\'s Giveaway won by @Plutokaspa. The winner completed all the tasks as mentioned in the Giveaway.',
      proof: 'https://x.com/OnlyNSM/status/1932804009854971970'
    },
    {
      title: '$KORN Giveaway Winners',
      winners: ['@CNinja75788', '@MYGBIT1', '@Ayobami029', '@O_Nimsi', '@KDarklove'],
      description: 'The winners are chosen based on their likes, reposts, follows, tagged friends, and submitted Telegram screenshots with Kasware addresses.',
      proof: 'https://x.com/OnlyNSM/status/1932456065175810201'
    },
    {
      title: 'Gifted NFT + $KASPUNK NFT #255',
      winners: ['@HXC_VOX'],
      description: 'The winner was @HXC_VOX 🏆 and that NFT worth around 30,000 $KASPA according to the traits 🔥',
      proof: 'https://x.com/OnlyNSM/status/1931654106953003192'
    },
    {
      title: 'realKranky giveaway',
      winners: ['@andyzav11', '@AbdullahiD62152', '@MYGBIT1'],
      description: '🥇 - Giggsy 🏆 (@andyzav11), 🥈- ISTIQAAMAH 🏆(@AbdullahiD62152), 🥉- Dr Pixel 🏆(@MYGBIT1)',
      proof: 'https://x.com/OnlyNSM/status/1930269529017594315'
    },
    {
      title: '500 $KASPA GIVEAWAY ALERT',
      winners: ['@ladylorecat'],
      description: '1 Winner 🏆 = 500 $KASPA. The official $KOMA whale 🐳 is @ladylorecat as we know and believe 👏',
      proof: 'https://x.com/OnlyNSM/status/1931925762313269560'
    },
    {
      title: 'Atomic #KRC20 Collaboration',
      winners: [],
      description: 'NSM Giveaways x Atomic #KRC20 Collaboration Alert! Community-driven event packed with rewards.',
      proof: 'https://x.com/OnlyNSM/status/1934566290821439937'
    }
  ]

  // Compose the most recent winners from previousGiveaways for the HistorySection
  const winnersForHistory = previousGiveaways.slice(0, 5).flatMap(gw =>
    gw.winners.map(winner => ({
      name: winner,
      amount: gw.title,
      date: '', // You can add a date if available in your data
      verified: true,
      avatar: '🏆'
    }))
  )

  return (
    <div className="min-h-screen bg-dark-900">
      <ParticleBackground />
      <Navbar variant="giveaways" />
      <HeroSection />
      <AboutSection />
      <div className="flex justify-center my-8">
        <GlowButton onClick={() => setShowWinnersModal(true)} size="lg">
          Previous Giveaway Winners
        </GlowButton>
      </div>
      <Modal open={showWinnersModal} onClose={() => setShowWinnersModal(false)}>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Previous Giveaway Winners</h2>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {previousGiveaways.map((gw, idx) => (
            <div key={idx} className="bg-dark-700/60 rounded-xl p-4 border border-primary-500/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h3 className="text-lg font-semibold text-primary-400 mb-2 md:mb-0">{gw.title}</h3>
                <a href={gw.proof} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-sm hover:text-blue-300">Proof on Twitter/X</a>
              </div>
              <div className="text-gray-300 mb-2">{gw.description}</div>
              {gw.winners.length > 0 && (
                <div className="flex flex-wrap gap-2 text-sm">
                  {gw.winners.map((w, i) => (
                    <span key={i} className="bg-dark-900/60 px-3 py-1 rounded-full border border-primary-500/30 text-primary-300">{w}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
      <HistorySection winners={winnersForHistory} />
      <OngoingGiveawaysSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  )
}