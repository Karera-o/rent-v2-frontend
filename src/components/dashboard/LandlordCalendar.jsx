"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  CalendarDays
} from "lucide-react";

export default function LandlordCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState("all");
  
  // Mock data - in a real app, this would come from an API
  const properties = [
    { id: "P1001", name: "Modern Apartment with City View" },
    { id: "P1002", name: "Luxury Villa with Pool" },
    { id: "P1003", name: "Cozy Studio near University" },
    { id: "P1004", name: "Family House with Garden" },
    { id: "P1005", name: "Downtown Loft" }
  ];
  
  const bookings = [
    {
      id: "B12345",
      propertyId: "P1001",
      guest: "John Doe",
      checkIn: "2023-03-15",
      checkOut: "2023-03-18",
      status: "Confirmed"
    },
    {
      id: "B12346",
      propertyId: "P1002",
      guest: "Alice Smith",
      checkIn: "2023-03-20",
      checkOut: "2023-03-25",
      status: "Pending"
    },
    {
      id: "B12347",
      propertyId: "P1003",
      guest: "Robert Johnson",
      checkIn: "2023-03-12",
      checkOut: "2023-03-14",
      status: "Completed"
    },
    {
      id: "B12348",
      propertyId: "P1004",
      guest: "Emma Williams",
      checkIn: "2023-03-25",
      checkOut: "2023-03-30",
      status: "Cancelled"
    },
    {
      id: "B12349",
      propertyId: "P1001",
      guest: "Michael Brown",
      checkIn: "2023-04-10",
      checkOut: "2023-04-15",
      status: "Confirmed"
    }
  ];

  // Filter bookings based on selected property
  const filteredBookings = bookings.filter(booking => 
    selectedProperty === "all" || booking.propertyId === selectedProperty
  );

  // Calendar generation helpers
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate calendar data
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ day, date, dateKey: formatDateKey(date) });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Group bookings by date
  const bookingsByDate = {};
  
  filteredBookings.forEach(booking => {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    
    // Loop through all dates of the booking
    const currentDate = new Date(checkInDate);
    while (currentDate <= checkOutDate) {
      const dateKey = formatDateKey(currentDate);
      
      if (!bookingsByDate[dateKey]) {
        bookingsByDate[dateKey] = [];
      }
      
      bookingsByDate[dateKey].push({
        ...booking,
        isCheckIn: formatDateKey(checkInDate) === dateKey,
        isCheckOut: formatDateKey(checkOutDate) === dateKey
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "Confirmed": return "bg-green-500";
      case "Pending": return "bg-yellow-500";
      case "Completed": return "bg-blue-500";
      case "Cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={previousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              <option value="all">All Properties</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Confirmed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm">Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Cancelled</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 border-l-2 border-t-2 border-green-500 rotate-45 mr-2"></div>
          <span className="text-sm">Check-in</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 border-r-2 border-b-2 border-red-500 rotate-45 mr-2"></div>
          <span className="text-sm">Check-out</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {/* Days of the week */}
        <div className="grid grid-cols-7 border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} className="py-2 text-center text-sm font-medium text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 divide-x divide-y min-h-[600px]">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`relative min-h-24 p-1 ${!day.day ? 'bg-gray-50' : ''}`}
            >
              {day.day && (
                <>
                  <div className="text-sm font-medium p-1">{day.day}</div>
                  
                  <div className="space-y-1 mt-1">
                    {bookingsByDate[day.dateKey]?.map((booking, bookingIndex) => (
                      <div 
                        key={`${booking.id}-${bookingIndex}`}
                        className={`text-xs px-1 py-0.5 rounded overflow-hidden whitespace-nowrap text-ellipsis ${getStatusColor(booking.status)} text-white relative`}
                      >
                        {/* Check-in marker */}
                        {booking.isCheckIn && (
                          <div className="absolute left-0 top-0 w-0 h-0 border-t-4 border-l-4 border-white"></div>
                        )}
                        
                        {/* Check-out marker */}
                        {booking.isCheckOut && (
                          <div className="absolute right-0 bottom-0 w-0 h-0 border-b-4 border-r-4 border-white"></div>
                        )}
                        
                        <span className="text-xs">{booking.guest}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Upcoming Check-ins & Check-outs</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredBookings
            .filter(booking => new Date(booking.checkIn) >= new Date() || new Date(booking.checkOut) >= new Date())
            .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
            .slice(0, 5)
            .map(booking => {
              const property = properties.find(p => p.id === booking.propertyId);
              return (
                <div key={booking.id} className="p-4 flex items-start">
                  <div className="mr-4">
                    <CalendarDays className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-sm text-gray-500">{booking.guest}</p>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(booking.status)}
                        <span 
                          className={`ml-1.5 text-xs font-medium ${
                            booking.status === "Confirmed" ? "text-green-700" :
                            booking.status === "Pending" ? "text-yellow-700" :
                            booking.status === "Completed" ? "text-blue-700" :
                            "text-red-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm">
                      <div className="flex items-center mb-1 sm:mb-0 sm:mr-4">
                        <span className="mr-2 font-medium">Check-in:</span>
                        <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">Check-out:</span>
                        <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
          {filteredBookings.filter(booking => 
            new Date(booking.checkIn) >= new Date() || 
            new Date(booking.checkOut) >= new Date()
          ).length === 0 && (
            <div className="p-8 text-center">
              <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
              <p className="text-gray-500">
                There are no upcoming check-ins or check-outs for the selected property.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}