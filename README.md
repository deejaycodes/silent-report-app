# SafeVoice 🛡️

**Nigeria's First Anonymous FGM & Gender-Based Violence Reporting Platform**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-vercel-url.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> *"Report in Silence. Stay Safe."*

---

## 📖 Overview

SafeVoice is a trauma-informed, mobile-first platform designed to help Nigerian women and children report Female Genital Mutilation (FGM/C), domestic violence, sexual assault, and other forms of gender-based violence **anonymously and safely**.

Built with victim safety as the #1 priority, SafeVoice addresses the critical gap in accessible, culturally-sensitive reporting tools for GBV survivors in Nigeria.

---

## 🎯 The Problem

### Statistics
- **25% of Nigerian women** have experienced FGM (NDHS 2018)
- **30% experience domestic violence** in their lifetime
- **Less than 5%** report to authorities due to:
  - Fear of retaliation
  - Shame and stigma
  - Lack of trust in authorities
  - Language barriers
  - No safe reporting channels

### Why Existing Solutions Fail
- Generic international platforms don't understand Nigerian context
- No multi-language support (English, Yoruba, Hausa, Igbo)
- Not trauma-informed (use corporate language, store dangerous data)
- Require accounts/personal information
- Don't address FGM specifically

---

## ✨ Key Features

### 🔒 **Safety-First Design**
- **100% Anonymous Reporting** - No account, email, or phone required
- **Fake Screen Mode** - Disguise app as calculator if interrupted
- **No Device Storage** - Reports sent directly to NGOs, not stored locally
- **Quick Exit** - Instant app closure for safety

### 🌍 **Cultural Sensitivity**
- **Multi-Language Support** - English, Yoruba, Hausa, Igbo
- **Trauma-Informed Copy** - Addresses shame, fear, family pressure
- **Nigerian Legal Context** - VAPP Act 2015, state-specific laws
- **FGM-Specific Resources** - Medical care, reversal surgery, prevention

### 🚨 **Comprehensive GBV Coverage**
1. **Female Genital Cutting (FGM/C)** - Prevention & survivor support
2. **Domestic Violence** - Physical, emotional, economic abuse
3. **Sexual Assault** - Harassment, unwanted touching, rape
4. **Child Abuse** - Protection for children at risk
5. **Forced Marriage** - Often co-occurs with FGM
6. **Other Harm** - Any safety concern

### 🤖 **AI-Powered Triage**
- Automatic urgency detection (high/medium/low)
- Immediate routing of critical cases
- 24/7 AI chatbot for initial support
- Seamless handoff to human counselors

### 📱 **Victim-Centered Tools**
- **Safety Planning** - Escape plan, documents checklist, emergency bag
- **Legal Rights Education** - Know your rights under Nigerian law
- **Resource Finder** - Nearby shelters, legal aid, medical care
- **SOS Button** - One-tap emergency help
- **Offline Mode** - Draft reports without internet

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack Query
- **Routing:** React Router v6
- **i18n:** react-i18next (4 languages)
- **Mobile:** Capacitor (iOS/Android)
- **Backend:** Node.js + Express + MongoDB
- **AI:** OpenAI GPT-4 for chatbot & triage
- **Deployment:** Vercel (web) + App Store/Play Store (mobile)

### Security & Privacy
- ✅ End-to-end encryption for chat
- ✅ No user tracking or analytics
- ✅ No cookies or local storage of sensitive data
- ✅ TLS/SSL for all API calls
- ✅ No IP address logging
- ✅ Anonymous report submission

---

## 🎨 Design Principles

### 1. **Trauma-Informed**
- Validates feelings ("What happened is not your fault")
- Gives control ("Share only what feels safe")
- Avoids triggering language (no "victim", "perpetrator")
- Structured prompts (not overwhelming open-ended questions)

### 2. **Safety-Conscious**
- No report history (device discovery risk)
- No evidence vault (local storage risk)
- Warnings about contact safety
- Fake screen for quick disguise

### 3. **Culturally Appropriate**
- Uses "Female Genital Cutting" (not just "FGM")
- Addresses family loyalty conflicts
- Acknowledges community stigma
- Provides context-specific resources

### 4. **Accessible**
- 6th-grade reading level
- Visual icons for key actions
- Audio option for illiterate users (planned)
- Works on low-end devices

---

## 📊 Impact Metrics (Planned)

- **Reports Submitted** - Track anonymous reports
- **Response Time** - Average time to NGO review
- **Resource Access** - Users finding nearby help
- **Chat Sessions** - AI + human counselor interactions
- **Safety Plans Created** - Users preparing to leave
- **Legal Rights Views** - Education reach

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/deejaycodes/silent-report-app.git
cd silent-report-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=your_backend_api_url
VITE_OPENAI_API_KEY=your_openai_key
```

### Build for Production

```bash
npm run build
```

### Mobile App (iOS/Android)

```bash
# Sync with Capacitor
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

---

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout with safe areas
│   ├── Navigation.tsx  # Bottom navigation
│   └── IncidentCard.tsx # Incident type selector
├── pages/              # Route pages
│   ├── Landing.tsx     # Landing page
│   ├── Dashboard.tsx   # Incident selection
│   ├── Report.tsx      # Report form
│   ├── ReportConfirmation.tsx # Post-submission
│   ├── Chat.tsx        # AI/counselor chat
│   ├── Resources.tsx   # Find help + rights + safety plan
│   ├── SafetyCenter.tsx # SOS + fake screen
│   ├── Auth.tsx        # NGO login/register
│   ├── AdminDashboard.tsx # NGO case management
│   └── NGOPortal.tsx   # NGO landing page
├── i18n/               # Internationalization
│   ├── config.ts       # i18n setup
│   └── locales/        # Translation files
│       ├── en.json     # English
│       ├── yo.json     # Yoruba
│       ├── ha.json     # Hausa
│       └── ig.json     # Igbo
├── lib/                # Utilities
│   ├── api.ts          # API service
│   └── utils.ts        # Helper functions
└── App.tsx             # Root component
```

---

## 🌐 Internationalization

### Supported Languages
- 🇬🇧 **English** - Primary language
- 🇳🇬 **Yoruba** - Southwestern Nigeria
- 🇳🇬 **Hausa** - Northern Nigeria
- 🇳🇬 **Igbo** - Southeastern Nigeria

### Translation Coverage
- ✅ Landing page
- ✅ Dashboard (incident selection)
- ✅ Report form
- ✅ Confirmation page
- ✅ Navigation
- ✅ Common UI elements
- ⏳ Resources (English only for now)
- ⏳ Chat (English only for now)

---

## 🤝 NGO Portal

### Features for Partner Organizations
- **Case Management Dashboard** - View and triage reports
- **AI Urgency Scoring** - Automatic prioritization
- **Secure Messaging** - Contact victims (if they opt-in)
- **Resource Directory** - Manage service listings
- **Analytics** - Track response times, case outcomes
- **Multi-User Access** - Role-based permissions

### Partner NGOs (Planned)
- FIDA Nigeria
- Women's Rights Advancement and Protection Alternative (WRAPA)
- Project Alert on Violence Against Women
- Equality Now Nigeria
- NAPTIP (National Agency for the Prohibition of Trafficking in Persons)

---

## 📱 Mobile App Features

### iOS/Android Native
- ✅ Push notifications (opt-in)
- ✅ Biometric authentication (for NGO portal)
- ✅ Safe area handling (notch/Dynamic Island)
- ✅ Offline mode
- ✅ Share to app (evidence upload)
- ⏳ Background location sharing (emergency only)

---

## 🔐 Privacy & Security

### What We DON'T Collect
- ❌ No names or personal identifiers
- ❌ No IP addresses
- ❌ No device fingerprinting
- ❌ No location tracking (unless emergency SOS)
- ❌ No browsing history
- ❌ No analytics or cookies

### What We DO Collect (Optional)
- ✅ Report content (anonymous)
- ✅ Contact info (only if victim provides)
- ✅ Location (state level only, for resource matching)
- ✅ Chat transcripts (encrypted, for quality assurance)

### Data Retention
- Reports: Stored securely on NGO servers
- Chat logs: Deleted after 90 days
- User accounts: NGO portal only (not for victims)

---

## 🧪 Testing

### Domain Expert Validation
- ✅ Reviewed by GBV counselors
- ✅ Trauma-informed design audit
- ✅ Security penetration testing (planned)
- ✅ Low-literacy user testing (planned)

### Technical Testing
```bash
# Run tests
npm test

# E2E tests
npm run test:e2e

# Accessibility audit
npm run test:a11y
```

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Anonymous reporting
- [x] Multi-language support (4 languages)
- [x] AI chatbot
- [x] Resource finder
- [x] NGO portal
- [x] Safety center
- [x] Legal rights information
- [x] Safety planning tool

### Phase 2: Enhancement (Q2 2026)
- [ ] Audio/voice-to-text for illiterate users
- [ ] Offline mode (full functionality)
- [ ] Trusted contact system
- [ ] FGM-specific resource database
- [ ] Community verification for NGOs
- [ ] iOS/Android app launch

### Phase 3: Scale (Q3 2026)
- [ ] Expand to other West African countries
- [ ] Peer support groups
- [ ] Success stories (anonymized)
- [ ] Self-care resources
- [ ] Integration with government systems (NAPTIP)

---

## 📚 Documentation

- [Copy Recommendations](COPY_RECOMMENDATIONS.md) - Trauma-informed writing guide
- [Functionality Audit](FUNCTIONALITY_AUDIT.md) - Domain expert analysis
- [API Documentation](docs/API.md) - Backend endpoints (coming soon)
- [Deployment Guide](docs/DEPLOYMENT.md) - Production setup (coming soon)

---

## 🤝 Contributing

We welcome contributions from:
- **Developers** - Bug fixes, features, translations
- **Designers** - UI/UX improvements, accessibility
- **Domain Experts** - GBV counselors, legal experts, survivors
- **Translators** - Additional Nigerian languages

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct
- Be respectful and empathetic
- Prioritize victim safety in all decisions
- Maintain confidentiality
- Follow trauma-informed principles

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Inspiration
- Chayn (UK-based GBV tech platform)
- Bright Sky (Domestic abuse app)
- RAINN (US sexual assault hotline)

### Research & Guidelines
- WHO Clinical Handbook for FGM
- IASC Guidelines for GBV Interventions
- UNFPA Survivor-Centered Approach
- Nigeria VAPP Act 2015

### Special Thanks
- GBV counselors who reviewed the platform
- FGM survivors who shared their experiences
- Nigerian NGOs fighting gender-based violence

---

## 📞 Contact

**Developer:** Deji  
**Email:** [your-email@example.com]  
**GitHub:** [@deejaycodes](https://github.com/deejaycodes)  
**LinkedIn:** [Your LinkedIn]

**For NGO Partnerships:** partnerships@safevoice.ng (coming soon)  
**For Press Inquiries:** press@safevoice.ng (coming soon)

---

## ⚠️ Disclaimer

SafeVoice is a reporting and resource platform. We are not a substitute for:
- Emergency services (call 112 or 199 in Nigeria)
- Medical care
- Legal representation
- Professional counseling

If you are in immediate danger, please contact local emergency services.

---

## 🌟 Support This Project

If you believe in ending gender-based violence in Nigeria:
- ⭐ Star this repository
- 🔄 Share with NGOs and advocates
- 💬 Provide feedback
- 🤝 Contribute code or translations
- 📢 Spread awareness

**Together, we can make Nigeria safer for women and children.**

---

*Built with ❤️ for Nigerian women and children*
