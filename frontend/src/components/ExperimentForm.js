import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PolarSciContract from '../utils/contract';

const ExperimentForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const polarSciContract = new PolarSciContract(provider, signer);
          await polarSciContract.init();
          setContract(polarSciContract);
        } else {
          setError('Please install MetaMask to use this application');
        }
      } catch (err) {
        setError('Failed to initialize contract: ' + err.message);
      }
    };

    initContract();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      setError('Contract not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.createExperiment(title, description, ipfsHash);
      await tx.wait();
      // Clear form
      setTitle('');
      setDescription('');
      setIpfsHash('');
      alert('Experiment created successfully!');
    } catch (err) {
      setError('Failed to create experiment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create New Experiment</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            IPFS Hash
          </label>
          <input
            type="text"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !contract}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading || !contract ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Experiment'}
        </button>
      </form>
    </div>
  );
};

export default ExperimentForm; 