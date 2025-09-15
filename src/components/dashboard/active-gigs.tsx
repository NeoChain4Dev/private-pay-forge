import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, DollarSign, User, MoreHorizontal } from "lucide-react"

const activeGigs = [
  {
    id: 1,
    title: "E-commerce Website Development",
    client: "TechCorp Inc.",
    budget: "$2,500",
    encrypted: "••••••",
    progress: 75,
    deadline: "Dec 15, 2024",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    client: "StartupXYZ",
    budget: "$1,800",
    encrypted: "••••••",
    progress: 45,
    deadline: "Dec 20, 2024",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: 3,
    title: "API Integration & Testing",
    client: "CloudSoft Ltd.",
    budget: "$950",
    encrypted: "••••••",
    progress: 20,
    deadline: "Dec 25, 2024",
    status: "Starting",
    priority: "Low",
  },
]

export function ActiveGigs() {
  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Active Gigs</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your current projects with encrypted payment details
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeGigs.map((gig) => (
          <div
            key={gig.id}
            className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{gig.title}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {gig.client}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {gig.deadline}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary"
                  className={`text-xs ${
                    gig.priority === "High" 
                      ? "bg-destructive/20 text-destructive" 
                      : gig.priority === "Medium"
                      ? "bg-warning/20 text-warning"
                      : "bg-success/20 text-success"
                  }`}
                >
                  {gig.priority}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{gig.progress}%</span>
              </div>
              <Progress value={gig.progress} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground">
                  {gig.encrypted}
                </span>
                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                  Encrypted
                </Badge>
              </div>
              <Badge 
                variant="secondary"
                className={`text-xs ${
                  gig.status === "In Progress" 
                    ? "bg-info/20 text-info" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {gig.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}