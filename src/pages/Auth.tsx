import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Layout } from "@/components/Layout"
import { ArrowLeft, Shield, Building2 } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export default function Auth() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const mode = searchParams.get('mode') || 'login' // Default to login if no mode specified

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
          className="absolute top-4 left-4 safe-top"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 p-3 bg-primary-soft rounded-full w-fit">
              {mode === 'register' ? (
                <Building2 className="h-8 w-8 text-primary" />
              ) : (
                <Shield className="h-8 w-8 text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-bold">
              {mode === 'register' ? 'Register Your NGO' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'register' 
                ? 'Join our network of trusted organizations' 
                : 'Sign in to access your admin dashboard'
              }
            </p>
          </div>

          {mode === 'login' ? (
            <Card className="border-0 shadow-comfort">
              <CardHeader>
                <CardTitle>NGO Admin Login</CardTitle>
                <CardDescription>
                  Sign in to your organization dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Organization Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@organization.org"
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
                    {isLoading ? "Signing in..." : "Sign In to Dashboard"}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => navigate("/auth?mode=register")}
                    >
                      Don't have an account? Register your NGO
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-sm text-muted-foreground"
                  >
                    Forgot your password?
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-comfort">
              <CardHeader>
                <CardTitle>NGO Registration</CardTitle>
                <CardDescription>
                  Register your organization to start managing incident reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ngo-name">NGO/Organization Name</Label>
                    <Input
                      id="ngo-name"
                      placeholder="Hope Foundation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration-number">Registration Number</Label>
                    <Input
                      id="registration-number"
                      placeholder="NGO registration or license number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Primary Contact Name</Label>
                    <Input
                      id="admin-name"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Organization Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@hopefoundation.org"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-phone">Contact Phone</Label>
                    <Input
                      id="admin-phone"
                      type="tel"
                      placeholder="+234 xxx xxx xxxx"
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

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms of service and privacy policy
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    variant="trust" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Register NGO"}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => navigate("/auth?mode=login")}
                    >
                      Already have an account? Sign in
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}