/**
 * Mock bins data for the Smart Waste Management System
 * 150 bins distributed across 3 zones
 */

// Helper function to generate random fill levels
const getRandomFillLevel = () => Math.floor(Math.random() * (95 - 20 + 1) + 20);

// Helper function to get a random recent date
const getRandomRecentDate = () => {
  const now = new Date('2025-10-17T00:00:00Z');
  const daysAgo = Math.floor(Math.random() * 7);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const bins = [
  // Zone A - Commercial Area (45 bins)
  ...Array(45).fill(null).map((_, index) => ({
    id: `bin-a${(index + 1).toString().padStart(3, '0')}`,
    binId: `BIN-A${(index + 1).toString().padStart(3, '0')}`,
    address: `${index + 1} High Street, Zone A`,
    zone: "Zone A",
    location: { 
      lat: 7.2090 + (Math.random() * 0.005), 
      lng: 79.8358 + (Math.random() * 0.005) 
    },
    wasteType: ["general", "recyclable", "organic", "e-waste"][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.95 ? "maintenance" : (Math.random() > 0.90 ? "damaged" : "active"),
    capacity: 100,
    currentFillLevel: getRandomFillLevel(),
    lastCollected: getRandomRecentDate(),
    householderId: `user-${Math.floor(Math.random() * 12) + 9}`,
    notes: ""
  })),

  // Zone B - Residential Area (80 bins)
  ...Array(80).fill(null).map((_, index) => ({
    id: `bin-b${(index + 1).toString().padStart(3, '0')}`,
    binId: `BIN-B${(index + 1).toString().padStart(3, '0')}`,
    address: `${index + 1} Lake View Road, Zone B`,
    zone: "Zone B",
    location: { 
      lat: 7.2080 + (Math.random() * 0.005), 
      lng: 79.8348 + (Math.random() * 0.005) 
    },
    wasteType: ["general", "recyclable", "organic"][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.95 ? "maintenance" : (Math.random() > 0.90 ? "damaged" : "active"),
    capacity: 80,
    currentFillLevel: getRandomFillLevel(),
    lastCollected: getRandomRecentDate(),
    householderId: `user-${Math.floor(Math.random() * 12) + 9}`,
    notes: ""
  })),

  // Zone C - Industrial Area (25 bins)
  ...Array(25).fill(null).map((_, index) => ({
    id: `bin-c${(index + 1).toString().padStart(3, '0')}`,
    binId: `BIN-C${(index + 1).toString().padStart(3, '0')}`,
    address: `${index + 1} Industrial Park Road, Zone C`,
    zone: "Zone C",
    location: { 
      lat: 7.2070 + (Math.random() * 0.005), 
      lng: 79.8338 + (Math.random() * 0.005) 
    },
    wasteType: ["general", "recyclable", "e-waste"][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.95 ? "maintenance" : (Math.random() > 0.90 ? "damaged" : "active"),
    capacity: 150,
    currentFillLevel: getRandomFillLevel(),
    lastCollected: getRandomRecentDate(),
    householderId: `user-${Math.floor(Math.random() * 12) + 9}`,
    notes: ""
  }))
].map(bin => {
  // Add some realistic notes for damaged/maintenance bins
  if (bin.status === "damaged") {
    bin.notes = ["Lid damaged", "Base cracked", "Handle broken"][Math.floor(Math.random() * 3)];
  } else if (bin.status === "maintenance") {
    bin.notes = ["Scheduled cleaning", "Sensor replacement", "General maintenance"][Math.floor(Math.random() * 3)];
  }
  return bin;
});