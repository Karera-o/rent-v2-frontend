"use client";

import { useState, useRef } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PropertyService from "@/services/property";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddPropertyDialog({ children, onPropertyAdded }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    property_type: "Apartment",
    address: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    area: "", // in square feet/meters
    price_per_night: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    amenities: [],
    images: [],
  });

  const propertyTypes = [
    "Apartment",
    "House",
    "Villa",
    "Studio",
    "Loft",
    "Condo",
    "Townhouse",
  ];

  const amenitiesOptions = [
    "Wi-Fi",
    "Air Conditioning",
    "Heating",
    "Kitchen",
    "TV",
    "Parking",
    "Elevator",
    "Pool",
    "Gym",
    "Washing Machine",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenitiesChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    addImagesToFormData(files);
  };

  const addImagesToFormData = (files) => {
    // Filter for only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast({
        title: "Warning",
        description: "Please select image files only (PNG, JPG, GIF).",
        variant: "warning",
      });
      return;
    }

    // Add the files to the form data
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageFiles],
    }));
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    addImagesToFormData(files);
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (formData.title.length < 5) {
        throw new Error('Title must be at least 5 characters long');
      }

      if (formData.description.length < 20) {
        throw new Error('Description must be at least 20 characters long');
      }

      // Prepare the form data for API submission
      const propertyData = {
        ...formData,
        // Convert string values to numbers where needed
        price_per_night: parseFloat(formData.price_per_night) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
        // Add any other required fields
        status: 'Pending Approval', // Default status for new properties

        // Map amenities to the format expected by the backend
        has_wifi: formData.amenities.includes('Wi-Fi'),
        has_kitchen: formData.amenities.includes('Kitchen'),
        has_air_conditioning: formData.amenities.includes('Air Conditioning'),
        has_heating: formData.amenities.includes('Heating'),
        has_tv: formData.amenities.includes('TV'),
        has_parking: formData.amenities.includes('Parking'),
        has_pool: formData.amenities.includes('Pool'),
        has_gym: formData.amenities.includes('Gym'),
        has_maid_service: formData.amenities.includes('Washing Machine'),
        has_car_rental: formData.amenities.includes('Elevator')
      };

      // Log the exact data being sent to the API for debugging
      console.log('Sending property data to API:', JSON.stringify(propertyData, null, 2));

      // Make the API call to create the property
      const response = await PropertyService.createProperty(propertyData);

      // Get the newly created property ID
      const newPropertyId = response.id;

      // Upload images if there are any
      if (formData.images && formData.images.length > 0) {
        // Show uploading status
        toast({
          title: "Uploading Images",
          description: `Uploading ${formData.images.length} images...`,
        });

        // Upload each image
        const uploadPromises = formData.images.map(async (imageFile, index) => {
          try {
            // Set the first image as primary
            const isPrimary = index === 0;
            await PropertyService.uploadPropertyImage(newPropertyId, imageFile, {
              is_primary: isPrimary
            });
            return true;
          } catch (error) {
            console.error(`Error uploading image ${index}:`, error);
            return false;
          }
        });

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);
        const successCount = results.filter(result => result).length;

        if (successCount > 0) {
          toast({
            title: "Images Uploaded",
            description: `Successfully uploaded ${successCount} of ${formData.images.length} images.`,
          });
        }

        if (successCount < formData.images.length) {
          toast({
            title: "Warning",
            description: `Failed to upload ${formData.images.length - successCount} images.`,
            variant: "warning",
          });
        }
      }

      // Show success message
      toast({
        title: "Success",
        description: "Property created successfully!",
      });

      // Close dialog and reset form after successful creation
      setOpen(false);
      setFormData({
        title: "",
        property_type: "Apartment",
        address: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
        area: "",
        price_per_night: "",
        bedrooms: "",
        bathrooms: "",
        description: "",
        amenities: [],
        images: [],
      });

      // Call the callback function if provided
      if (typeof onPropertyAdded === 'function') {
        onPropertyAdded(response);
      }
    } catch (error) {
      console.error("Error creating property:", error);

      // Try to extract validation errors from the response
      let errorMessage = "Failed to create property. Please try again.";

      if (error.response?.data?.detail) {
        const validationErrors = error.response.data.detail;
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          // Get the first few validation errors
          const errorMessages = validationErrors.slice(0, 3).map(err => {
            // Format the field name for display
            const fieldName = err.loc[err.loc.length - 1].replace('_', ' ');
            return `${fieldName}: ${err.msg}`;
          });

          errorMessage = errorMessages.join('\n');
          if (validationErrors.length > 3) {
            errorMessage += `\n...and ${validationErrors.length - 3} more errors`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State/Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per Night ($)
              </label>
              <input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleInputChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area (sq ft)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="inline-flex items-center"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenitiesChange(amenity)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Property Images
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'} border-dashed rounded-md transition-colors`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <Building2 className={`mx-auto h-12 w-12 ${isDragging ? 'text-primary' : 'text-gray-400'} transition-colors`} />
                  <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span>Upload images</span>
                      <input
                        ref={fileInputRef}
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1 mt-1 sm:mt-0">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
