import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
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
            From Ice to Stars,
            <br />
            Science Without Boundaries
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            PolarSci connects Earth's remote polar regions with the vastness of space,
            breaking traditional scientific barriers through blockchain and AI technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/video"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Watch Video
            </Link>
            <Link
              to="/learn"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Decentralized Science Revolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 p-8 rounded-xl"
            >
              <div className="text-blue-500 text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
              <p className="text-gray-300">
                100% token distribution to the community through Pump.fun, with no team reserves or transaction taxes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 p-8 rounded-xl"
            >
              <div className="text-blue-500 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-4">Polar Space Database</h3>
              <p className="text-gray-300">
                A decentralized scientific data repository modeling Fram2's polar orbital observations of climate, radiation, and ecology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800 p-8 rounded-xl"
            >
              <div className="text-blue-500 text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-4">AI-Enhanced Science</h3>
              <p className="text-gray-300">
                AI models transform everyday contributions into valuable scientific insights with a space perspective.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Database Section */}
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
            <Link
              to="/database"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Request Database Access
            </Link>
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
            <Link
              to="/waitlist"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Join the Waitlist
            </Link>
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

export default Home; 