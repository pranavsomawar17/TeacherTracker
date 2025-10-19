
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MapPin, Clock, Circle, Calendar as CalendarIcon,
  CheckCircle, XCircle, Home, BookOpen, CalendarPlus,
  UserCircle, AlertCircle, ChevronRight, Smartphone, MessageSquare
} from "lucide-react";
import timetableDataJson from "./data/timetableData.json";

/* --------------------------- HOME VIEW --------------------------- */
const HomeView = React.memo(function HomeView({
  teachers,
  searchTerm,
  setSearchTerm,
  getCurrentLocation,
  onBookClick
}) {
  const filteredTeachers = useMemo(
    () => teachers.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())),
    [teachers, searchTerm]
  );

  return (
    <div className="pb-20 p-4">
      <h2 className="text-lg font-semibold mb-4">Current Teacher Locations</h2>

      <input
        type="text"
        placeholder="Search teacher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
      />

      <div className="space-y-3">
        {filteredTeachers.map(teacher => {
          const { location, status } = getCurrentLocation(teacher);
          const isBusy = ["In Lecture", "College Closed", "Weekend", "Break"].includes(status);

          return (
            <div key={teacher} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{teacher}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-blue-500" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-blue-500" />
                      <span>{status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm ${isBusy ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    <Circle size={8} fill="currentColor" className="mr-1" />
                    {isBusy ? "Busy" : "Available"}
                  </div>

                  <button onClick={() => onBookClick(teacher)} className="text-blue-600 text-sm font-medium flex items-center">
                    Book <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTeachers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No teachers found</div>
        )}
      </div>
    </div>
  );
});

/* --------------------------- SCHEDULE VIEW --------------------------- */
const ScheduleView = ({ teachers, timetableData, days, timeSlots, selectedTeacher, setSelectedTeacher }) => (
  <div className="pb-20 p-4">
    <h2 className="text-lg font-semibold mb-4">Teacher Schedules</h2>

    <select
      value={selectedTeacher}
      onChange={(e) => setSelectedTeacher(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg mb-4"
    >
      <option value="">Select a teacher...</option>
      {teachers.map(t => <option key={t} value={t}>{t}</option>)}
    </select>

    {selectedTeacher && (
      <div className="space-y-3">
        {days.map(day => {
          const schedule = timetableData.find(r => r.teacher === selectedTeacher && r.day === day);
          if (!schedule) return null;
          return (
            <div key={day} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3">{day}</h3>
              {timeSlots.map(slot => {
                const entry = schedule[slot];
                if (!entry) return null;
                return (
                  <div key={slot} className="flex items-center text-sm">
                    <span className="font-medium text-gray-600 w-28">{slot}</span>
                    <span className={`ml-2 px-2 py-1 rounded ${
                      entry.includes("Break")
                        ? "bg-yellow-100 text-yellow-700"
                        : entry === "Online"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}>
                      {entry}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

/* --------------------------- BOOK APPOINTMENT VIEW --------------------------- */
const BookAppointmentView = ({
  teachers,
  selectedTeacher,
  setSelectedTeacher,
  appointmentDate,
  setAppointmentDate,
  appointmentTime,
  setAppointmentTime,
  appointmentReason,
  setAppointmentReason,
  bookAppointment,
  teacherStatus
}) => {
  const timeSlots = [
    "08:45-09:40", "09:40-10:35", "10:35-10:50", "10:50-11:45",
    "11:45-12:40", "12:40-01:40", "01:40-02:35", "02:35-03:30",
    "03:30-03:40"
  ];

  return (
    <div className="pb-20 p-4">
      <h2 className="text-lg font-semibold mb-4">Book Appointment</h2>

      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Choose teacher...</option>
            {teachers.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
          <select
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Choose time...</option>
            {timeSlots.filter(slot => !["10:35-10:50", "12:40-01:40", "03:30-03:40"].includes(slot))
              .map(slot => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
          <textarea
            value={appointmentReason}
            onChange={(e) => setAppointmentReason(e.target.value)}
            placeholder="Reason for meeting..."
            className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none"
          />
        </div>

        <button
          onClick={bookAppointment}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <CalendarPlus className="inline mr-2" size={20} />
          Send Request
        </button>
      </div>

      {selectedTeacher && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <AlertCircle className="inline mr-1" size={16} />
            {teacherStatus[selectedTeacher] === "Available"
              ? "Teacher is currently available."
              : "Teacher is busy; they’ll respond soon."}
          </p>
        </div>
      )}
    </div>
  );
};

/* --------------------------- APPOINTMENTS VIEW --------------------------- */
const AppointmentsView = ({
  currentUser,
  appointments,
  loggedInTeacher,
  setLoggedInTeacher,
  handleAppointmentResponse,
  teachers
}) => {
  const visibleAppointments = currentUser === "teacher"
    ? appointments.filter(a => a.teacher === loggedInTeacher)
    : appointments;

  return (
    <div className="pb-20 p-4">
      <h2 className="text-lg font-semibold mb-4">
        {currentUser === "teacher" ? "Appointment Requests" : "My Appointments"}
      </h2>

      {currentUser === "teacher" && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <select
            value={loggedInTeacher}
            onChange={(e) => setLoggedInTeacher(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Login as teacher...</option>
            {teachers.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-3">
        {visibleAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">No appointments yet</div>
        )}

        {visibleAppointments.map(apt => (
          <div key={apt.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {currentUser === "teacher" ? apt.student : apt.teacher}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{apt.reason}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  apt.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : apt.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {apt.status}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-3">
              <CalendarIcon size={14} className="mr-2" />
              <span>{apt.date}</span>
              <Clock size={14} className="ml-4 mr-2" />
              <span>{apt.time}</span>
            </div>

            {currentUser === "teacher" &&
              loggedInTeacher === apt.teacher &&
              apt.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAppointmentResponse(apt.id, "approved")}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                  >
                    <CheckCircle size={16} className="mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handleAppointmentResponse(apt.id, "rejected")}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                  >
                    <XCircle size={16} className="mr-1" /> Reject
                  </button>
                </div>
              )}

            {currentUser === "student" && apt.status === "approved" && (
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                <MessageSquare size={16} className="mr-1" /> Message Teacher
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* --------------------------- MAIN APP --------------------------- */
export default function TeacherTrackerApp() {
  const [timetableData] = useState(timetableDataJson);
  const [appointments, setAppointments] = useState([]);
  const [currentView, setCurrentView] = useState("home");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [currentUser, setCurrentUser] = useState("student");
  const [loggedInTeacher, setLoggedInTeacher] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const teachers = useMemo(() => [...new Set(timetableData.map(r => r.teacher))], [timetableData]);

  // Default cabins
  const defaultCabins = {
    "Prof. Dr. Suvarna Pawar": "S-103",
    "Prof. Dr Rajendra Pawar": "N-504 [6]",
    "Prof. Dr. Manisha Galphade": "S-513 [A]",
    "Prof. Amit Uttarkar": "S-513 [D]",
    "Prof. Dr. Reena Gunjan": "N-003",
    "Prof. Kiran Shinde": "S-415 [B]",
    "Prof. Sumedha Ayachit": "J-901 [Cubicle 30]",
    "Prof. Vijaya Samadhan Patil": "J-901 [Cubical 24]",
    "Prof. Thanekar Sachin" :"S-616 [C]",
    "Prof. Shahin Makubhai" :"J-901 [Cubicle 4]",
    "Prof. Prajwalita Dongre" :"S-901 [C]",
    "Prof. Jyoti Manoorkar" : "S-309 & S-310 [K]",
    "Prof. Nilesh Thorat" : "S-211 [B]",
    "Prof. Swati Powar" : "S-211 [E]",
    "Dr. Umar M Mulani" : "S-901 [I]"
  };

  // improved time parser: handles times like "03:40" in your JSON (which are PM slots)
  const convertToMinutes = (time) => {
    if (!time || typeof time !== "string") return NaN;
    const parts = time.trim().split(":");
    if (parts.length !== 2) return NaN;
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) || 0;
    if (isNaN(h) || isNaN(m)) return NaN;

    // Heuristic: your timetable uses 12-hour-like strings (e.g. "01:40" for 1:40 PM).
    // We'll convert small hours (1-7) to PM by adding 12, keeping 8-12 as-is.
    if (h >= 1 && h <= 7) h += 12;
    return h * 60 + m;
  };

  const getCurrentLocation = useCallback((teacher) => {
    const now = currentDateTime;
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()];
    const currentMin = now.getHours() * 60 + now.getMinutes();

    const collegeStart = convertToMinutes("08:45"); // 8:45 AM
    const collegeEnd = convertToMinutes("04:30");   // 4:30 PM (in your JSON "04:30" -> 16:30)

    // Outside college hours
    if (isNaN(collegeStart) || isNaN(collegeEnd) || currentMin < collegeStart || currentMin >= collegeEnd) {
      return { location: defaultCabins[teacher] || "Off Campus", status: "College Closed" };
    }

    // Weekend
    if (day === "Sunday" || day === "Saturday") {
      return { location: defaultCabins[teacher] || "Home", status: "Weekend" };
    }

    const entry = timetableData.find(r => r.teacher === teacher && r.day === day);
    if (!entry) return { location: defaultCabins[teacher] || "In Cabin", status: "In Cabin" };

    const timeSlots = [
      "08:45-09:40", "09:40-10:35", "10:35-10:50", "10:50-11:45",
      "11:45-12:40", "12:40-01:40", "01:40-02:35", "02:35-03:30",
      "03:30-03:40", "03:40-04:30"
    ];

    for (let slot of timeSlots) {
      const [startRaw, endRaw] = slot.split("-").map(s => s.trim());
      const startMin = convertToMinutes(startRaw);
      const endMin = convertToMinutes(endRaw);
      if (isNaN(startMin) || isNaN(endMin)) continue;

      // active if now is >= start and < end
      if (currentMin >= startMin && currentMin < endMin) {
        const rawLoc = (entry[slot] ?? "").toString().trim();

        if (!rawLoc) {
          return { location: defaultCabins[teacher] || "In Cabin", status: "In Cabin" };
        }

        if (rawLoc.toLowerCase().includes("break")) {
          return { location: rawLoc, status: "Break" };
        }

        if (rawLoc.toLowerCase() === "online") {
          return { location: "Remote", status: "Online" };
        }

        // valid room string (e.g., "S-201")
        return { location: `Room ${rawLoc}`, status: "In Lecture" };
      }
    }

    // If no matching slot found, assume cabin
    return { location: defaultCabins[teacher] || "In Cabin", status: "In Cabin" };
  }, [currentDateTime, timetableData]);

  const teacherStatus = useMemo(() => {
    const res = {};
    teachers.forEach(t => {
      const s = getCurrentLocation(t).status;
      res[t] = ["In Lecture", "College Closed", "Weekend", "Break"].includes(s) ? "Busy" : "Available";
    });
    return res;
  }, [teachers, getCurrentLocation]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const bookAppointment = () => {
    if (!selectedTeacher || !appointmentDate || !appointmentTime || !appointmentReason) {
      alert("Please fill all details");
      return;
    }
    const newApt = {
      id: Date.now(),
      teacher: selectedTeacher,
      date: appointmentDate,
      time: appointmentTime,
      reason: appointmentReason,
      status: "pending",
      student: "Current Student"
    };
    setAppointments(prev => [...prev, newApt]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentReason("");
  };

  const handleAppointmentResponse = (id, res) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: res } : a));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Smartphone className="mr-2" /> <h1 className="font-bold text-xl">Scheduler</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentUser(currentUser === "student" ? "teacher" : "student")}>
            <UserCircle size={24} />
          </button>
        </div>
      </div>

      {currentView === "home" && (
        <HomeView
          teachers={teachers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          getCurrentLocation={getCurrentLocation}
          onBookClick={(t) => { setSelectedTeacher(t); setCurrentView("book"); }}
        />
      )}

      {currentView === "book" && (
        <BookAppointmentView
          teachers={teachers}
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
          appointmentDate={appointmentDate}
          setAppointmentDate={setAppointmentDate}
          appointmentTime={appointmentTime}
          setAppointmentTime={setAppointmentTime}
          appointmentReason={appointmentReason}
          setAppointmentReason={setAppointmentReason}
          bookAppointment={bookAppointment}
          teacherStatus={teacherStatus}
        />
      )}

      {currentView === "schedule" && (
        <ScheduleView
          teachers={teachers}
          timetableData={timetableData}
          days={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
          timeSlots={[
            "08:45-09:40", "09:40-10:35", "10:35-10:50", "10:50-11:45",
            "11:45-12:40", "12:40-01:40", "01:40-02:35", "02:35-03:30",
            "03:30-03:40", "03:40-04:30"
          ]}
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
        />
      )}

      {currentView === "appointments" && (
        <AppointmentsView
          currentUser={currentUser}
          appointments={appointments}
          loggedInTeacher={loggedInTeacher}
          setLoggedInTeacher={setLoggedInTeacher}
          handleAppointmentResponse={handleAppointmentResponse}
          teachers={teachers}
        />
      )}

      {/* bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around h-16 items-center">
        <button onClick={() => setCurrentView("home")} className={`${currentView === "home" ? "text-blue-600" : "text-gray-500"}`}>
          <Home />
        </button>
        <button onClick={() => setCurrentView("book")} className={`${currentView === "book" ? "text-blue-600" : "text-gray-500"}`}>
          <CalendarPlus />
        </button>
        <button onClick={() => setCurrentView("schedule")} className={`${currentView === "schedule" ? "text-blue-600" : "text-gray-500"}`}>
          <BookOpen />
        </button>
        <button onClick={() => setCurrentView("appointments")} className={`${currentView === "appointments" ? "text-blue-600" : "text-gray-500"}`}>
          <CalendarIcon />
        </button>
      </div>

      {showNotification && (
        <div className="fixed top-20 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <CheckCircle className="mr-2" /> Appointment Sent!
          </div>
        </div>
      )}
    </div>
  );
}
