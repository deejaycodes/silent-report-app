import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Phone, Shield, Calculator, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

const hotlines = [
  { name: 'Emergency Services', desc: 'Police, Ambulance, Fire', number: '112', tel: '112' },
  { name: 'Police Emergency', desc: 'Nigeria Police Force', number: '199', tel: '199' },
  { name: 'NAPTIP Hotline', desc: 'Trafficking & GBV', number: '0800-033-3333', tel: '08000333333' },
  { name: 'Child Helpline', desc: 'Child protection', number: '6700', tel: '6700' },
]

const safetyTips = [
  { emoji: '🔒', title: 'Clear your browser history', desc: 'After using this app on a browser' },
  { emoji: '📱', title: 'Use a safe device', desc: "Don't use a device your abuser can access" },
  { emoji: '🚪', title: 'Have an exit plan', desc: 'Know where you can go quickly' },
  { emoji: '👥', title: 'Tell someone you trust', desc: 'Let someone know you need help' },
]

export default function SafetyCenter() {
  const [showFakeScreen, setShowFakeScreen] = useState(false)

  if (showFakeScreen) {
    return (
      <div className="min-h-screen bg-white p-4" onClick={() => setShowFakeScreen(false)}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Calculator className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-700">Calculator</h1>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-right">
            <div className="text-4xl font-mono text-gray-800">0</div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','=','+'].map(btn => (
              <button key={btn} className="bg-gray-200 p-5 rounded-xl text-xl font-semibold text-gray-700 active:bg-gray-300">{btn}</button>
            ))}
          </div>
          <p className="text-[10px] text-gray-300 text-center mt-6">Tap anywhere to return</p>
        </div>
      </div>
    )
  }

  return (
    <Layout className="pb-24">
      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Safety Center</h1>
          <p className="text-sm text-muted-foreground">Quick safety tools and emergency help</p>
        </div>

        {/* SOS — direct call */}
        <a href="tel:112" className="block p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-3 shadow-lg">
            <Phone className="h-7 w-7 text-white" />
          </div>
          <p className="text-lg font-bold text-red-800 dark:text-red-200">Call Emergency (112)</p>
          <p className="text-xs text-red-600/80 mt-1">Tap to call immediately</p>
        </a>

        {/* Quick Exit */}
        <div className="border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Quick Exit</p>
              <p className="text-xs text-muted-foreground">Hide this app if someone comes near</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFakeScreen(true)}>
              <Calculator className="h-4 w-4 mr-1.5" /> Hide App
            </Button>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Looks like a calculator</span>
            <span className="flex items-center gap-1"><EyeOff className="h-3 w-3" /> Tap to return</span>
          </div>
        </div>

        {/* Hotlines */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Emergency Hotlines</p>
          {hotlines.map(h => (
            <a key={h.tel} href={`tel:${h.tel}`}
              className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-accent/50 transition-colors">
              <div>
                <p className="text-sm font-medium">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.desc}</p>
              </div>
              <span className="text-sm font-bold text-primary">{h.number}</span>
            </a>
          ))}
        </div>

        {/* Safety Tips */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Safety Tips</p>
          <div className="grid grid-cols-2 gap-2">
            {safetyTips.map(tip => (
              <div key={tip.title} className="p-3 bg-muted/50 rounded-xl">
                <span className="text-lg">{tip.emoji}</span>
                <p className="text-xs font-medium mt-1">{tip.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Navigation />
    </Layout>
  )
}
