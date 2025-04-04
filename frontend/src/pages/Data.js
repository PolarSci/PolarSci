import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PolarSciContract from '../utils/contract';
import IPFSService from '../utils/ipfs';

const Data = () => {
  const [contract, setContract] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
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
        }
      } catch (err) {
        setError('Failed to initialize contract: ' + err.message);
        setLoading(false);
      }
    };

    initContract();
  }, []);

  useEffect(() => {
    if (selectedExperiment && contract) {
      loadDataPoints(contract);
    }
  }, [selectedExperiment, contract]);

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

  const loadDataPoints = async (contract) => {
    try {
      const experiment = await contract.getExperiment(selectedExperiment);
      const points = [];
      
      for (let i = 0; i < experiment.dataPoints; i++) {
        const dataPoint = await contract.getDataPoint(selectedExperiment, i);
        points.push({
          id: i,
          ...dataPoint
        });
      }
      
      setDataPoints(points);
    } catch (err) {
      setError('Failed to load data points: ' + err.message);
    }
  };

  const handleExperimentSelect = (experimentId) => {
    setSelectedExperiment(experimentId);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Analysis</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Experiment List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Experiments</h2>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {experiments.map((experiment) => (
                    <li
                      key={experiment.id}
                      className={`px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50 ${
                        selectedExperiment === experiment.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleExperimentSelect(experiment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-blue-600 truncate">
                            {experiment.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {experiment.dataPoints} data points
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
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Data Points */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedExperiment !== null
                    ? experiments.find(e => e.id === selectedExperiment)?.title
                    : 'Select an Experiment'}
                </h2>
              </div>
              <div className="border-t border-gray-200">
                {selectedExperiment === null ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Select an experiment to view its data points</p>
                  </div>
                ) : dataPoints.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No data points available for this experiment</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {dataPoints.map((point) => (
                      <div key={point.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-900">{point.data}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <p>Contributor: {point.contributor}</p>
                              <p className="mx-2">•</p>
                              <p>
                                {new Date(point.timestamp * 1000).toLocaleString()}
                              </p>
                            </div>
                            <div className="mt-2">
                              <a
                                href={IPFSService.getFileURL(point.ipfsHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                View on IPFS →
                              </a>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              point.verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {point.verified ? 'Verified' : 'Pending Verification'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data; 