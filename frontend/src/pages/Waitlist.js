import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Waitlist = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contributionType: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setSubmitted(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
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
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6"
          >
            Join the Waitlist
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-center text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Be among the first to contribute to the future of decentralized science.
            Choose your contribution type and join our community.
          </motion.p>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                <p className="text-gray-300 mb-8">
                  We've received your submission. We'll be in touch soon with more information about PolarSci.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Submit Another Entry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="contributionType" className="block text-sm font-medium text-gray-300 mb-2">
                    Data Contribution Type
                  </label>
                  <select
                    id="contributionType"
                    name="contributionType"
                    value={formData.contributionType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="">Select contribution type</option>
                    <option value="ground">Ground Data (Weather, Aurora, Snow Photos)</option>
                    <option value="experiments">Amateur Experiments (Radiation, Low Temperature)</option>
                    <option value="metadata">Metadata Tagging & Social Content</option>
                    <option value="virtual">Virtual Mission Participation</option>
                    <option value="governance">Community Governance</option>
                    <option value="scientist">Professional Scientist</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Submit
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Become a Space Scientist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Ground Data Contributor",
                description: "Use your smartphone to record weather data, capture aurora or snow photos, and let AI transform them into space-perspective insights."
              },
              {
                title: "Amateur Experimenter",
                description: "Conduct simple experiments with basic tools like Geiger counters or home freezers, and see your data transformed into virtual space data."
              },
              {
                title: "Metadata Contributor",
                description: "Tag public polar images or share polar-space themed social content to help optimize our AI models and database."
              },
              {
                title: "Virtual Mission Participant",
                description: "Join virtual satellite missions by holding PSCI tokens and collaborating to generate simulated data streams."
              },
              {
                title: "Community Governance",
                description: "Promote the project on social media, participate in the Science Council, and help shape research directions."
              },
              {
                title: "NFT Collector & Scientist",
                description: "Purchase community-minted NFTs or access the database to submit research proposals as a professional scientist."
              }
            ].map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 p-8 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-4">{role.title}</h3>
                <p className="text-gray-300">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Waitlist; 