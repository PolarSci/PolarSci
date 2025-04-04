import React, { useState, useEffect } from 'react';
import PolarSciContract from '../utils/contract';

const DataPointManager = ({ experimentId }) => {
  const [data, setData] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const polarSciContract = new PolarSciContract(provider, signer);
          await polarSciContract.init();
          setContract(polarSciContract);

          // Check if current user is the experiment creator
          const experiment = await polarSciContract.getExperiment(experimentId);
          const userAddress = await signer.getAddress();
          setIsCreator(experiment.creator.toLowerCase() === userAddress.toLowerCase());

          // Load existing data points
          loadDataPoints(polarSciContract);
        }
      } catch (err) {
        setError('Failed to initialize contract: ' + err.message);
      }
    };

    initContract();
  }, [experimentId]);

  const loadDataPoints = async (contract) => {
    try {
      const experiment = await contract.getExperiment(experimentId);
      const points = [];
      for (let i = 0; i < experiment.dataPoints; i++) {
        const dataPoint = await contract.getDataPoint(experimentId, i);
        points.push(dataPoint);
      }
      setDataPoints(points);
    } catch (err) {
      setError('Failed to load data points: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      setError('Contract not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.addDataPoint(experimentId, data, ipfsHash);
      await tx.wait();
      // Clear form
      setData('');
      setIpfsHash('');
      // Reload data points
      await loadDataPoints(contract);
      alert('Data point added successfully!');
    } catch (err) {
      setError('Failed to add data point: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (dataPointId) => {
    if (!contract || !isCreator) return;

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.verifyDataPoint(experimentId, dataPointId);
      await tx.wait();
      // Reload data points
      await loadDataPoints(contract);
      alert('Data point verified successfully!');
    } catch (err) {
      setError('Failed to verify data point: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Data Points</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Data
          </label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
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
          {loading ? 'Adding...' : 'Add Data Point'}
        </button>
      </form>

      <div className="space-y-4">
        {dataPoints.map((point, index) => (
          <div key={index} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Data:</p>
                <p className="text-gray-700">{point.data}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Contributor: {point.contributor}
                </p>
                <p className="text-sm text-gray-500">
                  IPFS Hash: {point.ipfsHash}
                </p>
              </div>
              <div className="flex items-center">
                {point.verified ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Verified
                  </span>
                ) : isCreator ? (
                  <button
                    onClick={() => handleVerify(index)}
                    disabled={loading}
                    className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Verify
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataPointManager; 