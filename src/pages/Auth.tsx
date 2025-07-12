import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Layout } from "@/components/Layout"
import { ArrowLeft, Shield, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export default function Auth() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Account created successfully!",
      description: "Welcome to Safe Haven. You can now report incidents and access support.",
    })
    
    setIsLoading(false)
    navigate("/dashboard")
  }

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Admin account created successfully!",
      description: "Welcome to Safe Haven Admin Dashboard.",
    })
    
    setIsLoading(false)
    navigate("/admin")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in to your admin dashboard.",
    })
    
    setIsLoading(false)
    navigate("/admin")
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="absolute top-4 left-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 p-3 bg-primary-soft rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Join Safe Haven</h1>
            <p className="text-muted-foreground">Secure access to support and resources</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-comfort">
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email or Phone</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email or phone"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="trust" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    <Button
                      type="button"
                      variant="link"
                      className="w-full text-sm"
                    >
                      Forgot your password?
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-0 shadow-comfort">
                <CardHeader>
                  <CardTitle>NGO Admin Signup</CardTitle>
                  <CardDescription>
                    Register your organization to manage reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ngo-name">NGO Name</Label>
                      <Input
                        id="ngo-name"
                        placeholder="Enter organization name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-name">Admin Name</Label>
                      <Input
                        id="admin-name"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Organization Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@organization.org"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-phone">Phone Number</Label>
                      <Input
                        id="admin-phone"
                        type="tel"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Create a secure password"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="trust" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Register NGO"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}