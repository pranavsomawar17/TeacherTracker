import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, Circle, Calendar, Bell, CheckCircle, XCircle, Home, BookOpen, CalendarPlus, UserCircle, AlertCircle, ChevronRight, Smartphone, MessageSquare } from 'lucide-react';

const TeacherTrackerApp = () => {
  // Sample timetable data
  const [timetableData] = useState([
    {
      teacher: "Prof. Dr. Suvarna Pawar",
      subject: "AIML",
      day: "Monday",
      "08:45-09:40": "",
      "09:40-10:35": "",
      "10:35-10:50": "Short Break",
      "10:50-11:45": "S-201",
      "11:45-12:40": "",
      "12:40-01:40": "Lunch Break",
      "01:40-02:35": "",
      "02:35-03:30": "",
      "03:30-03:40": "Short Break",
      "03:40-04:30": ""
    },
    {
      teacher: "Prof. Dr. Suvarna Pawar",
      subject: "AIML",
      day: "Tuesday",
      "08:45-09:40": "S-418",
      "09:40-10:35": "S-418",
      "10:35-10:50": "Short Break",
      "10:50-11:45": "S-201",
      "11:45-12:40": "",
      "12:40-01:40": "Lunch Break",
      "01:40-02:35": "S-403",
      "02:35-03:30": "",
      "03:30-03:40": "Short Break",
      "03:40-04:30": ""
    },
    {
      teacher: "Prof. Dr. Suvarna Pawar",
      subject: "AIML",
      day: "Wednesday",
      "08:45-09:40": "S-403",
      "09:40-10:35": "",
      "10:35-10:50": "Short Break",
      "10:50-11:45": "",
      "11:45-12:40": "",
      "12:40-01:40": "Lunch Break",
      "01:40-02:35": "",
      "02:35-03:30": "",
      "03:30-03:40": "Short Break",
      "03:40-04:30": ""
    },
    {
      teacher: "Prof. Dr. Suvarna Pawar",
      subject: "AIML",
      day: "Thursday",
      "08:45-09:40": "Online",
      "09:40-10:35": "",
      "10:35-10:50": "Short Break",
      "10:50-11:45": "S-201",
      "11:45-12:40": "",
      "12:40-01:40": "Lunch Break",
      "01:40-02:35": "S-403",
      "02:35-03:30": "",
      "03:30-03:40": "Short Break",
      "03:40-04:30": ""
    },
    {
      teacher: "Prof. Dr. Suvarna Pawar",
      subject: "AIML",
      day: "Friday",
      "08:45-09:40": "S-403",
      "09:40-10:35": "",
      "10:35-10:50": "Short Break",
      "10:50-11:45": "",
      "11:45-12:40": "",
      "12:40-01:40": "Lunch Break",
      "01:40-02:35": "S-403",
      "02:35-03:30": "S-403",
      "03:30-03:40": "Short Break",
      "03:40-04:30": ""
    },
    {
      teacher: "Dr. Smith Johnson",
      subject: "Data Science",
      day: "Monday",
      "08:45-09:40": "S-302",
      "09:40-10:35": "S-302",
      "10:35-10:50": "Short Break",
      "10:50-11:45": "",
      "11:45-12:40": "S-415",
      "12:40-01:40": "Lunch Break",
      "01:40-02:35": "",
      "02:35-03:30": "S-415",
      "03:30-03:40": "Short Break",
      "03:40-04:30": ""
    },
    {
      teacher: "Prof. Mary Williams",
      subject: "Computer Networks",
      day: "Monday",
      "08:45-09:40": "",
      "09:40-10:35": "S-511",
      "10:35-10:50": "Short Break",
      "10:50-11:45": "S-511",
      "11:45-12:40": "",
      "12:40-01:40": "Lunch Break",
      "01:40-02:35": "S-312",
      "02:35-03:30": "",
      "03:30-03:40": "Short Break",
      "03:40-04:30": "S-312"
    }
  ]);

  // Default cabins
  const defaultCabins = {
    "Prof. Dr. Suvarna Pawar": "S-103",
    "Dr. Smith Johnson": "S-104",
    "Prof. Mary Williams": "S-105"
  };

  // Teacher availability status
  const [teacherStatus, setTeacherStatus] = useState({
    "Prof. Dr. Suvarna Pawar": "Available",
    "Dr. Smith Johnson": "Available",
    "Prof. Mary Williams": "Busy"
  });

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // UI State
  const [currentView, setCurrentView] = useState("home");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [currentUser, setCurrentUser] = useState("student"); // student or teacher
  const [loggedInTeacher, setLoggedInTeacher] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const timeSlots = [
    "08:45-09:40", "09:40-10:35", "10:35-10:50", "10:50-11:45",
    "11:45-12:40", "12:40-01:40", "01:40-02:35", "02:35-03:30",
    "03:30-03:40", "03:40-04:30"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const teachers = [...new Set(timetableData.map(row => row.teacher))];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get current location for a teacher
  const getCurrentLocation = (teacher) => {
    const now = currentDateTime;
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = dayNames[now.getDay()];
    
    if (!days.includes(currentDay)) {
      return { location: "Off Campus", status: "Weekend" };
    }

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const schedule = timetableData.find(
      row => row.teacher === teacher && row.day === currentDay
    );

    if (!schedule) {
      return { location: defaultCabins[teacher] || "Location not set", status: "In Cabin" };
    }

    // Find current time slot
    for (let slot of timeSlots) {
      const [start, end] = slot.split('-');
      const [startHour, startMin] = start.split(':').map(Number);
      const [endHour, endMin] = end.split(':').map(Number);
      
      const startInMinutes = startHour * 60 + startMin;
      const endInMinutes = endHour * 60 + endMin;
      
      if (currentTimeInMinutes >= startInMinutes && currentTimeInMinutes <= endInMinutes) {
        const location = schedule[slot];
        
        if (!location || location === "") {
          return { location: defaultCabins[teacher] || "Location not set", status: "In Cabin" };
        }
        
        if (location === "Short Break") return { location: "On Break", status: "Short Break" };
        if (location === "Lunch Break") return { location: "Lunch Area", status: "Lunch Break" };
        if (location === "Online") return { location: "Remote", status: "Online Session" };
        
        return { location: `Room ${location}`, status: "In Lecture" };
      }
    }

    return { location: defaultCabins[teacher] || "Location not set", status: "In Cabin" };
  };

  // Book appointment
  const bookAppointment = () => {
    if (!selectedTeacher || !appointmentDate || !appointmentTime || !appointmentReason) {
      alert("Please fill all appointment details");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      teacher: selectedTeacher,
      date: appointmentDate,
      time: appointmentTime,
      reason: appointmentReason,
      status: "pending",
      student: "Current Student",
      requestedAt: new Date().toISOString()
    };

    setAppointments([...appointments, newAppointment]);
    
    // Create notification for teacher
    const newNotification = {
      id: Date.now(),
      type: "appointment_request",
      teacher: selectedTeacher,
      message: `New appointment request for ${appointmentDate} at ${appointmentTime}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications([...notifications, newNotification]);
    
    // Show success notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // Reset form
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentReason("");
    setCurrentView("appointments");
  };

  // Handle appointment response (for teachers)
  const handleAppointmentResponse = (appointmentId, response) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: response } : apt
    ));
    
    const apt = appointments.find(a => a.id === appointmentId);
    if (apt) {
      const newNotification = {
        id: Date.now(),
        type: "appointment_response",
        message: `Appointment ${response} by ${apt.teacher} for ${apt.date} at ${apt.time}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications([...notifications, newNotification]);
    }
  };

  // Mobile-optimized header
  const MobileHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Smartphone className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Teacher Tracker</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView("notifications")}
            className="relative p-2"
          >
            <Bell size={24} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setCurrentUser(currentUser === "student" ? "teacher" : "student")}
            className="p-2 bg-white/20 rounded-lg"
          >
            <UserCircle size={24} />
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm opacity-90">
        {currentDateTime.toLocaleString('en-US', { 
          weekday: 'short', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-4 h-16">
        <button
          onClick={() => setCurrentView("home")}
          className={`flex flex-col items-center justify-center gap-1 ${
            currentView === "home" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => setCurrentView("schedule")}
          className={`flex flex-col items-center justify-center gap-1 ${
            currentView === "schedule" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <BookOpen size={20} />
          <span className="text-xs">Schedule</span>
        </button>
        <button
          onClick={() => setCurrentView("book")}
          className={`flex flex-col items-center justify-center gap-1 ${
            currentView === "book" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <CalendarPlus size={20} />
          <span className="text-xs">Book</span>
        </button>
        <button
          onClick={() => setCurrentView("appointments")}
          className={`flex flex-col items-center justify-center gap-1 ${
            currentView === "appointments" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <Calendar size={20} />
          <span className="text-xs">Appointments</span>
        </button>
      </div>
    </div>
  );

  // Home View - Current Locations
  const HomeView = () => (
    <div className="pb-20">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Current Teacher Locations</h2>
        <div className="space-y-3">
          {teachers.map(teacher => {
            const { location, status } = getCurrentLocation(teacher);
            const isAvailable = teacherStatus[teacher] === "Available";
            
            return (
              <div key={teacher} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{teacher}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2 text-blue-500" />
                        <span>{location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2 text-blue-500" />
                        <span>{status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      isAvailable 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      <Circle 
                        size={8} 
                        fill="currentColor"
                        className="mr-1"
                      />
                      {isAvailable ? "Available" : "Busy"}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setCurrentView("book");
                      }}
                      className="text-blue-600 text-sm font-medium flex items-center"
                    >
                      Book
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Schedule View
  const ScheduleView = () => (
    <div className="pb-20">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Teacher Schedules</h2>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        >
          <option value="">Select a teacher...</option>
          {teachers.map(teacher => (
            <option key={teacher} value={teacher}>{teacher}</option>
          ))}
        </select>
        
        {selectedTeacher && (
          <div className="space-y-3">
            {days.map(day => {
              const schedule = timetableData.find(
                row => row.teacher === selectedTeacher && row.day === day
              );
              
              if (!schedule) return null;
              
              return (
                <div key={day} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">{day}</h3>
                  <div className="space-y-2">
                    {timeSlots.map(slot => {
                      const activity = schedule[slot];
                      if (!activity || activity === "") return null;
                      
                      return (
                        <div key={slot} className="flex items-center text-sm">
                          <span className="font-medium text-gray-600 w-24">{slot}</span>
                          <span className={`ml-2 px-2 py-1 rounded ${
                            activity === "Short Break" || activity === "Lunch Break" 
                              ? "bg-yellow-100 text-yellow-700"
                              : activity === "Online"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {activity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Book Appointment View
  const BookAppointmentView = () => (
    <div className="pb-20">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Book Appointment</h2>
        
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Teacher
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Choose teacher...</option>
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Slot
            </label>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Choose time...</option>
              {timeSlots.filter(slot => 
                !["10:35-10:50", "12:40-01:40", "03:30-03:40"].includes(slot)
              ).map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Meeting
            </label>
            <textarea
              value={appointmentReason}
              onChange={(e) => setAppointmentReason(e.target.value)}
              placeholder="Brief description of meeting purpose..."
              className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none"
            />
          </div>
          
          <button
            onClick={bookAppointment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <CalendarPlus className="inline mr-2" size={20} />
            Request Appointment
          </button>
        </div>
        
        {selectedTeacher && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <AlertCircle className="inline mr-1" size={16} />
              {teacherStatus[selectedTeacher] === "Available" 
                ? "Teacher is currently available. Your request will be sent immediately."
                : "Teacher is currently busy. They will respond when available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Appointments View
  const AppointmentsView = () => (
    <div className="pb-20">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          {currentUser === "teacher" ? "Appointment Requests" : "My Appointments"}
        </h2>
        
        {currentUser === "teacher" && !loggedInTeacher && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <select
              onChange={(e) => setLoggedInTeacher(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Login as teacher...</option>
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="space-y-3">
          {appointments
            .filter(apt => currentUser === "teacher" ? apt.teacher === loggedInTeacher : true)
            .map(apt => (
              <div key={apt.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {currentUser === "teacher" ? apt.student : apt.teacher}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{apt.reason}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    apt.status === "pending" 
                      ? "bg-yellow-100 text-yellow-700"
                      : apt.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {apt.status}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Calendar size={14} className="mr-2" />
                  <span>{apt.date}</span>
                  <Clock size={14} className="ml-4 mr-2" />
                  <span>{apt.time}</span>
                </div>
                
                {currentUser === "teacher" && apt.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAppointmentResponse(apt.id, "approved")}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleAppointmentResponse(apt.id, "rejected")}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                    >
                      <XCircle size={16} className="mr-1" />
                      Reject
                    </button>
                  </div>
                )}
                
                {currentUser === "student" && apt.status === "approved" && (
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                    <MessageSquare size={16} className="mr-1" />
                    Message Teacher
                  </button>
                )}
              </div>
            ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Notifications View
  const NotificationsView = () => (
    <div className="pb-20">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        
        <div className="space-y-3">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                notif.type === "appointment_request" 
                  ? "border-blue-500"
                  : notif.type === "appointment_response"
                  ? "border-green-500"
                  : "border-gray-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Success Notification Toast
  const NotificationToast = () => (
    showNotification && (
      <div className="fixed top-20 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
        <div className="flex items-center">
          <CheckCircle className="mr-2" />
          <span>Appointment request sent successfully!</span>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <MobileHeader />
      
      {/* Main Content */}
      <div className="pb-16">
        {currentView === "home" && <HomeView />}
        {currentView === "schedule" && <ScheduleView />}
        {currentView === "book" && <BookAppointmentView />}
        {currentView === "appointments" && <AppointmentsView />}
        {currentView === "notifications" && <NotificationsView />}
      </div>
      
      <BottomNav />
      <NotificationToast />
    </div>
  );
};

export default TeacherTrackerApp;