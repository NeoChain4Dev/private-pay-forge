import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/constants';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_deliverables",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_deadline",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_price",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "createGig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gigId",
        "type": "uint256"
      }
    ],
    "name": "acceptGig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gigId",
        "type": "uint256"
      }
    ],
    "name": "getGigInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deliverables",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "price",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "escrowAmount",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "completionStatus",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isDisputed",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "client",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "freelancer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useContract() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const createGig = async (
    title: string,
    description: string,
    deliverables: string,
    deadline: number,
    price: string, // This would be encrypted price
    inputProof: string
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'createGig',
        args: [title, description, deliverables, deadline, price, inputProof],
      });
    } catch (err) {
      console.error('Error creating gig:', err);
    }
  };

  const acceptGig = async (gigId: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'acceptGig',
        args: [gigId],
      });
    } catch (err) {
      console.error('Error accepting gig:', err);
    }
  };

  const getGigInfo = (gigId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getGigInfo',
      args: [gigId],
    });
  };

  return {
    createGig,
    acceptGig,
    getGigInfo,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}
