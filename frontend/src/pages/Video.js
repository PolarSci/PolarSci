import React from 'react';
import { motion } from 'framer-motion';

const Video = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Video Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover opacity-50"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Discover PolarSci
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Learn how PolarSci is connecting Earth's polar regions with space through decentralized science and community contributions.
          </motion.p>
        </div>
      </section>

      {/* Video Player Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              className="w-full h-full"
              poster="/images/video-thumbnail.jpg"
            >
              <source src="/videos/polarsci-intro.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Polar Space Database</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Decentralized Storage",
                description: "All data is stored on IPFS and blockchain, ensuring transparency and immutability."
              },
              {
                number: "02",
                title: "AI Data Enhancement",
                description: "Ground-level data is transformed into space-perspective insights through advanced AI models."
              },
              {
                number: "03",
                title: "Community Validation",
                description: "Data quality is ensured through community DAO verification and AI-powered validation."
              },
              {
                number: "04",
                title: "Open Access",
                description: "Scientists worldwide can freely access the database, while NFT holders gain exclusive insights."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 p-8 rounded-xl"
              >
                <div className="text-blue-500 text-2xl mb-4">{feature.number}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="/database"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Request Database Access
            </a>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Join the Space Science Revolution</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Be part of the community that's bridging Earth's polar regions with the vastness of space.
            Together, we're creating a new era of decentralized scientific discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/waitlist"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Join the Waitlist
            </a>
            <a
              href="https://twitter.com/polarsci"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Join Twitter Community
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Video; 