"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users, X } from "lucide-react";

// Generated events from schedule
const pocLeads = [
  "Geetansh Goyal", "Vikas Sharma", "Shrishti Kumari", "Nishta Agarwal", "Dhruv Mehta", 
  "Bhavesh Sharma", "Sujan YD", "Sahitya Singh", "Luvya Rana", "Izaz"
];

const startDate = new Date(2026, 6, 20); // July 20, 2026
const events: any[] = [];

// Manually mapping the special events from the image
const specialEvents: Record<number, { type: string, name: string }> = {
  1: { type: "Masterclass", name: "Masterclass" },
  2: { type: "Hackathon", name: "Monthly Hackathon" },
  5: { type: "Masterclass", name: "Masterclass" },
  7: { type: "Hackathon", name: "Monthly Hackathon" },
  8: { type: "BigEvent", name: "DevForge Big Event" },
  10: { type: "Masterclass", name: "Masterclass" },
  11: { type: "Hackathon", name: "Monthly Hackathon" },
  14: { type: "Masterclass", name: "Masterclass" },
  15: { type: "Hackathon", name: "Monthly Hackathon" },
  16: { type: "BigEvent", name: "DevForge Big Event" },
  18: { type: "Masterclass", name: "Masterclass" },
  20: { type: "Hackathon", name: "Monthly Hackathon" },
  23: { type: "Masterclass", name: "Masterclass" },
  24: { type: "Hackathon", name: "Monthly Hackathon" },
  25: { type: "BigEvent", name: "DevForge Big Event" },
  27: { type: "Masterclass", name: "Masterclass" },
  28: { type: "Hackathon", name: "Monthly Hackathon" },
  31: { type: "Masterclass", name: "Masterclass" },
  32: { type: "Hackathon", name: "Monthly Hackathon" },
  33: { type: "BigEvent", name: "DevForge Big Event" },
  35: { type: "Masterclass", name: "Masterclass" },
  37: { type: "Hackathon", name: "Monthly Hackathon" },
  40: { type: "Masterclass", name: "Masterclass" },
  41: { type: "Hackathon", name: "Monthly Hackathon" },
  42: { type: "BigEvent", name: "DevForge Big Event" },
  44: { type: "Masterclass", name: "Masterclass" },
  46: { type: "Hackathon", name: "Monthly Hackathon" },
  49: { type: "Masterclass", name: "Masterclass" },
  50: { type: "Hackathon", name: "Monthly Hackathon" }
};

for (let i = 0; i < 50; i++) {
  const sessionNumber = i + 1;
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + (i * 7));
  
  const poc = pocLeads[i % 10];
  const special = specialEvents[sessionNumber];
  
  let title = `Session #${sessionNumber}`;
  let category = "Weekly Session";
  
  if (special) {
    if (special.type === "Masterclass") {
      title = `Masterclass & Session #${sessionNumber}`;
      category = "Masterclass";
    } else if (special.type === "Hackathon") {
      title = `Monthly Hackathon & Session #${sessionNumber}`;
      category = "Hackathon";
    } else if (special.type === "BigEvent") {
      title = `DevForge Big Event & Session #${sessionNumber}`;
      category = "Big Event";
    }
  }

  events.push({
    id: sessionNumber,
    title,
    date,
    time: "6:00 PM - 8:00 PM IST",
    location: "DevForge Hub",
    description: `Led by ${poc}. Join us for Session #${sessionNumber} of the annual DevForge calendar.`,
    category,
    attendees: Math.floor(Math.random() * 50) + 100,
    poc
  });
}

export default function EventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Start in July 2026
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // State for popup
  
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Helper to check if a day has events
  const getEventsForDay = (day: number) => {
    return events.filter(e => 
      e.date.getDate() === day && 
      e.date.getMonth() === currentDate.getMonth() && 
      e.date.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-16 relative overflow-hidden">

      {/* === CRAZY FLOATING BACKGROUND === */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

        {/* Large slow-drifting orbs */}
        {[
          { x: "10%", y: "15%", size: 350, color: "rgba(249,115,22,0.13)", dur: 18 },
          { x: "75%", y: "10%", size: 280, color: "rgba(234,88,12,0.11)", dur: 22 },
          { x: "55%", y: "65%", size: 400, color: "rgba(251,146,60,0.09)", dur: 26 },
          { x: "5%",  y: "70%", size: 220, color: "rgba(249,115,22,0.10)", dur: 20 },
          { x: "85%", y: "55%", size: 260, color: "rgba(234,88,12,0.08)", dur: 24 },
          { x: "40%", y: "30%", size: 180, color: "rgba(253,186,116,0.07)", dur: 16 },
        ].map((orb, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size, background: orb.color }}
            animate={{ x: [0, 40, -30, 20, 0], y: [0, -30, 40, -20, 0], scale: [1, 1.15, 0.9, 1.1, 1] }}
            transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Floating calendar emoji icons */}
        {[
          { x: "8%",  y: "20%", scale: 1.2, dur: 7 },
          { x: "88%", y: "15%", scale: 0.9, dur: 9 },
          { x: "15%", y: "75%", scale: 1.0, dur: 11 },
          { x: "80%", y: "70%", scale: 1.4, dur: 8 },
          { x: "50%", y: "8%",  scale: 0.7, dur: 13 },
          { x: "93%", y: "40%", scale: 1.1, dur: 6 },
          { x: "3%",  y: "50%", scale: 0.8, dur: 10 },
        ].map((item, i) => (
          <motion.div
            key={`cal-${i}`}
            className="absolute text-orange-500/20 select-none"
            style={{ left: item.x, top: item.y, fontSize: `${item.scale * 36}px` }}
            animate={{ y: [0, -20, 0], rotate: [-8, 8, -8], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: item.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
          >
            📅
          </motion.div>
        ))}

        {/* Spinning ring outlines */}
        {[
          { x: "20%", y: "35%", size: 140, dur: 14, clockwise: true },
          { x: "70%", y: "25%", size: 100, dur: 10, clockwise: false },
          { x: "60%", y: "75%", size: 180, dur: 18, clockwise: true },
          { x: "10%", y: "60%", size: 80,  dur: 8,  clockwise: false },
        ].map((ring, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border border-orange-500/15"
            style={{ left: ring.x, top: ring.y, width: ring.size, height: ring.size }}
            animate={{ rotate: ring.clockwise ? 360 : -360, scale: [1, 1.1, 1] }}
            transition={{ rotate: { duration: ring.dur, repeat: Infinity, ease: "linear" }, scale: { duration: ring.dur / 2, repeat: Infinity, ease: "easeInOut" } }}
          />
        ))}

        {/* Inner spinning rings (concentric) */}
        {[
          { x: "20%", y: "35%", size: 90, dur: 9 },
          { x: "70%", y: "25%", size: 60, dur: 7 },
          { x: "60%", y: "75%", size: 110, dur: 12 },
        ].map((ring, i) => (
          <motion.div
            key={`ring-inner-${i}`}
            className="absolute rounded-full border border-amber-400/10"
            style={{ left: `calc(${ring.x} + ${(140 - ring.size) / 2}px)`, top: `calc(${ring.y} + ${(140 - ring.size) / 2}px)`, width: ring.size, height: ring.size }}
            animate={{ rotate: -360 }}
            transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Sparkle dots scattered */}
        {Array.from({ length: 24 }).map((_, i) => {
          const positions = [
            [12,22],[88,18],[45,12],[67,45],[23,68],[78,72],[34,88],[91,35],
            [56,28],[18,48],[72,82],[40,55],[82,10],[6,80],[60,90],[95,62],
            [28,10],[50,70],[14,38],[86,48],[38,20],[66,60],[10,90],[92,25]
          ];
          const [lx, ly] = positions[i] || [50, 50];
          return (
            <motion.div
              key={`spark-${i}`}
              className="absolute rounded-full bg-orange-400"
              style={{ left: `${lx}%`, top: `${ly}%`, width: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2, height: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2.5 + (i % 4), repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            />
          );
        })}

        {/* Floating number particles (days) */}
        {["17","28","04","31","12","23","09"].map((num, i) => (
          <motion.div
            key={`num-${i}`}
            className="absolute text-orange-500/10 font-black select-none"
            style={{ left: `${[15,80,45,25,65,88,5][i]}%`, top: `${[45,30,80,10,60,75,25][i]}%`, fontSize: "5rem" }}
            animate={{ y: [0, -25, 0], opacity: [0.06, 0.14, 0.06], rotate: [-5, 5, -5] }}
            transition={{ duration: 8 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }}
          >
            {num}
          </motion.div>
        ))}

        {/* Horizontal scan lines (subtle) */}
        {[15, 40, 65, 90].map((y, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/10 to-transparent"
            style={{ top: `${y}%` }}
            animate={{ opacity: [0, 0.5, 0], scaleX: [0.5, 1, 0.5] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
          />
        ))}

      </div>
      {/* === END FLOATING BACKGROUND === */}

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
            <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 text-orange-500 rounded-full mb-6 border border-orange-500/20">
                <CalendarIcon size={32} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Calendar</span>
            </h1>
            <p className="text-xl text-neutral-400">
                Stay updated with workshops, hackathons, and community meetups.
            </p>
        </motion.div>


        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextMonth} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center font-medium text-neutral-500 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square p-2 rounded-xl bg-neutral-900/20" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                
                return (
                  <div 
                    key={day} 
                    onClick={() => { if (dayEvents.length > 0) setSelectedEvent(dayEvents[0]); }}
                    className={`aspect-square p-2 rounded-xl border flex flex-col transition-all cursor-pointer hover:border-orange-500/50 ${
                      isToday ? 'bg-orange-500/10 border-orange-500/30' : 'bg-neutral-900/40 border-neutral-800'
                    }`}
                  >
                    <span className={`text-sm font-bold ${isToday ? 'text-orange-400' : 'text-neutral-300'}`}>{day}</span>
                    <div className="mt-auto space-y-1">
                      {dayEvents.map(e => (
                        <div key={e.id} className="w-full h-1.5 bg-orange-500 rounded-full" title={e.title} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Upcoming Events</h3>
            {events.filter(e => e.date >= currentDate).sort((a,b) => a.date.getTime() - b.date.getTime()).slice(0, 3).map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl group hover:border-orange-500/30 transition-colors"
              >
                <div className="text-sm font-bold text-orange-400 mb-2 uppercase tracking-wider">{event.category}</div>
                <h4 className="text-xl font-bold mb-4 group-hover:text-orange-400 transition-colors">{event.title}</h4>
                
                <div className="space-y-3 text-neutral-400 text-sm">
                  <div className="flex items-center gap-3">
                    <CalendarIcon size={16} className="text-neutral-500" />
                    <span>{event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-neutral-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-neutral-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl max-w-md w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-sm font-bold text-orange-400 mb-2 uppercase tracking-wider">
                {selectedEvent.category}
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">
                {selectedEvent.title}
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                    <CalendarIcon size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Date</div>
                    <div className="text-sm">{selectedEvent.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                    <Clock size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Time</div>
                    <div className="text-sm">{selectedEvent.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                    <MapPin size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Location</div>
                    <div className="text-sm">{selectedEvent.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                    <Users size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">POC</div>
                    <div className="text-sm">{selectedEvent.poc}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-200 text-sm leading-relaxed">
                {selectedEvent.description}
              </div>
              
              <button 
                onClick={() => setSelectedEvent(null)}
                className="w-full mt-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
