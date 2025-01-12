'use client'

import { createPublicClient, createWalletClient, custom, http, Abi, parseEther, keccak256 } from 'viem';
import { citrea } from './citreaChain';
import RealEstateTokenABI from '@/contracts/RealEstateToken.json';
import MessageDisplay from '@/components/MessageDisplay';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!contractAddress) {
  console.error('Contract address is not defined in environment variables');
}

export const publicClient = createPublicClient({
  chain: citrea,
  transport: http(),
});

let walletClient: ReturnType<typeof createWalletClient> | null = null;

const abi = RealEstateTokenABI.abi as Abi;

export async function getWalletClient() {
  if (!walletClient) {
    if (typeof window !== 'undefined' && window.ethereum) {
      walletClient = createWalletClient({
        chain: citrea,
        transport: custom(window.ethereum),
      });
    } else {
      MessageDisplay({ message: 'MetaMask is not installed', type: 'error' });
      return null;
    }
  }
  return walletClient;
}

export async function getCurrentAccount() {
  const client = await getWalletClient();
  if (!client) return null;
  try {
    const [account] = await client.getAddresses();
    return account;
  } catch (error) {
    console.error('Error getting current account:', error);
    MessageDisplay({ message: 'Failed to get current account', type: 'error' });
    return null;
  }
}

async function checkConnection() {
  const account = await getCurrentAccount();
  if (!account) {
    MessageDisplay({ message: 'Please connect your wallet', type: 'error' });
    return false;
  }
  return true;
}

async function executeWithConnectionCheck(operation: () => Promise<void>) {
  if (await checkConnection()) {
    await operation();
  }
}

export async function assignRole(role: string, account: `0x${string}`) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const roleInByte = keccak256(Buffer.from(role)).substring(0, 66);
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'assignRole',
        args: [roleInByte, account],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Role assigned successfully', type: 'success' });
    } catch (error) {
      console.error('Error assigning role:', error);
      MessageDisplay({ message: 'Failed to assign role. Please try again.', type: 'error' });
    }
  });
}

export async function revokeRole(role: string, account: `0x${string}`) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const roleInByte = keccak256(Buffer.from(role)).substring(0, 66);
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'revokeRole',
        args: [roleInByte, account],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Role revoked successfully', type: 'success' });
    } catch (error) {
      console.error('Error revoking role:', error);
      MessageDisplay({ message: 'Failed to revoke role. Please try again.', type: 'error' });
    }
  });
}

export async function mintProperty(name: string, location: string, description: string, imageUrl: string) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'mintProperty',
        args: [name, location, description, imageUrl],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Property minted successfully', type: 'success' });
    } catch (error) {
      console.error('Error minting property:', error);
      MessageDisplay({ message: 'Failed to mint property. Please try again.', type: 'error' });
    }
  });
}

export async function verifyProperty(tokenId: bigint, verified: boolean) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'verifyProperty',
        args: [tokenId, verified],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Property verification status updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error verifying property:', error);
      MessageDisplay({ message: 'Failed to update property verification status. Please try again.', type: 'error' });
    }
  });
}

export async function updatePropertyStatus(tokenId: bigint, status: bigint, price: bigint, rentalEndDate: bigint) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'updatePropertyStatus',
        args: [tokenId, status, price, rentalEndDate],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Property status updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating property status:', error);
      MessageDisplay({ message: 'Failed to update property status. Please try again.', type: 'error' });
    }
  });
}

export async function buyProperty(tokenId: bigint, value: bigint) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'buyProperty',
        args: [tokenId],
        account: currentAccount,
        value,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Property purchased successfully', type: 'success' });
    } catch (error) {
      console.error('Error buying property:', error);
      MessageDisplay({ message: 'Failed to buy property. Please try again.', type: 'error' });
    }
  });
}

export async function rentProperty(tokenId: bigint, value: bigint) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'rentProperty',
        args: [tokenId],
        account: currentAccount,
        value,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Property rented successfully', type: 'success' });
    } catch (error) {
      console.error('Error renting property:', error);
      MessageDisplay({ message: 'Failed to rent property. Please try again.', type: 'error' });
    }
  });
}

export async function updatePropertyDetails(
  tokenId: bigint,
  name: string,
  description: string,
  imageUrl: string,
  location: string
) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const args = [tokenId, name, description, imageUrl, location];
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'updatePropertyDetails',
        args: args,
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Property details updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating property details:', error);
      MessageDisplay({ message: 'Failed to update property details. Please try again.', type: 'error' });
    }
  });
}

export async function endRental(tokenId: bigint) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'endRental',
        args: [tokenId],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Rental ended successfully', type: 'success' });
    } catch (error) {
      console.error('Error ending rental:', error);
      MessageDisplay({ message: 'Failed to end rental. Please try again.', type: 'error' });
    }
  });
}

export async function safeTransfer(to: `0x${string}`, tokenId: bigint) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'safeTransferFrom',
        args: [currentAccount, to, tokenId],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Property transferred successfully', type: 'success' });
    } catch (error) {
      console.error('Error transferring property:', error);
      MessageDisplay({ message: 'Failed to transfer property. Please try again.', type: 'error' });
    }
  });
}

export async function toggleLike(tokenId: bigint) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'toggleLike',
        args: [tokenId],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Property like status toggled successfully', type: 'success' });
    } catch (error) {
      console.error('Error toggling like:', error);
      MessageDisplay({ message: 'Failed to toggle like status. Please try again.', type: 'error' });
    }
  });
}

export async function withdraw() {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'withdraw',
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Funds withdrawn successfully', type: 'success' });
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      MessageDisplay({ message: 'Failed to withdraw funds. Please try again.', type: 'error' });
    }
  });
}

export async function setCommissionRate(newRate: bigint) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'setCommissionRate',
        args: [newRate],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Commission rate updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error setting commission rate:', error);
      MessageDisplay({ message: 'Failed to set commission rate. Please try again.', type: 'error' });
    }
  });
}

export async function addReview(tokenId: bigint, content: string, rating: number) {
  await executeWithConnectionCheck(async () => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return;
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) return;
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'addReview',
        args: [tokenId, content, rating],
        account: currentAccount,
      });
      await walletClient.writeContract(request);
      MessageDisplay({ message: 'Review added successfully', type: 'success' });
    } catch (error) {
      console.error('Error adding review:', error);
      MessageDisplay({ message: 'Failed to add review. Please try again.', type: 'error' });
    }
  });
}

// Read-only functions
export async function getAllProperties(offset: bigint, limit: bigint) {
  try {
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'getAllProperties',
      args: [offset, limit],
    });
    return result;
  } catch (error) {
    console.error('Error getting all properties:', error);
    MessageDisplay({ message: 'Failed to get properties. Please try again.', type: 'error' });
    return null;
  }
}

export async function getPropertyInfo(tokenId: bigint) {
  try {
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'getPropertyInfo',
      args: [tokenId],
    });
    return result;
  } catch (error) {
    console.error('Error getting property info:', error);
    MessageDisplay({ message: 'Failed to get property information. Please try again.', type: 'error' });
    return null;
  }
}

export async function getPropertyReviewIds(tokenId: bigint) {
  try {
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'getPropertyReviewIds',
      args: [tokenId],
    });
    return result;
  } catch (error) {
    console.error('Error getting property review IDs:', error);
    MessageDisplay({ message: 'Failed to get property review IDs. Please try again.', type: 'error' });
    return null;
  }
}

export async function getReviewDetails(reviewId: bigint) {
  try {
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'getReviewDetails',
      args: [reviewId],
    });
    return result;
  } catch (error) {
    console.error('Error getting review details:', error);
    MessageDisplay({ message: 'Failed to get review details. Please try again.', type: 'error' });
    return null;
  }
}

export async function getPropertiesForAddress() {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount) {
    MessageDisplay({ message: 'Please connect your wallet', type: 'error' });
    return null;
  }
  try {
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'getPropertiesForAddress',
      args: [currentAccount],
    });
    return result;
  } catch (error) {
    console.error('Error getting properties for address:', error);
    MessageDisplay({ message: 'Failed to get properties for address. Please try again.', type: 'error' });
    return null;
  }
}

export async function getCommissionRate() {
  try {
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'commissionRate',
    });
    return result;
  } catch (error) {
    console.error('Error getting commission rate:', error);
    MessageDisplay({ message: 'Failed to get commission rate. Please try again.', type: 'error' });
    return null;
  }
}

export async function getUserBalance() {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount) {
    MessageDisplay({ message: 'Please connect your wallet', type: 'error' });
    return null;
  }
  try {
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'userBalance',
      args: [currentAccount],
    });
    return result;
  } catch (error) {
    console.error('Error getting user balance:', error);
    MessageDisplay({ message: 'Failed to get user balance. Please try again.', type: 'error' });
    return null;
  }
}

export async function hasRole() {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount) {
    MessageDisplay({ message: 'Please connect your wallet', type: 'error' });
    return null;
  }
  const adminRole = keccak256(Buffer.from('ADMIN_ROLE')).substring(0, 66);
  const verifierRole = keccak256(Buffer.from('VERIFIER_ROLE')).substring(0, 66);

  try {
    const isAdmin = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'hasRole',
      args: [adminRole, currentAccount],
    });

    if (isAdmin) {
      return 'ADMIN';
    }

    const isVerifier = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'hasRole',
      args: [verifierRole, currentAccount],
    });

    if (isVerifier) {
      return 'VERIFIER';
    }

    return 'USER';
  } catch (error) {
    console.error('Error checking user role:', error);
    MessageDisplay({ message: 'Failed to check user role. Please try again.', type: 'error' });
    return null;
  }
}

