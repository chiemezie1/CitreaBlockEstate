# 🏗️ CitreaBlockEstate Backend

## 🌟 Overview

Welcome to the backbone of CitreaBlockEstate - our robust and innovative backend powered by Solidity smart contracts. This backend is the engine that drives our decentralized real estate tokenization platform, leveraging the power of blockchain technology to revolutionize property transactions.

## 🚀 Features

- 🏠 **Property Tokenization**: ERC721 standard for unique real estate NFTs
- 💰 **Buy & Sell**: Seamless property transactions on the blockchain
- 🔑 **Rent**: Automated rental agreements and payments
- ✅ **Verification System**: Ensure property authenticity
- 👥 **Role-Based Access**: Admin, Verifier, and User roles
- ⭐ **Reviews & Ratings**: Community-driven property insights
- 💼 **Commission Management**: Fair and transparent fee structure

## 🛠️ Tech Stack

- **Smart Contract**: Solidity v0.8.22
- **Development Framework**: Hardhat
- **Testing**: Chai & Mocha
- **Blockchain**: Citrea (Bitcoin L2 solution)
- **Libraries**: OpenZeppelin for secure contract development

## 📋 Prerequisites

Before diving in, make sure you have:

- Node.js (v18.x or later)
- npm (v7.x or later)
- Git
- MetaMask or compatible Web3 wallet

## 🔧 Installation & Setup

1. **Clone the Repository**
  1. Clone the repository:
    
    ```bash
    git clone https://github.com/chiemezie1/CitreaBlockEstate.git

    cd CitreaBlockEstate/RealEstateContract
    ```
    
2. Install dependencies:
    
    ```bash
    npm install
    ```



### Compiling the Contract

To compile the contract, run:

```bash
npx hardhat compile
```

### 🧪 Testing

To run the tests, use the following command:

```bash
npx hardhat test
```

## 🚀 Deployment

1. Set up your environment variables:
Create a `.env` file in the root directory with your private key:
    
    ```bash
    PRIVATE_KEY=your_private_key
    ```
    
2. Update the `parameters.json` file with your desired `defaultAdmin` address:
    
    ```json
    {
      "RealEstateTokenModule": {
        "defaultAdmin": "0x1234567890123456789012345678901234567890"
      }
    }
    ```
    
3. Update the `hardhat.config.js` file with your desired network configuration.
    
    ```jsx
    require("@nomicfoundation/hardhat-toolbox");
    require("dotenv").config();
    
    module.exports = {
      solidity: "0.8.19",
      networks: {
        citrea: {
          url: "https://rpc.testnet.citrea.xyz",
          chainId: 5115,
          accounts: [process.env.PRIVATE_KEY],
        },
      },
    };
    ```
    
4. Deploy the contract:
    
    ```bash
    npx hardhat ignition deploy ./ignition/modules/RealEstateToken.js --network citrea --parameters ./ignition/parameters.json
    ```
    
    Replace `<your-network>` with the network you want to deploy to (For this, it Citrea).
    

---

🎉 Congratulations! Your CitreaBlockEstate backend is now live on the Citrea network!

Here the deployed Address for this project
  ```bash
  0x73f95462886618C973FB19DCAeeFeA65C6c4ecdC
  ```

## 📊 Contract Structure

Our `RealEstateToken` contract is a masterpiece of Solidity engineering:

- **Inheritance**:

- ERC721
- ERC721Enumerable
- AccessControl


- **Key Components**:

- 🏠 `Property` struct: Holds all property details
- 📝 `Review` struct: Stores user reviews and ratings
- 🔢 Counters: For token and review IDs
- 💼 Commission system: Adjustable rates for platform sustainability


- **Core Functions**:

- `mintProperty`: Create new property tokens
- `buyProperty`: Handle property purchases
- `rentProperty`: Manage rental agreements
- `addReview`: Allow user feedback
- `verifyProperty`: Admin property authentication


## 🔐 Security Measures

We take security seriously. Here's how we keep CitreaBlockEstate safe:

- 🛡️ **Access Control**: Rigorous role-based permissions
- ⏸️ **Pausability**: Emergency stop functionality
- 🧪 **Input Validation**: Strict checking of all function inputs
- 💰 **Safe Transfers**: Secure handling of all financial transactions

---

## 🌉 Citrea Integration

### About Citrea

**Citrea** is the first scaling solution that enables more complex applications on Bitcoin without compromising its security or changing its consensus rules. It uses zero-knowledge proofs to scale Bitcoin in its entirety, ensuring on-chain verifiability and data availability within the Bitcoin network.

For more information on deploying to Citrea, check out the [Citrea Developer Documentation](https://docs.citrea.xyz/developer-documentation/developer-documentation).

### Why Consider Citrea?

1. **Bitcoin's Security:** Citrea allows us to tap into Bitcoin's unparalleled security, decentralization, and censorship resistance.
2. **Scalability:** It addresses the growing demand for Bitcoin blockspace without creating separate, less secure sidechains.
3. **Complex Applications:** Citrea enables more sophisticated use cases on Bitcoin, which could enhance our real estate tokenization platform.

### Potential Benefits for RealEstateToken

- **Enhanced Security:** Leveraging Bitcoin's robust security model for high-value real estate transactions.
- **Increased Scalability:** Handling a larger volume of property transactions and interactions.
- **Broader Adoption:** Tapping into the growing ecosystem of Bitcoin-based applications and users.



## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## 📚 Resources

- [Citrea Documentation](https://docs.citrea.xyz/)
- [Hardhat Guides](https://hardhat.org/hardhat-runner/docs/getting-started)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [MetaMask](https://metamask.io/)


## 📞 Support

Stuck? Have questions? Reach out to our dev team:

- 📧 Email: [chiemezieagbo1@gmail.com](chiemezieagbo1@gmail.com)
- 💬 Discord: [Join our server](https://discord.gg/citreablockestate)

## 📜 License

This project is licensed under the MIT License

---

Built with 💖 by the CitreaBlockEstate Team