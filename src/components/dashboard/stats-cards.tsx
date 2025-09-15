import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Briefcase, Shield, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function StatsCards() {
  const [showEarnings, setShowEarnings] = useState(false)

  const stats = [
    {
      title: "Total Earnings",
      value: showEarnings ? "$12,456.78" : "••••••••",
      description: "Encrypted balance",
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Active Gigs",
      value: "7",
      description: "Currently working",
      icon: Briefcase,
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Completed Projects",
      value: "42",
      description: "This month",
      icon: TrendingUp,
      trend: "+8",
      trendUp: true,
    },
    {
      title: "Privacy Score",
      value: "98%",
      description: "Maximum protection",
      icon: Shield,
      trend: "+2%",
      trendUp: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {stat.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {stat.title === "Total Earnings" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowEarnings(!showEarnings)}
                >
                  {showEarnings ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </Button>
              )}
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  stat.trendUp 
                    ? "bg-success/20 text-success" 
                    : "bg-destructive/20 text-destructive"
                }`}
              >
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}