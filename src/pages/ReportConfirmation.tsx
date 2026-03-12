import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, FileText, MessageCircle, MapPin, Home, Heart, Shield, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useState } from "react"

export default function ReportConfirmation() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showSafetyCheck, setShowSafetyCheck] = useState(true)

  return (
    <Layout className="pb-20">
      <div className="px-4 py-8 max-w-lg mx-auto space-y-8">
        {/* Success Message */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              {t('confirmation.thank_you')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('confirmation.report_sent')}
            </p>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              {t('confirmation.review_notice')}
            </p>
          </div>
        </div>

        {/* Safety Check */}
        {showSafetyCheck && (
          <Card className="border-2 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
              <h3 className="text-xl font-semibold">{t('confirmation.safety_check')}</h3>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setShowSafetyCheck(false)
                    navigate("/chat")
                  }}
                >
                  {t('confirmation.need_help_now')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowSafetyCheck(false)}
                >
                  {t('confirmation.safe_for_now')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* What to do next */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center">{t('confirmation.what_next')}</h2>
          
          <div className="space-y-4">
            {/* Submit Another Report */}
            <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/dashboard")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t('confirmation.report_something_else')}</h3>
                  <p className="text-sm text-muted-foreground">{t('confirmation.report_another_description')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Talk to Someone */}
            <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/chat")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                  <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t('confirmation.talk_to_someone')}</h3>
                  <p className="text-sm text-muted-foreground">{t('confirmation.talk_description')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Find Help Nearby */}
            <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/resources")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full">
                  <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t('confirmation.find_help_nearby')}</h3>
                  <p className="text-sm text-muted-foreground">{t('confirmation.help_description')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Learn Rights */}
            <Card className="border-2 border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800 cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/resources")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-800 rounded-full">
                  <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t('confirmation.learn_rights')}</h3>
                  <p className="text-sm text-muted-foreground">{t('confirmation.rights_description')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Go Home */}
            <Card className="border-2 border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Home className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t('confirmation.go_to_main')}</h3>
                  <p className="text-sm text-muted-foreground">{t('confirmation.main_description')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reassurance Message */}
        <Card className="border-0 shadow-soft bg-gradient-calm">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-lg font-medium mb-2">{t('confirmation.reassurance')}</p>
            <p className="text-sm text-muted-foreground">
              {t('confirmation.safety_message')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </Layout>
  )
}