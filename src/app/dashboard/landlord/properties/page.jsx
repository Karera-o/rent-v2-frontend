"use client";

import { useState, useRef } from "react";
import { Plus, Building2 } from "lucide-react";
import LandlordProperties from "@/components/dashboard/LandlordProperties";
import AddPropertyDialog from "@/components/properties/AddPropertyDialog";

export default function LandlordPropertiesPage() {
  // Create a ref to access the LandlordProperties component methods
  const propertiesComponentRef = useRef(null);

  // Function to refresh properties after adding a new one
  const handlePropertyAdded = () => {
    // Check if the ref is available and has the fetchProperties method
    if (propertiesComponentRef.current && propertiesComponentRef.current.fetchProperties) {
      propertiesComponentRef.current.fetchProperties(1); // Refresh and go to first page
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          My Properties
        </h1>
        <AddPropertyDialog onPropertyAdded={handlePropertyAdded}>
          <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Add Property
          </button>
        </AddPropertyDialog>
      </div>
      <LandlordProperties ref={propertiesComponentRef} />
    </div>
  );
}
