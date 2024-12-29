# RealEstateToken

**RealEstateToken** is a decentralized application (DApp) that tokenizes real estate properties using blockchain technology. By leveraging the ERC721 standard for Non-Fungible Tokens (NFTs), this platform allows users to mint, buy, sell, and rent properties as unique digital assets. The project is built on the Ethereum blockchain using Solidity and utilizes Hardhat for development, testing, and deployment.

---
## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Compiling the Contract](#compiling-the-contract)
  - [Testing](#testing)
  - [Deployment](#deployment)
- [Contract Structure](#contract-structure)
- [Security Considerations](#security-considerations)
- [Citrea Integration](#citrea-integration)
- [Contributing](#contributing)
- [License](#license)
---

## Overview

The **RealEstateToken** project implements a smart contract that facilitates real estate tokenization. Built on the **Citrea blockchain** (an Ethereum-compatible rollup on Bitcoin), the platform allows property owners to create unique tokenized assets representing real estate properties. Users can mint property tokens, list them for sale or rent, and interact with the properties through buying, renting, and reviewing.

This project uses **Hardhat** as the development environment for testing, deployment, and script execution.

---

## Features

- Minting new property tokens
- Property listings for sale or rent
- Buying and selling properties as NFTs
- Renting properties for specific durations
- Adding reviews and ratings to properties
- Liking/unliking properties
- Admin verification of properties
- Pausable contract functionality
- Customizable commission rates

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.x or later)
- **npm** (usually comes with Node.js)
- **Git**

---

## Installation

1. Clone the repository:
    
    ```bash
    git clone https://github.com/chiemezie1/RealEstateHub.git
    cd RealEstateHub/RealEstateToken
    ```
    
2. Install dependencies:
    
    ```bash
    npm install
    ```
    

---

## Usage

### Compiling the Contract

To compile the contract, run:

```bash
npx hardhat compile
```

### Testing

To run the tests, use the following command:

```bash
npx hardhat test
```

### Deployment

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

## Contract Structure

The **RealEstateToken** contract is structured as follows:

- **Inheritance:** ERC721, ERC721Enumerable, ERC721Pausable, AccessControl
- **State Variables:** Includes token and review ID counters, commission rate, and mappings for properties, reviews, and user balances.
- **Structs:** Defines `Property`, `Review`, and `MintRequest` structs.
- **Events:** Emits events for various actions like property minting, buying, renting, and reviewing.
- **Access Control:** Uses OpenZeppelin's `AccessControl` for role-based access control.
- **Functions:** Implements functions for minting, listing, buying, renting properties, adding reviews, and managing the contract.

---

## Security Considerations

- **Access Control:** Utilizes OpenZeppelin's `AccessControl` for role-based access control.
- **Pausability:** Uses OpenZeppelin's `Pausable` to allow pausing the contract in case of emergencies.
- **Input Validation:** Includes multiple `require` statements to validate inputs and contract state.
- **Commission Handling:** Implements a commission system with adjustable rates.

Ensure to perform thorough security audits before deploying to the mainnet.

---

## Citrea Integration

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

We are currently evaluating the feasibility and potential benefits of integrating Citrea into our **RealEstateToken** platform. Stay tuned for updates on this exciting possibility!

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## References

- [Citrea Developer Documentation](https://docs.citrea.xyz/developer-documentation/developer-documentation)
- [Citrea Faucet Guide](https://docs.citrea.xyz/user-guide/how-to-use-faucet)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Node.js](https://nodejs.org/en)
- [MetaMask](https://metamask.io/)
