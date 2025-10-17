/**
 * Mock statistics data for dashboards
 */

export const wasteStatistics = {
  monthly: {
    general: 2500,
    recyclable: 1800,
    organic: 2100,
    eWaste: 500
  },
  daily: [
    { date: '2025-10-11', total: 230, recycled: 95 },
    { date: '2025-10-12', total: 245, recycled: 110 },
    { date: '2025-10-13', total: 265, recycled: 120 },
    { date: '2025-10-14', total: 255, recycled: 115 },
    { date: '2025-10-15', total: 240, recycled: 105 },
    { date: '2025-10-16', total: 250, recycled: 118 },
    { date: '2025-10-17', total: 235, recycled: 108 }
  ],
  recyclingRate: 0.42,
  totalCollections: 1250,
  activeCollectors: 8,
  routeEfficiency: 0.85
};

export const zoneStatistics = [
  {
    zone: "Zone A",
    bins: 45,
    collections: 420,
    recyclingRate: 0.38,
    fillRate: 0.75
  },
  {
    zone: "Zone B",
    bins: 80,
    collections: 560,
    recyclingRate: 0.45,
    fillRate: 0.65
  },
  {
    zone: "Zone C",
    bins: 25,
    collections: 270,
    recyclingRate: 0.41,
    fillRate: 0.82
  }
];

export const recentActivity = [
  {
    id: "act-001",
    type: "collection",
    description: "Completed route RT-2025101701 in Zone A",
    timestamp: "2025-10-17T09:30:00Z",
    status: "success"
  },
  {
    id: "act-002",
    type: "maintenance",
    description: "Bin BIN-A023 scheduled for maintenance",
    timestamp: "2025-10-17T08:45:00Z",
    status: "pending"
  },
  {
    id: "act-003",
    type: "alert",
    description: "High fill level detected in Zone C bins",
    timestamp: "2025-10-17T08:15:00Z",
    status: "warning"
  },
  {
    id: "act-004",
    type: "route",
    description: "New collection route created for Zone B",
    timestamp: "2025-10-17T07:30:00Z",
    status: "info"
  }
];

export const insights = [
  {
    title: "Peak Collection Times",
    description: "Highest bin fill rates observed between 9 AM and 11 AM in Zone A",
    impact: "high",
    recommendation: "Consider increasing morning collection frequency"
  },
  {
    title: "Recycling Improvement",
    description: "15% increase in recycling rates in Zone B this month",
    impact: "positive",
    recommendation: "Extend successful recycling programs to other zones"
  },
  {
    title: "Route Optimization",
    description: "Current routes in Zone C showing 25% longer completion times",
    impact: "medium",
    recommendation: "Review and optimize collection routes in Zone C"
  }
];