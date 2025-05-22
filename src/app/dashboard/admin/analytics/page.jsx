import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Percent, 
  Download,
  Filter
} from "lucide-react";

export default function AnalyticsPage() {
  // Mock data for demonstration purposes
  const metrics = [
    {
      title: "Total Revenue",
      value: "$125,430",
      change: "+12.5%",
      trend: "up",
      period: "vs last month",
      icon: <CreditCard className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Total Bookings",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      period: "vs last month",
      icon: <Calendar className="h-6 w-6 text-green-500" />
    },
    {
      title: "New Users",
      value: "45",
      change: "+4.5%",
      trend: "up",
      period: "vs last month",
      icon: <Users className="h-6 w-6 text-purple-500" />
    },
    {
      title: "Average Price",
      value: "$1,250",
      change: "-2.3%",
      trend: "down",
      period: "vs last month",
      icon: <Building2 className="h-6 w-6 text-yellow-500" />
    }
  ];

  const topProperties = [
    {
      id: "P12345",
      title: "Modern Apartment with City View",
      location: "New York",
      bookings: 24,
      revenue: "$28,800",
      occupancy: 85
    },
    {
      id: "P12346",
      title: "Luxury Villa with Pool",
      location: "Los Angeles",
      bookings: 18,
      revenue: "$81,000",
      occupancy: 72
    },
    {
      id: "P12347",
      title: "Cozy Studio near University",
      location: "Boston",
      bookings: 31,
      revenue: "$24,800",
      occupancy: 92
    },
    {
      id: "P12348",
      title: "Family House with Garden",
      location: "Chicago",
      bookings: 15,
      revenue: "$33,000",
      occupancy: 65
    },
    {
      id: "P12349",
      title: "Penthouse with Rooftop Terrace",
      location: "Miami",
      bookings: 12,
      revenue: "$42,000",
      occupancy: 58
    }
  ];

  const topLocations = [
    { location: "New York", bookings: 214, percentage: 28 },
    { location: "Los Angeles", bookings: 189, percentage: 25 },
    { location: "Miami", bookings: 145, percentage: 19 },
    { location: "Chicago", bookings: 97, percentage: 13 },
    { location: "Boston", bookings: 86, percentage: 11 },
    { location: "Others", bookings: 32, percentage: 4 }
  ];

  const bookingsByType = [
    { type: "Apartment", count: 520, percentage: 42 },
    { type: "House", count: 315, percentage: 26 },
    { type: "Villa", count: 210, percentage: 17 },
    { type: "Studio", count: 124, percentage: 10 },
    { type: "Condo", count: 65, percentage: 5 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <div className="relative inline-block">
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last Year</option>
            </select>
          </div>
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md">
            <Filter className="h-5 w-5" />
          </button>
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {metric.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {metric.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="flex items-center">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 flex-shrink-0 self-center text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 flex-shrink-0 self-center text-red-500" />
                  )}
                  <span 
                    className={`ml-2 font-medium ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.change}
                  </span>
                  <span className="ml-2 text-gray-500">
                    {metric.period}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue and Bookings Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Revenue Trend Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Revenue Trend</h3>
            <div className="mt-2">
              {/* Placeholder for chart */}
              <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Revenue Chart Placeholder</p>
                  <p className="text-xs text-gray-400 mt-2">
                    (In a real application, this would be an interactive chart showing revenue trends)
                  </p>
                  {/* Fake chart bars */}
                  <div className="flex items-end justify-center h-36 mt-4 space-x-2">
                    {[35, 40, 30, 60, 45, 80, 70, 75, 65, 85, 90, 60].map((height, i) => (
                      <div
                        key={i}
                        className="w-6 bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Trend Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Booking Trend</h3>
            <div className="mt-2">
              {/* Placeholder for chart */}
              <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Bookings Chart Placeholder</p>
                  <p className="text-xs text-gray-400 mt-2">
                    (In a real application, this would be an interactive chart showing booking trends)
                  </p>
                  {/* Fake chart line */}
                  <div className="h-36 mt-4 px-4 relative">
                    <svg className="w-full h-full" viewBox="0 0 300 100">
                      <path
                        d="M0,80 L25,70 L50,75 L75,60 L100,65 L125,45 L150,50 L175,30 L200,35 L225,20 L250,40 L275,25 L300,30"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                      />
                      <path
                        d="M0,80 L25,70 L50,75 L75,60 L100,65 L125,45 L150,50 L175,30 L200,35 L225,20 L250,40 L275,25 L300,30 L300,100 L0,100 Z"
                        fill="url(#gradient)"
                        fillOpacity="0.2"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Properties */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Top Performing Properties</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    <div className="text-xs text-gray-500">ID: {property.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{property.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {property.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {property.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${property.occupancy}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{property.occupancy}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution by Location and Property Type */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Bookings by Location */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Bookings by Location</h3>
            <div className="mt-4 space-y-4">
              {topLocations.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{item.bookings}</span>
                      <span className="ml-2 text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings by Property Type */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Bookings by Property Type</h3>
            <div className="mt-4 space-y-4">
              {bookingsByType.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{item.count}</span>
                      <span className="ml-2 text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}