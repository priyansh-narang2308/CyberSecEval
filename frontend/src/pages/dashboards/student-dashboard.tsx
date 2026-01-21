import DashboardLayout from '../../components/dashboard-layout';
import { FileText, ClipboardList, BarChart3, Lock, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const stats = [
    { icon: FileText, label: 'Available Exams', value: '3', color: 'text-primary' },
    { icon: ClipboardList, label: 'Completed Exams', value: '5', color: 'text-success' },
    { icon: BarChart3, label: 'Average Score', value: '78%', color: 'text-primary' },
    { icon: Clock, label: 'Upcoming', value: '2', color: 'text-warning' },
  ];

  const upcomingExams = [
    { id: 1, title: 'Cryptography Midterm', date: 'Mar 15, 2024', time: '10:00 AM', duration: '2 hours' },
    { id: 2, title: 'Network Security Quiz', date: 'Mar 18, 2024', time: '2:00 PM', duration: '1 hour' },
  ];

  const recentResults = [
    { id: 1, title: 'Information Security Basics', score: 85, maxScore: 100, date: 'Mar 5, 2024', signed: true },
    { id: 2, title: 'Access Control Systems', score: 72, maxScore: 100, date: 'Feb 28, 2024', signed: true },
  ];

  return (
    <DashboardLayout role="student" userName="John Doe">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John. Your examination portal is secure.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Exams */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Exams</h2>
              <Link to="/dashboard/student/exams" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{exam.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {exam.date} at {exam.time}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Duration: {exam.duration}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">
                      Scheduled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Results</h2>
              <Link to="/dashboard/student/results" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{result.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{result.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {result.score}/{result.maxScore}
                      </p>
                      {result.signed && (
                        <span className="encrypted-badge text-xs">
                          <Shield className="h-3 w-3" />
                          Signed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Security Notice</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All exam data is encrypted end-to-end. Results are digitally signed by faculty to ensure integrity.
                Your session is protected with 256-bit encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
