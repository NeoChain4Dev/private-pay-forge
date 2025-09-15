// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract PrivatePayForge is SepoliaConfig {
    using FHE for *;
    
    struct Gig {
        euint32 gigId;
        euint32 price;
        euint32 escrowAmount;
        euint32 completionStatus;
        bool isActive;
        bool isCompleted;
        bool isDisputed;
        string title;
        string description;
        string deliverables;
        address client;
        address freelancer;
        uint256 createdAt;
        uint256 deadline;
    }
    
    struct Payment {
        euint32 paymentId;
        euint32 amount;
        euint32 gigId;
        address from;
        address to;
        uint256 timestamp;
        bool isProcessed;
    }
    
    struct Dispute {
        euint32 disputeId;
        euint32 gigId;
        euint32 requestedAmount;
        bool isResolved;
        string reason;
        address initiator;
        address arbitrator;
        uint256 createdAt;
    }
    
    struct UserProfile {
        euint32 reputation;
        euint32 totalEarnings;
        euint32 completedGigs;
        bool isVerified;
        string skills;
        address userAddress;
    }
    
    mapping(uint256 => Gig) public gigs;
    mapping(uint256 => Payment) public payments;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => euint32) public userBalances;
    
    uint256 public gigCounter;
    uint256 public paymentCounter;
    uint256 public disputeCounter;
    
    address public owner;
    address public arbitrator;
    uint256 public platformFee; // In basis points (e.g., 250 = 2.5%)
    
    event GigCreated(uint256 indexed gigId, address indexed client, string title);
    event GigAccepted(uint256 indexed gigId, address indexed freelancer);
    event PaymentProcessed(uint256 indexed paymentId, uint256 indexed gigId, address indexed to, uint32 amount);
    event DisputeCreated(uint256 indexed disputeId, uint256 indexed gigId, address indexed initiator);
    event DisputeResolved(uint256 indexed disputeId, bool inFavorOfClient);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event FundsEscrowed(uint256 indexed gigId, uint32 amount);
    event FundsReleased(uint256 indexed gigId, uint32 amount);
    
    constructor(address _arbitrator) {
        owner = msg.sender;
        arbitrator = _arbitrator;
        platformFee = 250; // 2.5% platform fee
    }
    
    function createGig(
        string memory _title,
        string memory _description,
        string memory _deliverables,
        uint256 _deadline,
        externalEuint32 _price,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        uint256 gigId = gigCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalPrice = FHE.fromExternal(_price, inputProof);
        
        gigs[gigId] = Gig({
            gigId: FHE.asEuint32(0), // Will be set properly later
            price: internalPrice,
            escrowAmount: FHE.asEuint32(0),
            completionStatus: FHE.asEuint32(0),
            isActive: true,
            isCompleted: false,
            isDisputed: false,
            title: _title,
            description: _description,
            deliverables: _deliverables,
            client: msg.sender,
            freelancer: address(0),
            createdAt: block.timestamp,
            deadline: _deadline
        });
        
        emit GigCreated(gigId, msg.sender, _title);
        return gigId;
    }
    
    function acceptGig(uint256 gigId) public {
        require(gigs[gigId].client != address(0), "Gig does not exist");
        require(gigs[gigId].isActive, "Gig is not active");
        require(gigs[gigId].freelancer == address(0), "Gig already accepted");
        require(gigs[gigId].client != msg.sender, "Cannot accept your own gig");
        
        gigs[gigId].freelancer = msg.sender;
        emit GigAccepted(gigId, msg.sender);
    }
    
    function escrowFunds(
        uint256 gigId,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public payable {
        require(gigs[gigId].client == msg.sender, "Only client can escrow funds");
        require(gigs[gigId].freelancer != address(0), "Gig must be accepted first");
        require(gigs[gigId].isActive, "Gig is not active");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        // Update escrow amount
        gigs[gigId].escrowAmount = FHE.add(gigs[gigId].escrowAmount, internalAmount);
        
        emit FundsEscrowed(gigId, 0); // Amount will be decrypted off-chain
    }
    
    function submitWork(
        uint256 gigId,
        externalEuint32 completionPercentage,
        bytes calldata inputProof
    ) public {
        require(gigs[gigId].freelancer == msg.sender, "Only freelancer can submit work");
        require(gigs[gigId].isActive, "Gig is not active");
        require(!gigs[gigId].isCompleted, "Gig already completed");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalCompletion = FHE.fromExternal(completionPercentage, inputProof);
        
        // Update completion status
        gigs[gigId].completionStatus = internalCompletion;
        
        // Check if work is 100% complete
        ebool isFullyComplete = FHE.eq(internalCompletion, FHE.asEuint32(100));
        
        if (FHE.decrypt(isFullyComplete)) {
            gigs[gigId].isCompleted = true;
            gigs[gigId].isActive = false;
        }
    }
    
    function releasePayment(
        uint256 gigId,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public {
        require(gigs[gigId].client == msg.sender, "Only client can release payment");
        require(gigs[gigId].freelancer != address(0), "Gig must be accepted");
        require(!gigs[gigId].isDisputed, "Cannot release payment during dispute");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        // Verify escrow has sufficient funds
        ebool hasSufficientFunds = FHE.gte(gigs[gigId].escrowAmount, internalAmount);
        require(FHE.decrypt(hasSufficientFunds), "Insufficient escrow funds");
        
        // Process payment
        uint256 paymentId = paymentCounter++;
        
        payments[paymentId] = Payment({
            paymentId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            gigId: FHE.asEuint32(gigId),
            from: msg.sender,
            to: gigs[gigId].freelancer,
            timestamp: block.timestamp,
            isProcessed: true
        });
        
        // Update escrow amount
        gigs[gigId].escrowAmount = FHE.sub(gigs[gigId].escrowAmount, internalAmount);
        
        // Update user balances
        userBalances[gigs[gigId].freelancer] = FHE.add(
            userBalances[gigs[gigId].freelancer], 
            internalAmount
        );
        
        emit PaymentProcessed(paymentId, gigId, gigs[gigId].freelancer, 0); // Amount will be decrypted off-chain
        emit FundsReleased(gigId, 0); // Amount will be decrypted off-chain
    }
    
    function createDispute(
        uint256 gigId,
        string memory _reason,
        externalEuint32 requestedAmount,
        bytes calldata inputProof
    ) public {
        require(
            gigs[gigId].client == msg.sender || gigs[gigId].freelancer == msg.sender,
            "Only client or freelancer can create dispute"
        );
        require(gigs[gigId].isActive, "Gig must be active");
        require(!gigs[gigId].isDisputed, "Dispute already exists");
        
        uint256 disputeId = disputeCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(requestedAmount, inputProof);
        
        disputes[disputeId] = Dispute({
            disputeId: FHE.asEuint32(0), // Will be set properly later
            gigId: FHE.asEuint32(gigId),
            requestedAmount: internalAmount,
            isResolved: false,
            reason: _reason,
            initiator: msg.sender,
            arbitrator: arbitrator,
            createdAt: block.timestamp
        });
        
        gigs[gigId].isDisputed = true;
        
        emit DisputeCreated(disputeId, gigId, msg.sender);
    }
    
    function resolveDispute(
        uint256 disputeId,
        bool inFavorOfClient,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public {
        require(msg.sender == arbitrator, "Only arbitrator can resolve disputes");
        require(!disputes[disputeId].isResolved, "Dispute already resolved");
        
        uint256 gigId = uint256(FHE.decrypt(disputes[disputeId].gigId));
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        address recipient = inFavorOfClient ? gigs[gigId].client : gigs[gigId].freelancer;
        
        // Process payment
        uint256 paymentId = paymentCounter++;
        
        payments[paymentId] = Payment({
            paymentId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            gigId: FHE.asEuint32(gigId),
            from: address(this),
            to: recipient,
            timestamp: block.timestamp,
            isProcessed: true
        });
        
        // Update escrow amount
        gigs[gigId].escrowAmount = FHE.sub(gigs[gigId].escrowAmount, internalAmount);
        
        // Update user balances
        userBalances[recipient] = FHE.add(userBalances[recipient], internalAmount);
        
        disputes[disputeId].isResolved = true;
        gigs[gigId].isDisputed = false;
        gigs[gigId].isActive = false;
        gigs[gigId].isCompleted = true;
        
        emit DisputeResolved(disputeId, inFavorOfClient);
        emit PaymentProcessed(paymentId, gigId, recipient, 0); // Amount will be decrypted off-chain
    }
    
    function updateUserProfile(
        string memory _skills,
        bool _isVerified
    ) public {
        userProfiles[msg.sender] = UserProfile({
            reputation: userProfiles[msg.sender].reputation,
            totalEarnings: userProfiles[msg.sender].totalEarnings,
            completedGigs: userProfiles[msg.sender].completedGigs,
            isVerified: _isVerified,
            skills: _skills,
            userAddress: msg.sender
        });
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == arbitrator, "Only arbitrator can update reputation");
        require(user != address(0), "Invalid user address");
        
        userProfiles[user].reputation = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function withdrawFunds(externalEuint32 amount, bytes calldata inputProof) public {
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        // Verify user has sufficient balance
        ebool hasSufficientBalance = FHE.gte(userBalances[msg.sender], internalAmount);
        require(FHE.decrypt(hasSufficientBalance), "Insufficient balance");
        
        // Update user balance
        userBalances[msg.sender] = FHE.sub(userBalances[msg.sender], internalAmount);
        
        // Transfer funds (in a real implementation, this would transfer actual tokens)
        // payable(msg.sender).transfer(amount);
    }
    
    // View functions (returning encrypted data that needs to be decrypted off-chain)
    function getGigInfo(uint256 gigId) public view returns (
        string memory title,
        string memory description,
        string memory deliverables,
        uint8 price,
        uint8 escrowAmount,
        uint8 completionStatus,
        bool isActive,
        bool isCompleted,
        bool isDisputed,
        address client,
        address freelancer,
        uint256 createdAt,
        uint256 deadline
    ) {
        Gig storage gig = gigs[gigId];
        return (
            gig.title,
            gig.description,
            gig.deliverables,
            0, // FHE.decrypt(gig.price) - will be decrypted off-chain
            0, // FHE.decrypt(gig.escrowAmount) - will be decrypted off-chain
            0, // FHE.decrypt(gig.completionStatus) - will be decrypted off-chain
            gig.isActive,
            gig.isCompleted,
            gig.isDisputed,
            gig.client,
            gig.freelancer,
            gig.createdAt,
            gig.deadline
        );
    }
    
    function getPaymentInfo(uint256 paymentId) public view returns (
        uint8 amount,
        uint8 gigId,
        address from,
        address to,
        uint256 timestamp,
        bool isProcessed
    ) {
        Payment storage payment = payments[paymentId];
        return (
            0, // FHE.decrypt(payment.amount) - will be decrypted off-chain
            0, // FHE.decrypt(payment.gigId) - will be decrypted off-chain
            payment.from,
            payment.to,
            payment.timestamp,
            payment.isProcessed
        );
    }
    
    function getUserBalance(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userBalances[user]) - will be decrypted off-chain
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userProfiles[user].reputation) - will be decrypted off-chain
    }
    
    function getDisputeInfo(uint256 disputeId) public view returns (
        uint8 gigId,
        uint8 requestedAmount,
        bool isResolved,
        string memory reason,
        address initiator,
        address arbitrator,
        uint256 createdAt
    ) {
        Dispute storage dispute = disputes[disputeId];
        return (
            0, // FHE.decrypt(dispute.gigId) - will be decrypted off-chain
            0, // FHE.decrypt(dispute.requestedAmount) - will be decrypted off-chain
            dispute.isResolved,
            dispute.reason,
            dispute.initiator,
            dispute.arbitrator,
            dispute.createdAt
        );
    }
}
