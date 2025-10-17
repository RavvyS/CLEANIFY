/**
 * Mock city configuration data for the Smart Waste Management System
 * Includes current config and version history
 */

export const cityConfig = {
  id: "config-001",
  cityId: "negombo-001",
  cityName: "Negombo Municipal Council",
  wasteTypes: [
    { id: "wt-1", name: "general", label: "General Waste", color: "#6B7280" },
    { id: "wt-2", name: "recyclable", label: "Recyclable", color: "#10B981" },
    { id: "wt-3", name: "e-waste", label: "E-Waste", color: "#EF4444" },
    { id: "wt-4", name: "organic", label: "Organic Waste", color: "#F59E0B" }
  ],
  pricingModel: "weight-based",
  baseRate: 50, // LKR per kg
  recyclingCredit: 20, // LKR per kg
  pickupFrequency: {
    "Zone A": "daily",
    "Zone B": "weekly",
    "Zone C": "twice-daily"
  },
  zones: [
    { 
      id: "zone-a", 
      name: "Zone A", 
      type: "Commercial", 
      binCount: 45, 
      color: "#3B82F6",
      boundaries: [
        { lat: 7.2090, lng: 79.8358 },
        { lat: 7.2095, lng: 79.8362 },
        { lat: 7.2089, lng: 79.8365 },
        { lat: 7.2085, lng: 79.8360 }
      ]
    },
    { 
      id: "zone-b", 
      name: "Zone B", 
      type: "Residential", 
      binCount: 80, 
      color: "#10B981",
      boundaries: [
        { lat: 7.2080, lng: 79.8348 },
        { lat: 7.2085, lng: 79.8352 },
        { lat: 7.2079, lng: 79.8355 },
        { lat: 7.2075, lng: 79.8350 }
      ]
    },
    { 
      id: "zone-c", 
      name: "Zone C", 
      type: "Industrial", 
      binCount: 25, 
      color: "#F59E0B",
      boundaries: [
        { lat: 7.2070, lng: 79.8338 },
        { lat: 7.2075, lng: 79.8342 },
        { lat: 7.2069, lng: 79.8345 },
        { lat: 7.2065, lng: 79.8340 }
      ]
    }
  ],
  version: 2,
  isActive: true,
  createdBy: "user-001",
  createdAt: "2025-09-01T00:00:00Z",
  updatedAt: "2025-10-15T10:30:00Z"
};

export const configVersionHistory = [
  {
    version: 1,
    changes: "Initial configuration",
    changedBy: "user-001",
    changedAt: "2025-09-01T00:00:00Z",
    baseRate: 45,
    recyclingCredit: 15,
    details: {
      pricingModel: "weight-based",
      zones: ["Zone A", "Zone B", "Zone C"],
      wasteTypes: ["general", "recyclable", "organic"]
    }
  },
  {
    version: 2,
    changes: "Increased rates and credits to incentivize recycling, added e-waste type",
    changedBy: "user-001",
    changedAt: "2025-10-15T10:30:00Z",
    baseRate: 50,
    recyclingCredit: 20,
    details: {
      pricingModel: "weight-based",
      zones: ["Zone A", "Zone B", "Zone C"],
      wasteTypes: ["general", "recyclable", "organic", "e-waste"]
    }
  }
];