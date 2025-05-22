"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  DollarSign,
  Bed,
  Bath,
  Square,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Loader2,
  Wifi,
  Tv,
  ChefHat,
  Wind,
  Car,
  Utensils,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Droplets,
  Flame,
  Home,
  FileCheck,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminService from "@/services/admin";
import DocumentService from "@/services/document";
import PropertyImage from "@/components/PropertyImage";
import ZoomableImage from "@/components/ZoomableImage";
import ZoomablePropertyImage from "@/components/ZoomablePropertyImage";

export default function PropertyDetailsPage({ params }) {
  const { toast } = useToast();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status?.toLowerCase() || '';

    // Map status to color
    switch (normalizedStatus) {
      case 'available':
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'unavailable':
      case 'rented':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        console.log('Unknown status:', status);
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get document verification badge color
  const getDocumentVerificationBadgeColor = (status) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status?.toLowerCase() || '';

    // Map status to color
    switch (normalizedStatus) {
      case 'verified':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'not_submitted':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        console.log('Unknown document verification status:', status);
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Function to handle property approval
  const handleApproveProperty = async () => {
    // Check document verification status
    if (property.document_verification_status !== 'verified') {
      toast({
        title: "Warning",
        description: "Property documents must be verified before approval.",
        variant: "warning",
      });
      return;
    }

    try {
      await AdminService.approveProperty(params.id);
      toast({
        title: "Success",
        description: "Property approved successfully.",
      });
      fetchProperty();
    } catch (error) {
      console.error('Error approving property:', error);
      toast({
        title: "Error",
        description: "Failed to approve property. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle property rejection
  const handleRejectProperty = async () => {
    try {
      await AdminService.rejectProperty(params.id);
      toast({
        title: "Success",
        description: "Property rejected successfully.",
      });
      fetchProperty();
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast({
        title: "Error",
        description: "Failed to reject property. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle property deletion
  const handleDeleteProperty = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    try {
      await AdminService.deleteProperty(params.id);
      toast({
        title: "Success",
        description: "Property deleted successfully.",
      });
      // Redirect to properties list
      window.location.href = "/dashboard/admin/properties";
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to fetch property details
  const fetchProperty = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await AdminService.getPropertyById(params.id);
      console.log('Property details:', data);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property details:', error);
      setError('Failed to load property details. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load property details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch property when component mounts
  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading property details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/admin/properties">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <div>
          <Link href="/dashboard/admin/properties" className="inline-flex items-center text-sm text-primary hover:text-primary/80 mb-3 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-lg">{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {(property.status?.toLowerCase() === 'pending' || property.status?.toLowerCase() === 'pending_approval') && (
            <Button onClick={handleApproveProperty} variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 shadow-sm rounded-lg px-4 py-2 font-medium">
              <CheckCircle className="mr-2 h-5 w-5" />
              Approve
            </Button>
          )}
          {(property.status?.toLowerCase() === 'pending' || property.status?.toLowerCase() === 'pending_approval') && (
            <Button onClick={handleRejectProperty} variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-sm rounded-lg px-4 py-2 font-medium">
              <XCircle className="mr-2 h-5 w-5" />
              Reject
            </Button>
          )}
          <Link href={`/dashboard/admin/properties/${property.id}/edit`}>
            <Button variant="outline" className="shadow-sm rounded-lg px-4 py-2 font-medium">
              <Edit className="mr-2 h-5 w-5" />
              Edit
            </Button>
          </Link>
          <Button onClick={handleDeleteProperty} variant="destructive" className="shadow-sm rounded-lg px-4 py-2 font-medium">
            <Trash2 className="mr-2 h-5 w-5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="mb-2 flex flex-wrap gap-3">
        {/* Property Status Badge */}
        <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-lg shadow-sm ${getStatusBadgeColor(property.status)}`}>
          {(() => {
            // Format status for display
            const status = property.status?.toLowerCase();
            if (status === 'pending' || status === 'pending_approval') {
              return 'Pending Approval';
            } else if (status === 'approved' || status === 'available') {
              return 'Available';
            } else if (status) {
              // Capitalize first letter
              return status.charAt(0).toUpperCase() + status.slice(1);
            } else {
              return 'Unknown';
            }
          })()}
        </span>

        {/* Document Verification Status Badge */}
        <span className={`px-4 py-2 inline-flex items-center text-sm leading-5 font-semibold rounded-lg shadow-sm ${getDocumentVerificationBadgeColor(property.document_verification_status)}`}>
          {(() => {
            const docStatus = property.document_verification_status?.toLowerCase();
            let icon = null;

            if (docStatus === 'verified') {
              icon = <CheckCircle className="mr-2 h-4 w-4" />;
              return <>
                {icon}
                Documents Verified
              </>;
            } else if (docStatus === 'pending') {
              icon = <AlertCircle className="mr-2 h-4 w-4" />;
              return <>
                {icon}
                Documents Pending
              </>;
            } else if (docStatus === 'rejected') {
              icon = <XCircle className="mr-2 h-4 w-4" />;
              return <>
                {icon}
                Documents Rejected
              </>;
            } else {
              icon = <FileCheck className="mr-2 h-4 w-4" />;
              return <>
                {icon}
                No Documents
              </>;
            }
          })()}
        </span>

        {/* Link to Documents */}
        <Link href="/dashboard/admin/documents" className="px-4 py-2 inline-flex items-center text-sm leading-5 font-semibold rounded-lg shadow-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          <FileCheck className="mr-2 h-4 w-4" />
          View Documents
        </Link>
      </div>

      {/* Property Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="bg-gray-100 rounded-xl overflow-hidden h-[500px] relative group shadow-lg">
            {property.images && property.images.length > 0 ? (
              <>
                <div className="relative w-full h-full">
                  <PropertyImage
                    src={property.images[selectedImage].url}
                    alt={property.images[selectedImage].caption || property.title}
                    className="w-full h-full object-cover"
                    fill={true}
                  />
                </div>
                {/* Navigation arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 text-gray-800 p-3 rounded-full opacity-70 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 text-gray-800 p-3 rounded-full opacity-70 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Building2 className="h-16 w-16 text-gray-400" />
                <span className="ml-2 text-gray-500">No images available</span>
              </div>
            )}
          </div>
          {property.images && property.images.length > 1 && (
            <div className="grid grid-cols-6 gap-3 mt-4">
              {property.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden h-20 relative ${selectedImage === index ? 'ring-2 ring-primary shadow-md' : 'hover:opacity-90 transition-opacity'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <PropertyImage
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    fill={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-3">Property Information</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 flex items-center"><Home className="w-4 h-4 mr-2" /> Type:</span>
              <span className="font-medium capitalize text-gray-800">{property.property_type}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 flex items-center"><DollarSign className="w-4 h-4 mr-2" /> Price:</span>
              <span className="font-medium text-gray-800 text-lg">${property.price_per_night}<span className="text-sm text-gray-500">/night</span></span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 flex items-center"><Bed className="w-4 h-4 mr-2" /> Bedrooms:</span>
              <span className="font-medium text-gray-800">{property.bedrooms}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 flex items-center"><Bath className="w-4 h-4 mr-2" /> Bathrooms:</span>
              <span className="font-medium text-gray-800">{property.bathrooms}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 flex items-center"><Square className="w-4 h-4 mr-2" /> Area:</span>
              <span className="font-medium text-gray-800">{property.area} sq ft</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 flex items-center"><User className="w-4 h-4 mr-2" /> Owner:</span>
              <span className="font-medium text-gray-800">
                {property.owner ? (
                  <Link href={`/dashboard/admin/users/${property.owner.id}`} className="text-primary hover:underline">
                    {property.owner.name ||
                     (property.owner.first_name && property.owner.last_name ?
                      `${property.owner.first_name} ${property.owner.last_name}` :
                      property.owner.username) ||
                     'Unknown'}
                  </Link>
                ) : (
                  'Unknown Owner'
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Created:</span>
              <span className="font-medium">{formatDate(property.created_at)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Last Updated:</span>
              <span className="font-medium">{formatDate(property.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 my-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">Description</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{property.description}</p>
      </div>

      {/* Amenities */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-3">Amenities</h2>
        {!property.has_wifi && !property.has_kitchen && !property.has_air_conditioning &&
          !property.has_heating && !property.has_tv && !property.has_parking &&
          !property.has_pool && !property.has_gym && !property.has_maid_service &&
          !property.has_car_rental ? (
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-100">
            <Building2 className="h-6 w-6 text-gray-400 mr-3" />
            <span className="text-gray-500 text-lg">No amenities listed for this property</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {property.has_wifi && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Wifi className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">WiFi</span>
            </div>
          )}
          {property.has_kitchen && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <ChefHat className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">Kitchen</span>
            </div>
          )}
          {property.has_air_conditioning && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Wind className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">Air Conditioning</span>
            </div>
          )}
          {property.has_heating && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Wind className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">Heating</span>
            </div>
          )}
          {property.has_tv && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Tv className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">TV</span>
            </div>
          )}
          {property.has_parking && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Car className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">Parking</span>
            </div>
          )}
          {property.has_pool && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Droplets className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">Pool</span>
            </div>
          )}
          {property.has_gym && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Dumbbell className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">Gym</span>
            </div>
          )}
          {property.has_maid_service && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Utensils className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">Maid Service</span>
            </div>
          )}
          {property.has_car_rental && (
            <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm border border-gray-100 transition-colors">
              <Car className="h-5 w-5 text-primary mr-3" />
              <span className="font-medium">Car Rental</span>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
