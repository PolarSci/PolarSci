import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PolarSciContract from '../utils/contract';

const ExperimentList = () => {
  const [contract, setContract] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const polarSciContract = new PolarSciContract(provider, signer);
          await polarSciContract.init();
          setContract(polarSciContract);

          // Load experiments
          loadExperiments(polarSciContract);

          // Listen for new experiments
          polarSciContract.onExperimentCreated((experimentId, title, creator) => {
            loadExperiments(polarSciContract);
          });
        }
      } catch (err) {
        setError('Failed to initialize contract: ' + err.message);
        setLoading(false);
      }
    };

    initContract();

    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, []);

  const loadExperiments = async (contract) => {
    try {
      const experimentCount = await contract.experimentCount();
      const loadedExperiments = [];
      
      for (let i = 0; i < experimentCount; i++) {
        const experiment = await contract.getExperiment(i);
        loadedExperiments.push({
          id: i,
          ...experiment
        });
      }
      
      setExperiments(loadedExperiments);
    } catch (err) {
      setError('Failed to load experiments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Experiments</h2>
      
      {experiments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No experiments found. Create one to get started!
        </div>
      ) : (
        <div className="space-y-6">
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{experiment.title}</h3>
                  <p className="text-gray-600 mb-4">{experiment.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Creator: {experiment.creator}</p>
                    <p>Data Points: {experiment.dataPoints}</p>
                    <p>Created: {new Date(experiment.timestamp * 1000).toLocaleString()}</p>
                    <p>IPFS Hash: {experiment.ipfsHash}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {experiment.isActive ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Active
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <a
                  href={`/experiment/${experiment.id}`}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperimentList; 