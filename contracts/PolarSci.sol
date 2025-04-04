// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@solana/web3.js/contracts/token/ERC20.sol";
import "@solana/web3.js/contracts/access/Ownable.sol";
import "@solana/web3.js/contracts/security/ReentrancyGuard.sol";

contract PolarSci is ERC20, Ownable, ReentrancyGuard {
    // Structs
    struct Experiment {
        string title;
        string description;
        address creator;
        uint256 timestamp;
        bool isActive;
        uint256 dataPoints;
        string ipfsHash;
    }

    struct DataPoint {
        string data;
        address contributor;
        uint256 timestamp;
        string ipfsHash;
        bool verified;
    }

    // State variables
    mapping(uint256 => Experiment) public experiments;
    mapping(uint256 => mapping(uint256 => DataPoint)) public experimentData;
    mapping(address => uint256) public contributorPoints;
    uint256 public experimentCount;
    uint256 public constant MINIMUM_CONTRIBUTION = 100 * 10**18; // 100 tokens

    // Events
    event ExperimentCreated(uint256 indexed experimentId, string title, address creator);
    event DataPointAdded(uint256 indexed experimentId, uint256 indexed dataPointId, address contributor);
    event DataPointVerified(uint256 indexed experimentId, uint256 indexed dataPointId, address verifier);
    event TokensRewarded(address indexed contributor, uint256 amount);

    constructor() ERC20("PolarSci Token", "POLAR") {
        // Initial token supply: 1,000,000 tokens
        _mint(msg.sender, 1000000 * 10**18);
    }

    // Create a new experiment
    function createExperiment(
        string memory _title,
        string memory _description,
        string memory _ipfsHash
    ) external nonReentrant returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        uint256 experimentId = experimentCount++;
        experiments[experimentId] = Experiment({
            title: _title,
            description: _description,
            creator: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            dataPoints: 0,
            ipfsHash: _ipfsHash
        });

        emit ExperimentCreated(experimentId, _title, msg.sender);
        return experimentId;
    }

    // Add a data point to an experiment
    function addDataPoint(
        uint256 _experimentId,
        string memory _data,
        string memory _ipfsHash
    ) external nonReentrant returns (uint256) {
        require(_experimentId < experimentCount, "Experiment does not exist");
        require(experiments[_experimentId].isActive, "Experiment is not active");
        require(bytes(_data).length > 0, "Data cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        uint256 dataPointId = experiments[_experimentId].dataPoints++;
        experimentData[_experimentId][dataPointId] = DataPoint({
            data: _data,
            contributor: msg.sender,
            timestamp: block.timestamp,
            ipfsHash: _ipfsHash,
            verified: false
        });

        emit DataPointAdded(_experimentId, dataPointId, msg.sender);
        return dataPointId;
    }

    // Verify a data point
    function verifyDataPoint(uint256 _experimentId, uint256 _dataPointId) external nonReentrant {
        require(_experimentId < experimentCount, "Experiment does not exist");
        require(_dataPointId < experiments[_experimentId].dataPoints, "Data point does not exist");
        require(!experimentData[_experimentId][_dataPointId].verified, "Data point already verified");
        require(
            msg.sender == experiments[_experimentId].creator || msg.sender == owner(),
            "Not authorized to verify"
        );

        experimentData[_experimentId][_dataPointId].verified = true;
        address contributor = experimentData[_experimentId][_dataPointId].contributor;
        contributorPoints[contributor] += 1;

        // Reward contributor with tokens
        _mint(contributor, MINIMUM_CONTRIBUTION);
        emit TokensRewarded(contributor, MINIMUM_CONTRIBUTION);
        emit DataPointVerified(_experimentId, _dataPointId, msg.sender);
    }

    // Get experiment details
    function getExperiment(uint256 _experimentId) external view returns (
        string memory title,
        string memory description,
        address creator,
        uint256 timestamp,
        bool isActive,
        uint256 dataPoints,
        string memory ipfsHash
    ) {
        require(_experimentId < experimentCount, "Experiment does not exist");
        Experiment memory exp = experiments[_experimentId];
        return (
            exp.title,
            exp.description,
            exp.creator,
            exp.timestamp,
            exp.isActive,
            exp.dataPoints,
            exp.ipfsHash
        );
    }

    // Get data point details
    function getDataPoint(uint256 _experimentId, uint256 _dataPointId) external view returns (
        string memory data,
        address contributor,
        uint256 timestamp,
        string memory ipfsHash,
        bool verified
    ) {
        require(_experimentId < experimentCount, "Experiment does not exist");
        require(_dataPointId < experiments[_experimentId].dataPoints, "Data point does not exist");
        DataPoint memory dp = experimentData[_experimentId][_dataPointId];
        return (
            dp.data,
            dp.contributor,
            dp.timestamp,
            dp.ipfsHash,
            dp.verified
        );
    }

    // Get contributor points
    function getContributorPoints(address _contributor) external view returns (uint256) {
        return contributorPoints[_contributor];
    }
} 