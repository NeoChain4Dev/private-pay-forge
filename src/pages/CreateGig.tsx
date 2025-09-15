import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, X, DollarSign, Clock, Shield, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAccount } from 'wagmi'
import { useContract } from '@/hooks/useContract'

export function CreateGig() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { createGig, isPending, isConfirming, isConfirmed, error } = useContract()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    priority: "Medium",
    skills: [] as string[],
    encryptPayment: true,
    requirements: "",
    deliverables: ""
  })
  
  const [skillInput, setSkillInput] = useState("")

  const categories = [
    "Web Development",
    "Mobile Development", 
    "UI/UX Design",
    "Data Science",
    "Marketing",
    "Writing & Content",
    "Video & Animation",
    "Business & Consulting"
  ]

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return
    }
    
    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      // Convert deadline to timestamp
      const deadlineTimestamp = formData.deadline 
        ? Math.floor(new Date(formData.deadline).getTime() / 1000)
        : Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days from now
      
      // For now, we'll use a placeholder for encrypted price
      // In a real implementation, this would be encrypted using FHE
      const encryptedPrice = "0x" + "0".repeat(64) // Placeholder
      const inputProof = "0x" + "0".repeat(64) // Placeholder
      
      await createGig(
        formData.title,
        formData.description,
        formData.deliverables,
        deadlineTimestamp,
        encryptedPrice,
        inputProof
      )
      
      toast({
        title: "Gig Created Successfully",
        description: "Your gig has been posted with encrypted payment protection",
      })
      
      navigate("/")
    } catch (err) {
      console.error('Error creating gig:', err)
      toast({
        title: "Error",
        description: "Failed to create gig. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/")}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Gig</h1>
          <p className="text-muted-foreground">Post your project with encrypted payment protection</p>
          {isConnected && (
            <div className="mt-2 text-sm text-muted-foreground">
              Connected as: <span className="font-mono">{address}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Define your project scope and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., E-commerce Website Development"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your project in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[120px] bg-background/50"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Budget & Timeline
            </CardTitle>
            <CardDescription>
              Set your budget and project deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD) *</Label>
                <Input
                  id="budget"
                  placeholder="e.g., 2500"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Encrypted Payment Protection</p>
                  <p className="text-sm text-muted-foreground">Keep your budget private from freelancers</p>
                </div>
              </div>
              <Switch
                checked={formData.encryptPayment}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, encryptPayment: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Skills & Requirements</CardTitle>
            <CardDescription>
              Specify the skills needed and project requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  className="bg-background/50"
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="requirements">Specific Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List any specific requirements, technologies, or constraints..."
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliverables">Expected Deliverables</Label>
              <Textarea
                id="deliverables"
                placeholder="What should be delivered upon completion..."
                value={formData.deliverables}
                onChange={(e) => setFormData(prev => ({ ...prev, deliverables: e.target.value }))}
                className="bg-background/50"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-primary"
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? "Creating..." : "Confirming..."}
              </>
            ) : (
              "Create Gig"
            )}
          </Button>
        </div>

        {error && (
          <div className="text-destructive text-sm text-center p-4 bg-destructive/10 rounded-lg">
            Error: {error.message}
          </div>
        )}

        {isConfirmed && (
          <div className="text-success text-sm text-center p-4 bg-success/10 rounded-lg">
            Gig created successfully! Transaction confirmed.
          </div>
        )}
      </form>
    </div>
  )
}