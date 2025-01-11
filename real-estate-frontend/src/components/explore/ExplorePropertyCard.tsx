'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/utils/types';
import Image from 'next/image';
import { Heart, Verified, MapPin, DollarSign, User, Calendar, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { toggleLike, getPropertyInfo, buyProperty, rentProperty, getCurrentAccount } from '@/utils/contractInteractions';
import { formatToCBTC } from '@/utils/formatHelpers';

interface PropertyCardProps {
  property: Property;
}

export default function ExplorePropertyCard({ property }: PropertyCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localProperty, setLocalProperty] = useState(property);

  useEffect(() => {
    const fetchCurrentAccount = async () => {
      const currentAccount = await getCurrentAccount();
      setOwnerAddress(currentAccount);
    };
    fetchCurrentAccount();
  }, []);

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike(BigInt(localProperty.id));
      const updatedProperty = await getPropertyInfo(BigInt(localProperty.id));
      if (Array.isArray(updatedProperty) && updatedProperty.length > 7) {
        setLocalProperty((prev) => ({ ...prev, likeCount: Number(updatedProperty[7]) }));
      }
      toast({
        title: 'Success',
        description: 'Property like status updated.',
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleBuyProperty = async () => {
    setIsLoading(true);
    try {
      await buyProperty(BigInt(localProperty.id), localProperty.price);
      toast({
        title: 'Success',
        description: 'Property purchased successfully.',
      });
      const updatedProperty = await getPropertyInfo(BigInt(localProperty.id));
      setLocalProperty(updatedProperty as Property);
    } catch (error) {
      console.error('Error buying property:', error);
      toast({
        title: 'Error',
        description: 'Failed to purchase property. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentProperty = async () => {
    setIsLoading(true);
    try {
      await rentProperty(BigInt(localProperty.id), localProperty.price);
      toast({
        title: 'Success',
        description: 'Property rented successfully.',
      });
      const updatedProperty = await getPropertyInfo(BigInt(localProperty.id));
      setLocalProperty(updatedProperty as Property);
    } catch (error) {
      console.error('Error renting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to rent property. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButton = () => {
    if (ownerAddress.toLowerCase() === localProperty.owner.toLowerCase()) {
      return (
        <Button disabled className="w-full bg-gray-600 text-gray-300">
          You own this property
        </Button>
      );
    }

    switch (localProperty.status) {
      case BigInt(1): // forSale
        return (
          <Button onClick={handleBuyProperty} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
            {isLoading ? 'Processing...' : 'Buy Property'}
          </Button>
        );
      case BigInt(2): // forRent
        return (
          <Button onClick={handleRentProperty} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? 'Processing...' : 'Rent Property'}
          </Button>
        );
      default:
        return (
          <Button disabled className="w-full bg-gray-600 text-gray-300">
            Not available
          </Button>
        );
    }
  };

  return (
    <Card className="bg-gray-800/90 border-gray-700 text-gray-200 backdrop-blur-md shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <Image
              src={`https://gateway.pinata.cloud/ipfs/${localProperty.imageUrl}`}
              alt={localProperty.name || 'Property Image'}
              width={600}
              height={400}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />

            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="text-sm font-medium bg-blue-500/80 px-4 py-2 rounded-full">
                {BigInt(localProperty.status) === BigInt(1) ? 'For Sale' : BigInt(localProperty.status) === BigInt(2) ? 'For Rent' : 'Not Available'}
              </div>
              {localProperty.isVerified && (
                <div className="bg-green-500/80 p-2 rounded-full">
                  <Verified className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          </div>
          <div className="p-6 space-y-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {localProperty.name}
            </h1>
            <PropertyDetails property={localProperty} />
            <p className="text-gray-300 leading-relaxed">{localProperty.description}</p>
            <div className="space-y-2">
              {renderActionButton()}
              <Button
                onClick={handleToggleLike}
                variant="outline"
                size="lg"
                className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-colors duration-300"
                disabled={isLiking}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    (localProperty.likeCount ?? 0) > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
                />
                {localProperty.likeCount} likes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyDetails({ property }: { property: Property }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <DetailItem icon={MapPin} color="text-blue-400" text={property.location} />
      <DetailItem
        icon={DollarSign}
        color="text-green-400"
        text={`${formatToCBTC(property.price)} cBTC`}
      />
      {property.status === BigInt(2) && (
        <>
          <DetailItem
            icon={User}
            color="text-purple-400"
            text={
              typeof property.currentTenant === 'string'
                ? `${property.currentTenant.slice(0, 6)}...${property.currentTenant.slice(-4)}`
                : 'N/A'
            }
          />
          <DetailItem
            icon={Calendar}
            color="text-yellow-400"
            text={`Until ${new Date(Number(property.rentalEndDate)).toLocaleDateString()}`}
          />
        </>
      )}
      <div className="col-span-2">
        <DetailItem
          icon={Home}
          color="text-blue-400"
          text={`${property.owner.slice(0, 6)}...${property.owner.slice(-4)}`}
          label="Owner"
          className="bg-gray-700/50 p-2 rounded-lg transition-colors duration-300 hover:bg-gray-600/50"
        />
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  color,
  text,
  label,
  className,
}: {
  icon: any;
  color: string;
  text: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center space-x-2 bg-gray-700/50 p-2 rounded-lg transition-colors duration-300 hover:bg-gray-600/50 ${className}`}
    >
      <Icon className={`${color} h-4 w-4`} />
      <div>
        {label && <span className="font-medium text-sm block">{label}</span>}
        <span className="font-medium break-all text-xs">{text}</span>
      </div>
    </div>
  );
}

