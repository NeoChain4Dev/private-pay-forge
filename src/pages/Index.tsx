import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActiveGigs } from "@/components/dashboard/active-gigs"
import { WalletConnect } from "@/components/wallet/wallet-connect"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const navigate = useNavigate()
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-lg p-6 border border-border shadow-card">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Private Pay Forge! 👋
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Your private workspace is secure and ready. All earnings are encrypted end-to-end using FHE technology.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-success">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>All systems secure • Privacy mode active</span>
              </div>
              <Button 
                onClick={() => navigate('/create-gig')}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Gig
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsCards />

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <ActiveGigs />
          <WalletConnect />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
