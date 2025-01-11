'use client'

import { createPublicClient, createWalletClient, custom, http, Abi, parseEther, keccak256 } from 'viem';
import { citrea } from './citreaChain';
import RealEstateTokenABI from '@/contracts/RealEstateToken.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error('Contract address is not defined in environment variables');
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
      throw new Error('MetaMask is not installed');
    }
  }
  return walletClient;
}

export async function getCurrentAccount() {
  const client = await getWalletClient();
  const [account] = await client.getAddresses();
  return account;
}

export async function assignRole(role: string, account: `0x${string}`) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();

  const roleInByte = keccak256(Buffer.from(role)).substring(0, 66);

  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'assignRole',
    args: [roleInByte, account],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function revokeRole(role: string, account: `0x${string}`) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();

  const roleInByte = keccak256(Buffer.from(role)).substring(0, 66);

  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'revokeRole',
    args: [roleInByte, account],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function mintProperty(name: string, location: string, description: string, imageUrl: string) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'mintProperty',
    args: [name, location, description, imageUrl],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function verifyProperty(tokenId: bigint, verified: boolean) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'verifyProperty',
    args: [tokenId, verified],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function updatePropertyStatus(tokenId: bigint, status: bigint, price: bigint, rentalEndDate: bigint) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'updatePropertyStatus',
    args: [tokenId, status, price, rentalEndDate],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function buyProperty(tokenId: bigint, value: bigint) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'buyProperty',
    args: [tokenId],
    account: currentAccount,
    value,
  });
  return walletClient.writeContract(request);
}

export async function rentProperty(tokenId: bigint, value: bigint) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'rentProperty',
    args: [tokenId],
    account: currentAccount,
    value,
  });
  return walletClient.writeContract(request);
}

export async function updatePropertyDetails(
  tokenId: bigint,
  name: string,
  description: string,
  imageUrl: string,
  location: string
) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const args = [tokenId, name, description, imageUrl, location];
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'updatePropertyDetails',
    args: args,
    account: currentAccount,
  });

  return walletClient.writeContract(request);
}


export async function endRental(tokenId: bigint) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'endRental',
    args: [tokenId],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function safeTransfer(to: `0x${string}`, tokenId: bigint) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'safeTransferFrom',
    args: [currentAccount, to, tokenId],
    account: currentAccount,
  });
  
  return walletClient.writeContract(request);
}

export async function toggleLike(tokenId: bigint) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'toggleLike',
    args: [tokenId],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function withdraw() {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'withdraw',
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function setCommissionRate(newRate: bigint) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'setCommissionRate',
    args: [newRate],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function addReview(tokenId: bigint, content: string, rating: number) {
  const walletClient = await getWalletClient();
  const currentAccount = await getCurrentAccount();
  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'addReview',
    args: [tokenId, content, rating],
    account: currentAccount,
  });
  return walletClient.writeContract(request);
}

export async function getAllProperties(offset: bigint, limit: bigint) {
  return publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getAllProperties',
    args: [offset, limit],
  });
}

export async function getPropertyInfo(tokenId: bigint) {
  const respones = publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getPropertyInfo',
    args: [tokenId],
  });
  return respones
}

export async function getPropertyReviewIds(tokenId: bigint) {
  return publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getPropertyReviewIds',
    args: [tokenId],
  });
}

export async function getReviewDetails(reviewId: bigint) {
  const reviewDetail = publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getReviewDetails',
    args: [reviewId],
  });
  console.log(reviewDetail)
  return reviewDetail
}

export async function getPropertiesForAddress() {
  const currentAccount = await getCurrentAccount();
  return publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getPropertiesForAddress',
    args: [currentAccount],
  });
}

export async function getCommissionRate() {
  return publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'commissionRate',
  });
}

export async function getUserBalance() {
  try {
    const currentAccount = await getCurrentAccount();
    const balance = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'userBalance',
      args: [currentAccount],
    });
    return balance;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    throw new Error('Failed to fetch user balance');
  }
}

export async function hasRole() {
  try {
    const currentAccount = await getCurrentAccount();
    const adminRole = keccak256(Buffer.from('ADMIN_ROLE')).substring(0, 66);
    const verifierRole = keccak256(Buffer.from('VERIFIER_ROLE')).substring(0, 66);

    const isAdmin = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'hasRole',
      args: [adminRole, currentAccount],
    });
    console.log('isAdmin:', isAdmin);

    const isVerifier = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'hasRole',
      args: [verifierRole, currentAccount],
    });

    if (isAdmin) {
      return 'ADMIN';
    } else if (isVerifier) {
      return 'VERIFIER';
    } else {
      return 'USER';
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    throw new Error('Failed to check user role');
  }
}
