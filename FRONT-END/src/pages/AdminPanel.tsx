import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import { 
  Users, 
  MessageCircle, 
  Settings, 
  BarChart3,
  UserCheck,
  Tags,
  Shield,
  TrendingUp,
  Calendar,
  Activity,
  Database,
  Server,
  Download,
  Trash2,
  AlertTriangle,
  HardDrive
} from "lucide-react";
import UsersManagement from "@/components/admin/UsersManagement";
import QuestionsManagement from "@/components/admin/QuestionsManagement";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import UpgradeRequests from "@/components/admin/UpgradeRequests";
import AdminStats from "@/components/admin/AdminStats";
import { api } from "@/lib/api";
import SystemManagement from '@/components/admin/SystemManagement';
import DatabaseManagement from '@/components/admin/DatabaseManagement';

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  const [overviewStats, setOverviewStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    activeToday: 0,
    pendingUpgrades: 0,
    avgResponseTime: '0h'
  });

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const data = await api.dashboard.adminStats();
        setOverviewStats({
          totalUsers: data.stats.totalUsers,
          totalQuestions: data.stats.totalQuestions,
          totalAnswers: data.stats.totalTickets, // Using tickets as answers for now
          activeToday: data.stats.totalAgents,
          pendingUpgrades: data.stats.pendingUpgradeRequests,
          avgResponseTime: '2h' // Placeholder
        });
      } catch (err) {
        // Keep default values on error
        console.error('Failed to fetch overview stats:', err);
      }
    };

    if (user?.role === 'admin') {
      fetchOverviewStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, content, and system settings.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-muted p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Questions</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Tags className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Upgrades</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Server className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="card-elegant hover-lift">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{overviewStats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
              
              <Card className="card-elegant hover-lift">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">{overviewStats.totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </CardContent>
              </Card>
              
              <Card className="card-elegant hover-lift">
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">{overviewStats.totalAnswers}</p>
                  <p className="text-sm text-muted-foreground">Answers</p>
                </CardContent>
              </Card>
              
              <Card className="card-elegant hover-lift">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{overviewStats.activeToday}</p>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                </CardContent>
              </Card>
              
              <Card className="card-elegant hover-lift">
                <CardContent className="p-4 text-center">
                  <UserCheck className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">{overviewStats.pendingUpgrades}</p>
                  <p className="text-sm text-muted-foreground">Pending Upgrades</p>
                </CardContent>
              </Card>
              
              <Card className="card-elegant hover-lift">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">{overviewStats.avgResponseTime}</p>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                </CardContent>
              </Card>
            </div>

            <AdminStats />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="animate-fade-in">
            <UsersManagement />
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="animate-fade-in">
            <QuestionsManagement />
          </TabsContent>

          {/* Upgrade Requests Tab */}
          <TabsContent value="upgrades" className="animate-fade-in">
            <UpgradeRequests />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="animate-fade-in">
            <CategoriesManagement />
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="animate-fade-in">
            <DatabaseManagement />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="animate-fade-in">
            <SystemManagement />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="animate-fade-in">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-primary" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Settings Panel</h3>
                  <p className="text-muted-foreground">
                    System settings management will be implemented here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}