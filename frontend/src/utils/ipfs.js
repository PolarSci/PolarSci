import { create } from 'ipfs-http-client';

class IPFSService {
  constructor() {
    this.client = null;
    this.projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
    this.projectSecret = process.env.REACT_APP_IPFS_PROJECT_SECRET;
    this.auth = 'Basic ' + Buffer.from(this.projectId + ':' + this.projectSecret).toString('base64');
  }

  async init() {
    if (!this.client) {
      this.client = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: this.auth,
        },
      });
    }
  }

  async uploadFile(file) {
    await this.init();
    try {
      const added = await this.client.add(file);
      return added.path;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  }

  async uploadJSON(data) {
    await this.init();
    try {
      const buffer = Buffer.from(JSON.stringify(data));
      const added = await this.client.add(buffer);
      return added.path;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }

  getFileURL(hash) {
    return `https://ipfs.io/ipfs/${hash}`;
  }
}

export default new IPFSService(); 