import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Layout } from "@/components/Layout"
import { ArrowLeft, Shield, Building2 } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import apiService from "@/lib/api"

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Auth() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const mode = searchParams.get('mode') || 'login'
  const { t } = useTranslation()

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const form = e.target as HTMLFormElement

    try {
      const res = await fetch(`${API_BASE_URL}/ngo/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngo_name: (form.elements.namedItem('ngo-name') as HTMLInputElement).value,
          primary_contact: {
            name: (form.elements.namedItem('admin-name') as HTMLInputElement).value,
            email: (form.elements.namedItem('admin-email') as HTMLInputElement).value,
            phone: (form.elements.namedItem('admin-phone') as HTMLInputElement).value,
          },
          password: (form.elements.namedItem('admin-password') as HTMLInputElement).value,
          role: 'ngo',
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Registration failed')
      }

      toast({
        title: t('auth.registration_success'),
        description: t('auth.check_email'),
      })
      navigate("/auth?mode=login")
    } catch (error: any) {
      toast({ title: t('auth.registration_failed'), description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Invalid credentials')
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      apiService.setToken(data.token)

      toast({ title: t('auth.welcome_message'), description: t('auth.login_success') })
      navigate("/admin")
    } catch (error: any) {
      toast({ title: t('auth.login_failed'), description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
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
          {t('common.back')}
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
              {mode === 'register' ? t('auth.register_ngo') : t('auth.welcome_back')}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'register' 
                ? t('auth.join_network')
                : t('auth.sign_in_dashboard')
              }
            </p>
          </div>

          {mode === 'login' ? (
            <Card className="border-0 shadow-comfort">
              <CardHeader>
                <CardTitle>{t('auth.ngo_admin_login')}</CardTitle>
                <CardDescription>
                  {t('auth.sign_in_org')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.org_email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('auth.org_email_placeholder')}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t('auth.password_placeholder')}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="trust" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.signing_in') : t('auth.sign_in_button')}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => navigate("/auth?mode=register")}
                    >
                      {t('auth.no_account')}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-sm text-muted-foreground"
                  >
                    {t('auth.forgot_password')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-comfort">
              <CardHeader>
                <CardTitle>{t('auth.ngo_registration')}</CardTitle>
                <CardDescription>
                  {t('auth.register_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ngo-name">{t('auth.ngo_name')}</Label>
                    <Input
                      id="ngo-name"
                      name="ngo-name"
                      placeholder={t('auth.ngo_name_placeholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-name">{t('auth.primary_contact')}</Label>
                    <Input
                      id="admin-name"
                      name="admin-name"
                      placeholder={t('auth.contact_name_placeholder')}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">{t('auth.org_email')}</Label>
                    <Input
                      id="admin-email"
                      name="admin-email"
                      type="email"
                      placeholder={t('auth.org_email_placeholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-phone">{t('auth.contact_phone')}</Label>
                    <Input
                      id="admin-phone"
                      name="admin-phone"
                      type="tel"
                      placeholder={t('auth.phone_placeholder')}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">{t('auth.password')}</Label>
                    <Input
                      id="admin-password"
                      name="admin-password"
                      type="password"
                      placeholder={t('auth.create_password')}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      {t('auth.terms_agree')}
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    variant="trust" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.registering') : t('auth.register_button')}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => navigate("/auth?mode=login")}
                    >
                      {t('auth.have_account')}
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
