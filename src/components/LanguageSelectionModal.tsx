import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Languages } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
]

interface LanguageSelectionModalProps {
  onLanguageSelect: (langCode: string) => void
}

export function LanguageSelectionModal({ onLanguageSelect }: LanguageSelectionModalProps) {
  const { i18n } = useTranslation()

  const selectLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('language', langCode)
    localStorage.setItem('language-selected', 'true')
    onLanguageSelect(langCode)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 p-3 bg-primary-soft rounded-full w-fit">
              <Languages className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose Your Language</h2>
            <p className="text-sm text-muted-foreground">Select your preferred language</p>
          </div>
          
          <div className="space-y-4">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant="outline"
                size="lg"
                className="w-full h-16 text-left justify-start gap-4 text-lg"
                onClick={() => selectLanguage(language.code)}
              >
                <span className="text-3xl">{language.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{language.nativeName}</span>
                  <span className="text-sm text-muted-foreground">{language.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}