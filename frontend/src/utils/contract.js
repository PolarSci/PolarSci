import { ethers } from 'ethers';
import PolarSciABI from '../../artifacts/contracts/PolarSci.sol/PolarSci.json';

class PolarSciContract {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.contract = null;
    this.contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  }

  async init() {
    if (!this.contractAddress) {
      throw new Error('Contract address not found in environment variables');
    }

    this.contract = new ethers.Contract(
      this.contractAddress,
      PolarSciABI.abi,
      this.signer
    );
  }

  // Experiment Management
  async createExperiment(title, description, ipfsHash) {
    if (!this.contract) await this.init();
    const tx = await this.contract.createExperiment(title, description, ipfsHash);
    return await tx.wait();
  }

  async getExperiment(experimentId) {
    if (!this.contract) await this.init();
    return await this.contract.getExperiment(experimentId);
  }

  // Data Point Management
  async addDataPoint(experimentId, data, ipfsHash) {
    if (!this.contract) await this.init();
    const tx = await this.contract.addDataPoint(experimentId, data, ipfsHash);
    return await tx.wait();
  }

  async verifyDataPoint(experimentId, dataPointId) {
    if (!this.contract) await this.init();
    const tx = await this.contract.verifyDataPoint(experimentId, dataPointId);
    return await tx.wait();
  }

  async getDataPoint(experimentId, dataPointId) {
    if (!this.contract) await this.init();
    return await this.contract.getDataPoint(experimentId, dataPointId);
  }

  // Token Management
  async getBalance(address) {
    if (!this.contract) await this.init();
    return await this.contract.balanceOf(address);
  }

  // Contributor Management
  async getContributorPoints(address) {
    if (!this.contract) await this.init();
    return await this.contract.getContributorPoints(address);
  }

  // Event Listeners
  onExperimentCreated(callback) {
    if (!this.contract) throw new Error('Contract not initialized');
    this.contract.on('ExperimentCreated', callback);
  }

  onDataPointAdded(callback) {
    if (!this.contract) throw new Error('Contract not initialized');
    this.contract.on('DataPointAdded', callback);
  }

  onDataPointVerified(callback) {
    if (!this.contract) throw new Error('Contract not initialized');
    this.contract.on('DataPointVerified', callback);
  }

  onTokensRewarded(callback) {
    if (!this.contract) throw new Error('Contract not initialized');
    this.contract.on('TokensRewarded', callback);
  }

  // Remove Event Listeners
  removeAllListeners() {
    if (!this.contract) throw new Error('Contract not initialized');
    this.contract.removeAllListeners();
  }
}

export default PolarSciContract; 