import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  DollarSign, 
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Pause
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const projects = [
  {
    id: 1,
    title: "E-commerce Website Development",
    client: "TechCorp Inc.",
    status: "In Progress",
    progress: 75,
    budget: 2500,
    encrypted: "••••••",
    deadline: "2024-12-15",
    priority: "High",
    category: "Web Development",
    freelancer: "John Smith",
    startDate: "2024-11-01"
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    client: "StartupXYZ",
    status: "In Progress", 
    progress: 45,
    budget: 1800,
    encrypted: "••••••",
    deadline: "2024-12-20",
    priority: "Medium",
    category: "UI/UX Design",
    freelancer: "Sarah Johnson",
    startDate: "2024-11-05"
  },
  {
    id: 3,
    title: "API Integration & Testing",
    client: "CloudSoft Ltd.",
    status: "Starting",
    progress: 20,
    budget: 950,
    encrypted: "••••••", 
    deadline: "2024-12-25",
    priority: "Low",
    category: "Backend Development",
    freelancer: "Mike Chen",
    startDate: "2024-11-10"
  },
  {
    id: 4,
    title: "Marketing Campaign Strategy",
    client: "BrandCorp",
    status: "Completed",
    progress: 100,
    budget: 1200,
    encrypted: "••••••",
    deadline: "2024-11-30",
    priority: "Medium",
    category: "Marketing",
    freelancer: "Emma Wilson",
    startDate: "2024-10-15"
  },
  {
    id: 5,
    title: "Data Analysis Dashboard",
    client: "Analytics Pro",
    status: "On Hold",
    progress: 60,
    budget: 3200,
    encrypted: "••••••",
    deadline: "2024-12-18",
    priority: "High",
    category: "Data Science",
    freelancer: "David Lee",
    startDate: "2024-10-20"
  }
]

export function Projects() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "In Progress":
        return <Clock className="w-4 h-4 text-info" />
      case "On Hold":
        return <Pause className="w-4 h-4 text-warning" />
      case "Starting":
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/20 text-success"
      case "In Progress":
        return "bg-info/20 text-info"
      case "On Hold":
        return "bg-warning/20 text-warning"
      case "Starting":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/20 text-destructive"
      case "Medium":
        return "bg-warning/20 text-warning"
      case "Low":
        return "bg-success/20 text-success"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.freelancer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    const matchesCategory = filterCategory === "all" || project.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getProjectsByStatus = (status: string) => {
    return projects.filter(p => p.status === status)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground">Manage all your gigs and track progress</p>
        </div>
        <Button 
          onClick={() => navigate("/create-gig")}
          className="bg-gradient-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Gig
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({getProjectsByStatus("In Progress").length})</TabsTrigger>
          <TabsTrigger value="starting">Starting ({getProjectsByStatus("Starting").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({getProjectsByStatus("Completed").length})</TabsTrigger>
          <TabsTrigger value="on-hold">On Hold ({getProjectsByStatus("On Hold").length})</TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects, clients, or freelancers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48 bg-background/50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Starting">Starting</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-background/50">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
              <SelectItem value="Backend Development">Backend Development</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-4">
          <ProjectGrid projects={filteredProjects} />
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          <ProjectGrid projects={getProjectsByStatus("In Progress")} />
        </TabsContent>
        
        <TabsContent value="starting" className="space-y-4">
          <ProjectGrid projects={getProjectsByStatus("Starting")} />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <ProjectGrid projects={getProjectsByStatus("Completed")} />
        </TabsContent>
        
        <TabsContent value="on-hold" className="space-y-4">
          <ProjectGrid projects={getProjectsByStatus("On Hold")} />
        </TabsContent>
      </Tabs>
    </div>
  )

  function ProjectGrid({ projects: projectList }: { projects: typeof projects }) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projectList.map((project) => (
          <Card key={project.id} className="bg-gradient-card border-border shadow-card hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground line-clamp-2">{project.title}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    {project.category}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Cancel Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className={`text-xs ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status}</span>
                </Badge>
                <Badge variant="secondary" className={`text-xs ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Client:</span>
                  </div>
                  <span className="text-foreground font-medium">{project.client}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Freelancer:</span>
                  </div>
                  <span className="text-foreground font-medium">{project.freelancer}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Deadline:</span>
                  </div>
                  <span className="text-foreground">{project.deadline}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-foreground">{project.encrypted}</span>
                  <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                    Encrypted
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}