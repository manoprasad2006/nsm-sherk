import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const testimonials = [
  {
    text: "I love it! Keep up the great work, brother, you are doing an amazing job for the community! I am pretty sure you will be very successful once Kaspa network will gain more attention!",
    author: "Krex Dev",
    image: "/krex.jpg"
  },
  {
    text: "Your a wolf trust is there from day one, thanks man really appreciate that",
    author: "Wolfy Dev",
    image: "/wolfy_main.jpg"
  },
  {
    text: "Of course, man! I like what you're doing for the community. Keep it up 👍🏽",
    author: "Community Member",
    image: "/andrew.jpg"
  },
  {
    text: "I really like what you're doing in this space! Grinding hard!",
    author: "Kranky Dev",
    image: "/Krunky.jpg"
  },
  {
    text: "Love what you do man! i always get happy when i see you around everywhere. gives me a big smile. and gives me energy too! just wanted to let you know!",
    author: "From The Mayor Of Wolfy 👀",
    image: "/Wolfy Mayor.jpg"
  },
  {
    text: "You put in a lot of work so definitely well deserved that you get in nice and early with the best projects.",
    author: "CryptoEllisYT (Youtube Influencer)",
    image: "/ellis.jpg"
  },
  {
    text: "Hey brother! Hope everythings been going well. Thanks for always keeping things bullish and doing what you do!",
    author: "KASEI Dev",
    image: "/kasei.jpg"
  }
]

export function TestimonialsSection() {
  return (
    <section id="testimonial" className="py-20 bg-dark-800/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Community Love ❤️
          </h2>
          <p className="text-xl text-gray-400">
            What our amazing community says about NSM
          </p>
        </motion.div>

        {/* Moving chain animation */}
        <div className="relative">
          <motion.div
            animate={{
              x: [0, -1000]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear"
              }
            }}
            className="flex space-x-6"
          >
            {/* First set of testimonials */}
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`first-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80 bg-gradient-to-br from-dark-700/80 to-dark-800/80 border border-primary-500/30 rounded-2xl p-6 shadow-xl"
              >
                {/* Avatar and name row */}
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-500 shadow-md mr-3"
                  />
                  <span className="text-lg font-semibold text-white">{testimonial.author}</span>
                </div>
                <p className="text-gray-300 italic text-sm leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`second-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80 bg-gradient-to-br from-dark-700/80 to-dark-800/80 border border-primary-500/30 rounded-2xl p-6 shadow-xl"
              >
                {/* Avatar and name row */}
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-500 shadow-md mr-3"
                  />
                  <span className="text-lg font-semibold text-white">{testimonial.author}</span>
                </div>
                <p className="text-gray-300 italic text-sm leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 