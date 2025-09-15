# Private Pay Forge

A decentralized freelance platform built with **Fully Homomorphic Encryption (FHE)** technology, ensuring complete privacy for all financial transactions and sensitive data.

## 🔐 Privacy-First Features

- **FHE-Encrypted Payments**: All financial data is encrypted using Zama's FHE technology
- **Private Budget Protection**: Client budgets remain completely private from freelancers
- **Secure Escrow System**: Funds are held in encrypted escrow until project completion
- **Dispute Resolution**: Decentralized arbitration system for fair conflict resolution
- **Reputation System**: Encrypted reputation tracking for all users

## 🚀 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Blockchain**: Ethereum Sepolia Testnet
- **Wallet Integration**: RainbowKit + Wagmi
- **Smart Contracts**: Solidity with FHE (Zama Network)
- **Encryption**: Fully Homomorphic Encryption for privacy

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/NeoChain4Dev/private-pay-forge.git

# Navigate to project directory
cd private-pay-forge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475

# Infura Configuration
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

## 📱 Features

### For Clients
- Create encrypted gig postings with private budgets
- Secure escrow system for payment protection
- Dispute resolution mechanism
- Freelancer reputation verification

### For Freelancers
- Browse available gigs (without seeing budgets)
- Submit work with encrypted completion status
- Secure payment processing
- Build encrypted reputation profile

### Smart Contract Features
- FHE-encrypted price storage
- Secure escrow management
- Automated payment processing
- Dispute resolution system
- Reputation tracking

## 🔧 Smart Contract

The platform uses a custom Solidity smart contract with FHE integration:

- **Contract**: `PrivatePayForge.sol`
- **Network**: Ethereum Sepolia Testnet
- **FHE Library**: Zama Network FHE Solidity
- **Features**: Encrypted payments, escrow, disputes, reputation

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - Add all environment variables from `.env.local`
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Access your live application

### Manual Deployment Steps

```bash
# Build the project
npm run build

# Deploy to your preferred hosting service
# The built files will be in the 'dist' directory
```

## 🔒 Security Features

- **FHE Encryption**: All sensitive data encrypted using Fully Homomorphic Encryption
- **Private Budgets**: Client budgets never exposed to freelancers
- **Secure Escrow**: Funds held in encrypted smart contract escrow
- **Dispute Resolution**: Decentralized arbitration system
- **Reputation Privacy**: User reputation encrypted and private

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Deployed on Vercel]
- **Smart Contract**: [Ethereum Sepolia]
- **Documentation**: [Project Wiki]

## ⚠️ Disclaimer

This is a demonstration project using testnet. Do not use real funds or sensitive data in production without proper security audits.
