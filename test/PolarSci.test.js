const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PolarSci", function () {
  let PolarSci;
  let polarSci;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy contract
    PolarSci = await ethers.getContractFactory("PolarSci");
    polarSci = await PolarSci.deploy();
    await polarSci.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await polarSci.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await polarSci.balanceOf(owner.address);
      expect(await polarSci.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Experiment Creation", function () {
    it("Should create a new experiment", async function () {
      const title = "Test Experiment";
      const description = "Test Description";
      const ipfsHash = "QmTest123";

      await expect(polarSci.connect(addr1).createExperiment(title, description, ipfsHash))
        .to.emit(polarSci, "ExperimentCreated")
        .withArgs(0, title, addr1.address);

      const experiment = await polarSci.getExperiment(0);
      expect(experiment.title).to.equal(title);
      expect(experiment.description).to.equal(description);
      expect(experiment.creator).to.equal(addr1.address);
      expect(experiment.isActive).to.equal(true);
      expect(experiment.dataPoints).to.equal(0);
      expect(experiment.ipfsHash).to.equal(ipfsHash);
    });

    it("Should fail with empty title", async function () {
      await expect(
        polarSci.connect(addr1).createExperiment("", "Test Description", "QmTest123")
      ).to.be.revertedWith("Title cannot be empty");
    });
  });

  describe("Data Point Management", function () {
    beforeEach(async function () {
      await polarSci.connect(addr1).createExperiment(
        "Test Experiment",
        "Test Description",
        "QmTest123"
      );
    });

    it("Should add a data point to an experiment", async function () {
      const data = "Test Data";
      const ipfsHash = "QmData123";

      await expect(polarSci.connect(addr2).addDataPoint(0, data, ipfsHash))
        .to.emit(polarSci, "DataPointAdded")
        .withArgs(0, 0, addr2.address);

      const dataPoint = await polarSci.getDataPoint(0, 0);
      expect(dataPoint.data).to.equal(data);
      expect(dataPoint.contributor).to.equal(addr2.address);
      expect(dataPoint.verified).to.equal(false);
      expect(dataPoint.ipfsHash).to.equal(ipfsHash);
    });

    it("Should verify a data point", async function () {
      await polarSci.connect(addr2).addDataPoint(0, "Test Data", "QmData123");

      await expect(polarSci.connect(addr1).verifyDataPoint(0, 0))
        .to.emit(polarSci, "DataPointVerified")
        .withArgs(0, 0, addr1.address)
        .to.emit(polarSci, "TokensRewarded")
        .withArgs(addr2.address, ethers.utils.parseEther("100"));

      const dataPoint = await polarSci.getDataPoint(0, 0);
      expect(dataPoint.verified).to.equal(true);

      const contributorPoints = await polarSci.getContributorPoints(addr2.address);
      expect(contributorPoints).to.equal(1);

      const contributorBalance = await polarSci.balanceOf(addr2.address);
      expect(contributorBalance).to.equal(ethers.utils.parseEther("100"));
    });

    it("Should fail verification by non-creator", async function () {
      await polarSci.connect(addr2).addDataPoint(0, "Test Data", "QmData123");

      await expect(
        polarSci.connect(addr2).verifyDataPoint(0, 0)
      ).to.be.revertedWith("Not authorized to verify");
    });
  });

  describe("Contributor Points", function () {
    beforeEach(async function () {
      await polarSci.connect(addr1).createExperiment(
        "Test Experiment",
        "Test Description",
        "QmTest123"
      );
      await polarSci.connect(addr2).addDataPoint(0, "Test Data", "QmData123");
    });

    it("Should track contributor points correctly", async function () {
      expect(await polarSci.getContributorPoints(addr2.address)).to.equal(0);
      
      await polarSci.connect(addr1).verifyDataPoint(0, 0);
      
      expect(await polarSci.getContributorPoints(addr2.address)).to.equal(1);
    });
  });
}); 