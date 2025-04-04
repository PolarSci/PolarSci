import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PolarSciContract from '../utils/contract';

const Dashboard = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [contributorPoints, setContributorPoints] = useState(0);
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

          const address = await signer.getAddress();
          setAccount(address);

          const balance = await polarSciContract.getBalance(address);
          setBalance(ethers.utils.formatEther(balance));

          const points = await polarSciContract.getContributorPoints(address);
          setContributorPoints(points.toNumber());

          // Load user's experiments
          loadExperiments(polarSciContract);
        }
      } catch (err) {
        setError('Failed to initialize contract: ' + err.message);
        setLoading(false);
      }
    };

    initContract();
  }, []);

  const loadExperiments = async (contract) => {
    try {
      const experimentCount = await contract.experimentCount();
      const userExperiments = [];
      
      for (let i = 0; i < experimentCount; i++) {
        const experiment = await contract.getExperiment(i);
        if (experiment.creator.toLowerCase() === account.toLowerCase()) {
          userExperiments.push({
            id: i,
            ...experiment
          });
        }
      }
      
      setExperiments(userExperiments);
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Token Balance</dt>
                    <dd className="text-lg font-medium text-gray-900">{parseFloat(balance).toFixed(2)} POLAR</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Contributor Points</dt>
                    <dd className="text-lg font-medium text-gray-900">{contributorPoints}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Your Experiments</dt>
                    <dd className="text-lg font-medium text-gray-900">{experiments.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Experiments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Your Experiments</h2>
          </div>
          <div className="border-t border-gray-200">
            {experiments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No experiments found. Create one to get started!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {experiments.map((experiment) => (
                  <li key={experiment.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-blue-600 truncate">
                          {experiment.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created {new Date(experiment.timestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          experiment.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {experiment.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {experiment.dataPoints} data points
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 