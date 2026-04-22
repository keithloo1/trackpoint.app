import React, { useState } from 'react';
import { 
  Home, Users, Calendar, BarChart2, MessageSquare, 
  Settings, HelpCircle, LogOut, Search, Bell, 
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight, RotateCw,
  DollarSign, Download, FileText, Plus, ArrowLeft, Copy, Check, Clock, MapPin, CheckSquare
} from 'lucide-react';
import dobermanLogo from '../assets/doberman.png';

// --- Mock Data ---
const mockClients = [
  { id: 1, name: 'Aria Smith', avatar: 'AS', email: 'aria.smith@example.com', phone: '+1 (555) 123-4567', package: '10 Session Pack', usedSessions: 5, totalSessions: 10, expiry: '24 Sep 2026', status: 'Active', notes: 'Aria is focusing on lower body strength. Keep track of her squat depth.' },
  { id: 2, name: 'James Wilson', avatar: 'JW', email: 'j.wilson88@example.com', phone: '+1 (555) 987-6543', package: 'Monthly Unlimited', usedSessions: null, totalSessions: null, expiry: '01 May 2026', status: 'Expiring Soon', notes: 'James has a slight shoulder impingement. Avoid heavy overhead presses for the next 2 weeks.' },
  { id: 3, name: 'Sarah Jenkins', avatar: 'SJ', email: 'sarah.j@example.com', phone: '+1 (555) 456-7890', package: '10 Session Pack', usedSessions: 10, totalSessions: 10, expiry: '18 Apr 2026', status: 'Expired', notes: 'Needs to renew. Mention the new 20-session bundle discount next time she comes in.' },
  { id: 4, name: 'Marcus Chen', avatar: 'MC', email: 'marcus.c@example.com', phone: '+1 (555) 222-3333', package: '5 Session Pack', usedSessions: 1, totalSessions: 5, expiry: '12 Nov 2026', status: 'Active', notes: 'New client. Goal is mobility and general fitness.' },
];

const mockSchedule = [
  { id: 101, time: '06:00 AM', duration: '60 min', type: 'Group Class', title: 'Morning HIIT Bootcamp', location: 'Main Floor', capacity: '18/20', attendees: [{name: 'Aria Smith', avatar: 'AS'}, {name: 'Marcus Chen', avatar: 'MC'}, {name: 'Sarah J.', avatar: 'SJ'}] },
  { id: 102, time: '08:30 AM', duration: '60 min', type: '1-on-1', title: 'Personal Training', location: 'Squat Racks', capacity: '1/1', attendees: [{name: 'James Wilson', avatar: 'JW'}] },
  { id: 103, time: '12:00 PM', duration: '45 min', type: 'Group Class', title: 'Lunchtime Core Blast', location: 'Studio A', capacity: '12/15', attendees: [{name: 'Aria Smith', avatar: 'AS'}] },
  { id: 104, time: '03:00 PM', duration: '90 min', type: 'Blocked', title: 'Admin & Programming', location: 'Office', capacity: '-', attendees: [] },
  { id: 105, time: '05:30 PM', duration: '60 min', type: '1-on-1', title: 'Personal Training', location: 'Free Weights', capacity: '1/1', attendees: [{name: 'Sarah Jenkins', avatar: 'SJ'}] },
];

// --- Helper Functions ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getDailyQuote = () => {
  const quotes = [
    "“What gets measured gets managed.” – Peter Drucker",
    "“Action is the foundational key to all success.” – Pablo Picasso",
    "“Success is the sum of small efforts, repeated day-in and day-out.” – Robert Collier",
    "“Don’t count the days, make the days count.” – Muhammad Ali",
    "“The secret of getting ahead is getting started.” – Mark Twain"
  ];
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [activeTab, setActiveTab] = useState('Month');
  
  // State for Client Management
  const [selectedClient, setSelectedClient] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // State for Schedule
  const [selectedSession, setSelectedSession] = useState(mockSchedule[0]);

  const greeting = getGreeting();
  const quote = getDailyQuote();

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex h-screen w-full bg-[#F9F7F2] font-sans text-[#0B4550] overflow-hidden">
      
      {/* ========================================== */}
      {/* LEFT SIDEBAR */}
      {/* ========================================== */}
      <aside className="w-[260px] bg-white h-full flex flex-col border-r border-gray-100 shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-20 flex items-center px-6 gap-3 mt-2">
          <img src={dobermanLogo} alt="TrackPoint" className="h-10 w-auto" onError={(e) => e.target.style.display = 'none'} />
          <span className="text-3xl font-medium tracking-wide text-[#0B4550]">TrackPoint</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          <NavItem icon={<Home size={28} />} label="Dashboard" isActive={activePage === 'Dashboard'} onClick={() => {setActivePage('Dashboard'); setSelectedClient(null);}} />
          <NavItem icon={<Users size={28} />} label="Clients" isActive={activePage === 'Clients'} onClick={() => {setActivePage('Clients'); setSelectedClient(null);}} />
          <NavItem icon={<DollarSign size={28} />} label="Revenue" isActive={activePage === 'Revenue'} onClick={() => {setActivePage('Revenue'); setSelectedClient(null);}} />
          <NavItem icon={<Calendar size={28} />} label="Schedule" isActive={activePage === 'Schedule'} onClick={() => {setActivePage('Schedule'); setSelectedClient(null);}} />
          <NavItem icon={<BarChart2 size={28} />} label="Analytics" isActive={activePage === 'Analytics'} onClick={() => setActivePage('Analytics')} />
          <NavItem icon={<MessageSquare size={28} />} label="Messages" isActive={activePage === 'Messages'} onClick={() => setActivePage('Messages')} />
        </nav>

        <div className="px-5 mb-6 mt-4">
          <div className="bg-[#0B4550] rounded-2xl p-5 text-center shadow-lg">
            <h4 className="text-white font-medium text-xl mb-1.5">Upgrade To Pro</h4>
            <p className="text-[#898A8D] text-sm mb-4 leading-relaxed font-medium">
              Get access to advanced analytics and client portals.
            </p>
            <button className="w-full bg-white/10 hover:bg-[#E6FF2B] hover:text-[#0B4550] text-white text-lg font-medium py-3 rounded-xl transition-all">
              Upgrade
            </button>
          </div>
        </div>

        <div className="px-4 pb-6 space-y-1">
          <NavItem icon={<Settings size={28} />} label="Settings" />
          <NavItem icon={<LogOut size={28} />} label="Log out" />
        </div>
      </aside>

      {/* ========================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================== */}
      <main className="flex-1 h-full overflow-y-auto p-6 lg:p-8 relative">
        
        {/* --- UNIVERSAL DYNAMIC HEADER --- */}
        <header className="flex justify-between items-start mb-8 gap-4">
          <div>
            {activePage === 'Dashboard' && (
              <>
                <h1 className="text-5xl font-medium text-[#0B4550] mb-2">{greeting}, Emmanuel</h1>
                <p className="text-[#898A8D] font-medium text-xl">Here is your gym's overview for today.</p>
              </>
            )}
            {activePage === 'Revenue' && (
              <>
                <h1 className="text-5xl font-medium text-[#0B4550] mb-2">Revenue History</h1>
                <p className="text-[#898A8D] font-medium text-xl">Manage payments and download invoices.</p>
              </>
            )}
            {activePage === 'Clients' && !selectedClient && (
              <>
                <h1 className="text-5xl font-medium text-[#0B4550] mb-2">Client Roster</h1>
                <p className="text-[#898A8D] font-medium text-xl">Manage your active clients and packages.</p>
              </>
            )}
            {activePage === 'Clients' && selectedClient && (
              <>
                <h1 className="text-5xl font-medium text-[#0B4550] mb-2">Client Profile</h1>
                <p className="text-[#898A8D] font-medium text-xl">Detailed view and trainer notes.</p>
              </>
            )}
            {activePage === 'Schedule' && (
              <>
                <h1 className="text-5xl font-medium text-[#0B4550] mb-2">Your Schedule</h1>
                <p className="text-[#898A8D] font-medium text-xl">Manage your classes, 1-on-1s, and availability.</p>
              </>
            )}
            {/* Fallback */}
            {activePage !== 'Dashboard' && activePage !== 'Revenue' && activePage !== 'Clients' && activePage !== 'Schedule' && (
              <>
                <h1 className="text-5xl font-medium text-[#0B4550] mb-2">{activePage}</h1>
                <p className="text-[#898A8D] font-medium text-xl">Manage your {activePage.toLowerCase()} here.</p>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-5 shrink-0 mt-1">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#898A8D]" size={22} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-72 pl-14 pr-4 py-3 bg-white border-none rounded-full text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#E6FF2B] shadow-sm text-[#0B4550] placeholder-[#898A8D]"
              />
            </div>
            <button className="relative p-3 bg-white rounded-full shadow-sm text-[#898A8D] hover:text-[#0B4550] transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-12 h-12 rounded-full bg-[#0B4550] flex items-center justify-center text-[#E6FF2B] text-xl font-medium shadow-sm border-2 border-white cursor-pointer">
              EJ
            </div>
          </div>
        </header>

        {/* ================================================================= */}
        {/* VIEW: DASHBOARD OVERVIEW */}
        {/* ================================================================= */}
        {activePage === 'Dashboard' && (
          <div className="animate-in fade-in duration-500">
            {/* Quote and Tabs Row */}
            <div className="flex justify-between items-center mb-8 gap-4">
              <div className="bg-white px-6 py-3 rounded-xl border-l-4 border-[#E6FF2B] shadow-sm max-w-2xl">
                <p className="text-[#0B4550] font-medium text-lg italic">{quote}</p>
              </div>
              <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100 shrink-0">
                {['Day', 'Week', 'Month', 'Year'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-5 mb-6">
              <div 
                onClick={() => setActivePage('Revenue')}
                className="bg-[#0B4550] rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-[150px] cursor-pointer hover:brightness-110 transition-all group"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all"></div>
                <div className="flex justify-between items-center">
                  <h3 className="text-white/80 font-medium text-lg">Total Revenue</h3>
                  <ArrowUpRight className="text-white/50 group-hover:text-[#E6FF2B] transition-colors" size={20} />
                </div>
                <div>
                  <h2 className="text-5xl lg:text-6xl font-medium text-white mb-1">$23,902</h2>
                  <div className="flex items-center text-[#E6FF2B] text-base font-medium gap-1.5">
                    <TrendingUp size={20} />
                    <span>4.2% from last month</span>
                  </div>
                </div>
              </div>

              <StatCard title="Total Renewals" value="142" trend="+1.7%" isPositive={true} />
              <StatCard title="Upcoming Expiries" value="18" trend="-2.9%" isPositive={false} />
              <StatCard title="Active Clients" value="485" trend="+0.9%" isPositive={true} />
            </div>

            <div className="grid grid-cols-3 gap-5 mb-6">
              <div className="col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-2xl text-[#0B4550]">Attendance & Revenue</h3>
                </div>
                <div className="flex items-end justify-between flex-1 px-2 min-h-[180px]">
                  <div className="flex flex-col justify-between h-full text-base font-medium text-[#898A8D] pb-6">
                    <span>10K</span><span>8K</span><span>4K</span><span>2K</span><span>0</span>
                  </div>
                  <ChartBar month="Jan" height="h-[60%]" />
                  <ChartBar month="Feb" height="h-[50%]" />
                  <ChartBar month="Mar" height="h-[85%]" active />
                  <ChartBar month="Apr" height="h-[45%]" />
                  <ChartBar month="May" height="h-[80%]" />
                  <ChartBar month="Jun" height="h-[30%]" />
                </div>
              </div>

              <div className="col-span-1 flex flex-col gap-5">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-5">
                    <ChevronLeft size={24} className="text-[#898A8D] cursor-pointer" />
                    <h3 className="font-medium text-2xl text-[#0B4550]">April 2026</h3>
                    <ChevronRight size={24} className="text-[#898A8D] cursor-pointer" />
                  </div>
                  <div className="flex justify-between items-center text-center">
                    <Day date="20" day="Mon" />
                    <Day date="21" day="Tue" active />
                    <Day date="22" day="Wed" />
                    <Day date="23" day="Thu" />
                    <Day date="24" day="Fri" />
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-xl text-[#0B4550] mb-1">Birthdays this month</h3>
                    <div className="flex items-center text-[#898A8D] text-base font-medium gap-1">
                      <span>12 Clients</span>
                    </div>
                  </div>
                  <div className="relative w-14 h-14 flex items-center justify-center rounded-full border-[6px] border-[#F9F7F2]">
                    <div className="absolute inset-0 rounded-full border-[6px] border-[#0B4550] border-l-transparent border-b-transparent transform rotate-45"></div>
                    <span className="text-xl font-medium text-[#0B4550]">12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: REVENUE */}
        {/* ================================================================= */}
        {activePage === 'Revenue' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex justify-end items-center mb-8">
              <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
                {['Day', 'Month', 'Year', 'All Time'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 mb-8">
               <div className="bg-[#0B4550] rounded-3xl p-6 shadow-md">
                 <h3 className="text-white/80 font-medium text-lg mb-2">Total Collected (This Month)</h3>
                 <h2 className="text-4xl font-medium text-white">$23,902</h2>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Pending Payments</h3>
                 <h2 className="text-4xl font-medium text-[#0B4550]">$1,250</h2>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Projected Renewals</h3>
                 <h2 className="text-4xl font-medium text-[#0B4550]">$4,800</h2>
               </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-medium text-2xl text-[#0B4550] mb-4 border-b-2 border-gray-100 pb-4">Today, April 21, 2026</h3>
              <table className="w-full text-left border-collapse mb-10">
                <thead>
                  <tr className="text-base font-medium text-[#898A8D] uppercase tracking-wider">
                    <th className="pb-4">Client Name</th>
                    <th className="pb-4">Description</th>
                    <th className="pb-4">Payment Method</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4 text-center">Invoice</th>
                  </tr>
                </thead>
                <tbody className="text-lg font-medium text-[#0B4550]">
                  <TransactionRow name="Aria Smith" avatar="AS" desc="10 Session Pack Renewal" method="Credit Card ending 4242" amount="+$650.00" />
                  <TransactionRow name="Marcus Johnson" avatar="MJ" desc="Monthly Unlimited" method="Direct Debit" amount="+$299.00" />
                </tbody>
              </table>

              <h3 className="font-medium text-2xl text-[#0B4550] mb-4 border-b-2 border-gray-100 pb-4">Yesterday, April 20, 2026</h3>
              <table className="w-full text-left border-collapse">
                <tbody className="text-lg font-medium text-[#0B4550]">
                  <TransactionRow name="Sarah Jenkins" avatar="SJ" desc="Drop-in Session" method="Stripe" amount="+$35.00" />
                  <TransactionRow name="Liam Chen" avatar="LC" desc="Quarterly Package" method="Credit Card ending 1010" amount="+$750.00" />
                  <TransactionRow name="Emma Davis" avatar="ED" desc="Monthly Unlimited" method="Direct Debit" amount="+$299.00" />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: CLIENTS */}
        {/* ================================================================= */}
        {activePage === 'Clients' && (
          <div className="animate-in fade-in duration-500">
            
            {!selectedClient && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100 shrink-0">
                    {['All Clients', 'Active', 'Expiring Soon', 'Expired'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <button className="bg-[#E6FF2B] text-[#0B4550] px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
                    <Plus size={24} />
                    Add New Client
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockClients.map(client => (
                    <div 
                      key={client.id} 
                      onClick={() => setSelectedClient(client)}
                      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-xl font-medium group-hover:bg-[#E6FF2B] transition-colors">
                            {client.avatar}
                          </div>
                          <div>
                            <h3 className="text-2xl font-medium text-[#0B4550]">{client.name}</h3>
                            <p className="text-[#898A8D] font-medium text-sm">{client.package}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        {client.totalSessions ? (
                          <>
                            <div className="flex justify-between text-sm font-medium mb-2">
                              <span className="text-[#898A8D]">Sessions Used</span>
                              <span className="text-[#0B4550]">{client.usedSessions} / {client.totalSessions}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all ${client.usedSessions === client.totalSessions ? 'bg-red-400' : 'bg-[#0B4550]'}`}
                                style={{ width: `${(client.usedSessions / client.totalSessions) * 100}%` }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between text-sm font-medium mb-2 pt-5">
                            <span className="text-[#898A8D]">Subscription Type</span>
                            <span className="text-[#0B4550]">Time-Based</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-[#898A8D] font-medium text-sm">Expires:</span>
                        <span className={`font-medium text-base px-3 py-1 rounded-lg ${
                          client.status === 'Expired' ? 'bg-red-100 text-red-600' : 
                          client.status === 'Expiring Soon' ? 'bg-[#E6FF2B]/30 text-[#0B4550]' : 
                          'text-[#0B4550]'
                        }`}>
                          {client.expiry}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedClient && (
              <div className="animate-in slide-in-from-right-8 duration-300">
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="flex items-center gap-2 text-[#898A8D] font-medium text-lg mb-8 hover:text-[#0B4550] transition-colors"
                >
                  <ArrowLeft size={24} />
                  Back to Roster
                </button>

                <div className="grid grid-cols-3 gap-8">
                  <div className="col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                      <div className="w-24 h-24 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-3xl font-medium mx-auto mb-4 border-4 border-white shadow-sm">
                        {selectedClient.avatar}
                      </div>
                      <h2 className="text-3xl font-medium text-[#0B4550] mb-2">{selectedClient.name}</h2>
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${
                          selectedClient.status === 'Expired' ? 'bg-red-100 text-red-600' : 
                          selectedClient.status === 'Expiring Soon' ? 'bg-[#E6FF2B] text-[#0B4550]' : 
                          'bg-gray-100 text-[#898A8D]'
                      }`}>
                        {selectedClient.status}
                      </span>
                      
                      <div className="text-left space-y-4 border-t border-gray-100 pt-6">
                        <div>
                          <p className="text-sm font-medium text-[#898A8D]">Email</p>
                          <p className="text-lg font-medium text-[#0B4550]">{selectedClient.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#898A8D]">Phone</p>
                          <p className="text-lg font-medium text-[#0B4550]">{selectedClient.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#898A8D]">Current Package</p>
                          <p className="text-lg font-medium text-[#0B4550]">{selectedClient.package}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0B4550] rounded-3xl p-6 shadow-md">
                      <h3 className="text-white font-medium text-xl mb-2">Personal Portal</h3>
                      <p className="text-white/70 text-sm font-medium mb-4">Share this link for {selectedClient.name} to view their progress.</p>
                      
                      <div className="flex bg-white/10 rounded-xl p-2 border border-white/20">
                        <input 
                          type="text" 
                          readOnly 
                          value={`trackpoint.app/p/${selectedClient.id}x89z`}
                          className="bg-transparent text-white w-full px-2 outline-none font-medium text-sm"
                        />
                        <button 
                          onClick={handleCopyLink}
                          className="bg-[#E6FF2B] text-[#0B4550] p-2 rounded-lg hover:brightness-95 transition-all flex items-center justify-center shrink-0 w-10 h-10"
                        >
                          {copiedLink ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
                      <h3 className="font-medium text-2xl text-[#0B4550] mb-6">Trainer Notes</h3>
                      
                      <textarea 
                        className="w-full flex-1 bg-[#F9F7F2] border-2 border-gray-100 rounded-2xl p-6 text-lg font-medium text-[#0B4550] focus:outline-none focus:border-[#E6FF2B] transition-colors resize-none"
                        defaultValue={selectedClient.notes}
                        placeholder="Add workout notes, injury updates, or goals here..."
                      ></textarea>
                      
                      <div className="flex justify-end mt-6">
                        <button className="bg-[#0B4550] text-white px-8 py-3 rounded-xl font-medium text-lg hover:bg-[#0B4550]/90 transition-all shadow-sm">
                          Save Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: SCHEDULE */}
        {/* ================================================================= */}
        {activePage === 'Schedule' && (
          <div className="animate-in fade-in duration-500 flex flex-col h-full">
            
            <div className="flex justify-between items-center mb-8 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-6 px-4">
                <ChevronLeft size={28} className="text-[#898A8D] cursor-pointer hover:text-[#0B4550] transition-colors" />
                <h2 className="text-2xl font-medium text-[#0B4550] w-48 text-center">April 2026</h2>
                <ChevronRight size={28} className="text-[#898A8D] cursor-pointer hover:text-[#0B4550] transition-colors" />
              </div>
              
              <div className="flex gap-2 flex-1 justify-center border-l border-r border-gray-100 px-6">
                <Day date="20" day="Mon" />
                <Day date="21" day="Tue" active />
                <Day date="22" day="Wed" />
                <Day date="23" day="Thu" />
                <Day date="24" day="Fri" />
                <Day date="25" day="Sat" />
              </div>

              <div className="px-4">
                <button className="bg-[#E6FF2B] text-[#0B4550] px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
                  <Plus size={24} />
                  New Event
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 flex-1 pb-10">
              
              <div className="col-span-2 space-y-6">
                <h3 className="font-medium text-2xl text-[#0B4550] mb-4">Tuesday, April 21</h3>
                
                <div className="space-y-4">
                  {mockSchedule.map((session) => {
                    const isSelected = selectedSession.id === session.id;
                    const is1on1 = session.type === '1-on-1';
                    const isBlocked = session.type === 'Blocked';

                    return (
                      <div 
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`flex gap-6 items-center cursor-pointer group transition-all ${isBlocked ? 'opacity-50' : ''}`}
                      >
                        <div className="w-24 text-right shrink-0">
                          <p className={`text-xl font-medium ${isSelected ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{session.time}</p>
                          <p className="text-sm font-medium text-[#898A8D]">{session.duration}</p>
                        </div>
                        
                        <div className={`flex-1 rounded-3xl p-6 shadow-sm border transition-all ${
                          isSelected ? 'scale-[1.02] shadow-md' : ''
                        } ${
                          is1on1 
                            ? 'bg-[#0B4550] border-[#0B4550] text-white' 
                            : isBlocked
                              ? 'bg-transparent border-dashed border-2 border-gray-300'
                              : 'bg-white border-gray-100 hover:border-[#E6FF2B]'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium mb-3 ${
                                is1on1 ? 'bg-[#E6FF2B] text-[#0B4550]' : 'bg-gray-100 text-[#898A8D]'
                              }`}>
                                {session.type}
                              </span>
                              <h3 className={`text-2xl font-medium mb-1 ${is1on1 ? 'text-white' : 'text-[#0B4550]'}`}>
                                {session.title}
                              </h3>
                              <div className={`flex items-center gap-2 text-lg font-medium ${is1on1 ? 'text-white/70' : 'text-[#898A8D]'}`}>
                                <MapPin size={18} /> {session.location}
                              </div>
                            </div>

                            {!isBlocked && (
                              <div className="flex flex-col items-end">
                                <div className="flex -space-x-3 mb-2">
                                  {session.attendees.slice(0, 3).map((attendee, i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${is1on1 ? 'bg-white text-[#0B4550] border-[#0B4550]' : 'bg-[#F9F7F2] text-[#0B4550] border-white'}`}>
                                      {attendee.avatar}
                                    </div>
                                  ))}
                                </div>
                                <span className={`text-sm font-medium ${is1on1 ? 'text-[#E6FF2B]' : 'text-[#898A8D]'}`}>
                                  {session.capacity} Booked
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-0">
                  <span className="inline-block px-4 py-1.5 rounded-xl bg-gray-100 text-[#898A8D] font-medium text-sm mb-4">
                    {selectedSession.type}
                  </span>
                  <h2 className="text-4xl font-medium text-[#0B4550] mb-6 leading-tight">
                    {selectedSession.title}
                  </h2>
                  
                  <div className="space-y-5 border-b border-gray-100 pb-8 mb-8">
                    <div className="flex items-center gap-4 text-xl font-medium text-[#0B4550]">
                      <Clock className="text-[#898A8D]" size={28} />
                      {selectedSession.time} ({selectedSession.duration})
                    </div>
                    <div className="flex items-center gap-4 text-xl font-medium text-[#0B4550]">
                      <MapPin className="text-[#898A8D]" size={28} />
                      {selectedSession.location}
                    </div>
                  </div>

                  {selectedSession.type !== 'Blocked' ? (
                    <>
                      <div className="flex justify-between items-end mb-6">
                        <h3 className="text-2xl font-medium text-[#0B4550]">Roster</h3>
                        <span className="text-[#898A8D] font-medium text-lg">{selectedSession.capacity}</span>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        {selectedSession.attendees.map((attendee, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-lg font-medium">
                              {attendee.avatar}
                            </div>
                            <span className="text-xl font-medium text-[#0B4550] flex-1">{attendee.name}</span>
                            <button className="text-[#898A8D] hover:text-[#0B4550] p-2">
                              <CheckSquare size={24} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button className="w-full bg-[#0B4550] text-[#E6FF2B] px-6 py-4 rounded-2xl font-medium text-xl hover:bg-[#0B4550]/90 transition-all shadow-md">
                        Mark Attendance
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-xl font-medium text-[#898A8D]">Time block reserved for personal tasks.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}
{/* ================================================================= */}
        {/* VIEW: ANALYTICS */}
        {/* ================================================================= */}
        {activePage === 'Analytics' && (
          <div className="animate-in fade-in duration-500">
            
            {/* Top Filter Row */}
            <div className="flex justify-end items-center mb-8">
              <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
                {['1M', '3M', '6M', '1Y', 'All Time'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-3 gap-5 mb-8">
               <div className="bg-[#0B4550] rounded-3xl p-6 shadow-md">
                 <h3 className="text-white/80 font-medium text-lg mb-2">Net Revenue Growth</h3>
                 <div className="flex items-end gap-3">
                    <h2 className="text-5xl font-medium text-white">+14.2%</h2>
                    <TrendingUp size={24} className="text-[#E6FF2B] mb-2" />
                 </div>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Client Retention Rate</h3>
                 <h2 className="text-5xl font-medium text-[#0B4550]">92.4%</h2>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Avg. Session Attendance</h3>
                 <h2 className="text-5xl font-medium text-[#0B4550]">85%</h2>
               </div>
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-3 gap-8">
              
              {/* Big Growth Chart */}
              <div className="col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-medium text-2xl text-[#0B4550]">Revenue vs. Active Clients</h3>
                </div>
                
                {/* Mock Line Chart Area */}
                <div className="h-64 w-full border-b-2 border-l-2 border-gray-100 relative flex items-end justify-between px-4 pb-0 pt-10">
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                      <path d="M0,200 Q100,180 200,120 T400,100 T600,40 T800,20" fill="none" stroke="#0B4550" strokeWidth="6" strokeLinecap="round" />
                      <path d="M0,220 Q100,210 200,190 T400,150 T600,140 T800,90" fill="none" stroke="#E6FF2B" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                    {/* X-Axis labels */}
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-sm font-medium text-[#898A8D] px-4">
                      <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                    </div>
                </div>
              </div>

              {/* Package Popularity Breakdown */}
              <div className="col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="font-medium text-2xl text-[#0B4550] mb-6">Top Packages</h3>
                
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <div>
                    <div className="flex justify-between text-base font-medium mb-2">
                      <span className="text-[#0B4550]">10 Session Pack</span>
                      <span className="text-[#898A8D]">45%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4"><div className="bg-[#0B4550] h-4 rounded-full" style={{width: '45%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-base font-medium mb-2">
                      <span className="text-[#0B4550]">Monthly Unlimited</span>
                      <span className="text-[#898A8D]">35%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4"><div className="bg-[#898A8D] h-4 rounded-full" style={{width: '35%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-base font-medium mb-2">
                      <span className="text-[#0B4550]">5 Session Pack</span>
                      <span className="text-[#898A8D]">20%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4"><div className="bg-[#E6FF2B] h-4 rounded-full" style={{width: '20%'}}></div></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* --- Helper Components --- */
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-[#F9F7F2] text-[#0B4550] font-medium' : 'text-[#898A8D] font-medium hover:bg-gray-50 hover:text-[#0B4550]'}`}
    >
      {icon}
      <span className="text-lg">{label}</span>
      {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-[#E6FF2B]"></div>}
    </div>
  );
}

function StatCard({ title, value, trend, isPositive }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[150px]">
      <h3 className="text-[#898A8D] font-medium text-lg">{title}</h3>
      <div>
        <h2 className="text-5xl lg:text-6xl font-medium text-[#0B4550] mb-1">{value}</h2>
        <div className={`flex items-center text-base font-medium gap-1.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span>{trend} from last month</span>
        </div>
      </div>
    </div>
  );
}

function ChartBar({ month, height, active }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 md:w-14 lg:w-16 h-36 flex items-end">
        <div className={`w-full rounded-t-xl transition-all ${active ? 'bg-[#898A8D]' : 'bg-[#0B4550]'} ${height}`}></div>
      </div>
      <span className={`text-xl font-medium ${active ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{month}</span>
    </div>
  );
}

function Day({ date, day, active }) {
  return (
    <div className={`flex flex-col items-center justify-center w-14 h-20 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#898A8D] text-white shadow-md' : 'text-[#898A8D] hover:bg-[#F9F7F2]'}`}>
      <span className="text-base mb-1 font-medium">{day}</span>
      <span className={`text-3xl font-medium ${active ? 'text-white' : 'text-[#0B4550]'}`}>{date}</span>
    </div>
  );
}

function TransactionRow({ name, avatar, desc, method, amount }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
      <td className="py-4 w-1/4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-base font-medium shrink-0">{avatar}</div>
          <span className="truncate">{name}</span>
        </div>
      </td>
      <td className="py-4 text-[#898A8D] w-1/4">{desc}</td>
      <td className="py-4 text-[#898A8D] w-1/4">{method}</td>
      <td className="py-4 w-1/6 text-emerald-600 font-medium">{amount}</td>
      <td className="py-4 w-1/12 text-center">
        <button className="p-2 rounded-xl bg-[#F9F7F2] text-[#0B4550] hover:bg-[#E6FF2B] hover:text-[#0B4550] transition-all inline-flex items-center justify-center group relative shadow-sm border border-gray-100">
          <FileText size={22} className="group-hover:hidden" />
          <Download size={22} className="hidden group-hover:block" />
        </button>
      </td>
    </tr>
  );
}