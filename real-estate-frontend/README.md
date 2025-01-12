# CitreaBlockEstate Frontend

## 🌟 Overview

Welcome to the frontend of CitreaBlockEstate, a cutting-edge decentralized application (DApp) for real estate tokenization. Our frontend provides an intuitive, responsive, and feature-rich user interface that seamlessly interacts with the Citrea blockchain. Built with Next.js and styled with Tailwind CSS, this frontend delivers a smooth user experience for property exploration, transactions, and management.

## 🚀 Key Features

- 🏠 Interactive Property Listings: Browse, filter, and search tokenized properties
- 💰 Seamless Transactions: Buy, sell, and rent properties with ease (Only verified properties are eligible for sale or rent)
- 👤 User Dashboard: Manage owned properties, transactions, and account settings
- 🔐 Web3 Integration: Connect with MetaMask and other popular wallets
- 🖼️ Rich Media Support: View high-quality images
- 📱 Responsive Design: Optimized for desktop, tablet, and mobile devices
- ✅ Property Verification: Properties must first be verified by an admin or verifier before they can be rented out or sold


## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: viem
- **UI Components**: Custom components and shadcn/ui
- **State Management**: React Hooks
- **Icons**: Built-in SVG icons
- **Form Handling**: Native form handling with custom hooks
- **API Integration**: Pinata for IPFS storage


## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.x or later)
- npm (v7.x or later) or Yarn (v1.22.x or later)
- Git


## 🔧 Installation & Setup

1. Clone the repository:

```shellscript
git clone https://github.com/chiemezie1/CitreaBlockEstate.git

cd CitreaBlockEstate/real-estate-frontend
```


2. Install dependencies:

```shellscript
npm install

```


3. Set up environment variables:
Create a `.env.local` file in the root of the frontend directory with the following:

```plaintext
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_CITREA_RPC_URL=https://rpc.testnet.citrea.xyz
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_API_SECRET=your_pinata_api_secret
```


4. Run the development server:

```shellscript
npm run dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## 📁 Project Structure

```plaintext
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js 13 App Router pages
│   ├── components/         # React components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── explore/        # Explore page components
│   │   ├── landing/        # Landing page components
│   │   ├── property/       # Property-related components
│   │   └── ui/             # Reusable UI components
│   ├── contracts/          # Smart contract ABIs
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── utils/              # Helper functions and types
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.ts          # Next.js configuration
```


## 🎨 Key Components

- **Header**: Main navigation component (`src/components/Header.tsx`)
- **Footer**: Site-wide footer component (`src/components/Footer.tsx`)
- **PropertyCard**: Displays property information (`src/components/property/PropertyCard.tsx`)
- **ExplorePropertyCard**: Card for the explore page (`src/components/explore/ExplorePropertyCard.tsx`)
- **Dashboard**: User-specific area for managing properties and transactions (`src/app/dashboard/page.tsx`)
- **AddProperty**: Form for adding new properties (`src/components/dashboard/AddProperty.tsx`)


## 🔗 Integration with Smart Contract

Our frontend seamlessly integrates with the CitreaBlockEstate smart contract using viem:

- **Contract Interactions**: Defined in `src/utils/contractInteractions.ts`
- **Citrea Chain Configuration**: Set up in `src/utils/citreaChain.ts`
- **Property Fetching**: Retrieves and displays all listed properties
- **Transaction Handling**: Facilitates buying, selling, and renting through the contract
- **User Management**: Interacts with role-based access control features
- **Review System**: Allows users to submit and view property reviews


## 🚀 Deployment

To deploy the frontend to Vercel:

1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import the project and configure environment variables
4. Deploy!


## 🔐 Security Considerations

- Implement proper input validation and sanitization
- Use environment variables for sensitive information
- Implement rate limiting to prevent abuse
- Regularly update dependencies to patch security vulnerabilities


## 🌈 Customization

- **Theming**: Customize colors in `tailwind.config.ts`
- **Layouts**: Modify or create new layouts in the `src/app/` directory
- **Components**: Extend or modify UI components in the `src/components/` directory


## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Make your changes and commit: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request


Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Viem Documentation](https://viem.sh/docs/installation)
- [Citrea Developer Docs](https://docs.citrea.xyz/)


## 🐛 Troubleshooting

- **Wallet Connection Issues**: Ensure you're connected to the Citrea testnet in MetaMask
- **Transaction Errors**: Check your wallet's CBTC balance and network gas fees
- **Loading Performance**: Implement proper loading states and optimize data fetching


## 📞 Support

If you encounter any issues or have questions, please reach out:

- 📧 Email: [chiemezieagbo1@gmail.com](chiemezieagbo1@gmail.com)
- 💬 Discord: [Join our server](https://discord.gg/citreablockestate)


## 📜 License

This project is licensed under the MIT License.