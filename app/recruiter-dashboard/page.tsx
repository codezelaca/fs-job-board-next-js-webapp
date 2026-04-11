import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  CalendarDays, 
  TrendingUp,
  ArrowUpRight,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function RecruiterDashboardPage() {
  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-12 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Welcome back, <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Jane!</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Here's an overview of your recruiting activities today.
        </p>
      </div>

      {/* KPI Cards (Bento Box Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2 this week
            </span>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Active Jobs</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">12</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15 today
            </span>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">New Applications</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">48</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-violet-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Interviews Scheduled</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">8</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>

        {/* Card 4 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full">
              3 unread
            </span>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Messages</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">24</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Applications list */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Applications</h2>
            <Link href="/recruiter-dashboard/applications" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center transition-colors">
              View all <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {/* Dummy Item 1 */}
            <div className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                  AS
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Alice Smith</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Applied for Frontend Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> 2h ago
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  In Review
                </span>
              </div>
            </div>

            {/* Dummy Item 2 */}
            <div className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
                  MJ
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Michael Johnson</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Applied for Backend Engineer</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> 5h ago
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  New
                </span>
              </div>
            </div>

            {/* Dummy Item 3 */}
            <div className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                  SJ
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Sarah Jones</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Applied for Product Designer</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> 1d ago
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Interviewed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">Post a New Job</h3>
            <p className="text-indigo-100 text-sm mb-6">
              Attract top talent from CCA by publishing a new opportunity to the board.
            </p>
            <Link 
              href="/post-job" 
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 font-medium rounded-xl transition-colors shadow-sm"
            >
              Draft Job Post
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/recruiter-dashboard/jobs" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between group">
                  Active Listings
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded text-xs group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">12</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between group">
                  Drafts
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded text-xs group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">3</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between group">
                  Closed Jobs
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded text-xs group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">45</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
