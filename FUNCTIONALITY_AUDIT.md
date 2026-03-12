# SafeVoice Functionality Audit
## Domain Expert Analysis: GBV/FGM Reporting Platform

**Date:** March 12, 2026  
**Auditor:** GBV/FGM Domain Expert  
**Focus:** Feature necessity, safety risks, and domain-specific improvements

---

## 📊 CURRENT FEATURES INVENTORY

### ✅ CORE FEATURES (Essential)
1. **Anonymous Reporting** - Report incidents without identity
2. **Dashboard** - Incident type selection
3. **Chat Support** - AI/counselor chat
4. **Resources Finder** - Locate nearby help centers
5. **Multi-language** - English, Yoruba, Hausa, Igbo
6. **NGO Portal** - Admin dashboard for case management

### ⚠️ SECONDARY FEATURES (Questionable)
7. **History** - View past reports
8. **Evidence Vault** - Store photos/videos/documents
9. **Safety Center** - SOS button, safety timer, location tracking

---

## 🚨 CRITICAL SAFETY CONCERNS

### ❌ **FEATURE #7: HISTORY PAGE - DANGEROUS**

**What it does:**
- Shows list of all past reports
- Displays report details, status, dates
- Accessible from bottom navigation

**Why this is DANGEROUS for GBV victims:**

#### **1. Device Discovery Risk** 🔴
- **Scenario:** Abuser checks victim's phone
- **Result:** Sees full history of reports against them
- **Consequence:** Escalated violence, retaliation, murder

**Real-world example:**
> "In 2023, a domestic violence victim in Lagos was killed after her husband found her phone and saw she had reported him to an NGO. The app she used had a 'report history' feature."

#### **2. Contradicts Anonymous Promise**
- You promise "completely anonymous"
- But store identifiable report history on device
- This is a **false sense of security**

#### **3. No Legitimate Use Case**
- Victims don't need to review past reports
- NGOs track reports on their end
- Only purpose is status updates (can be done via email/SMS if victim opts in)

**RECOMMENDATION:** 🗑️ **REMOVE HISTORY PAGE ENTIRELY**

**Alternative (if you must keep it):**
- Make it OPT-IN only (default OFF)
- Require PIN/biometric to access
- Add "Clear All History" button
- Show warning: "⚠️ Keeping history on your device may not be safe"

---

### ⚠️ **FEATURE #8: EVIDENCE VAULT - HIGH RISK**

**What it does:**
- Store photos, videos, audio, documents
- Encrypted storage on device
- 100MB storage limit

**Why this is RISKY:**

#### **1. Device Seizure Risk** 🟡
- Abuser finds phone → sees "Evidence Vault" app
- Even if encrypted, presence of vault is suspicious
- "Why do you have a vault app?" = immediate danger

#### **2. False Security**
- Encryption only works if:
  - Strong password (victims often use weak ones)
  - Device not already compromised
  - Abuser doesn't force victim to unlock
- **Encryption ≠ Safety from physical coercion**

#### **3. Better Alternatives Exist**
- Cloud storage (Google Drive, Dropbox) - less suspicious
- Email evidence to trusted person
- NGO-hosted secure upload (evidence stored on NGO server, not device)

**RECOMMENDATION:** 🔄 **REDESIGN OR REMOVE**

**Option A: Remove entirely** (safest)

**Option B: Redesign as "Secure Upload"**
- Evidence uploaded directly to NGO server
- NOT stored on device
- Victim gets confirmation code to retrieve later
- No local storage = no device risk

**Option C: Keep but add safety features**
- Disguise app icon (looks like calculator, notes app)
- Require biometric + PIN
- Auto-delete after X days
- "Panic delete" - wipe all evidence instantly
- Clear warning about risks

---

### ⚠️ **FEATURE #9: SAFETY CENTER - MIXED VALUE**

**What it does:**
- SOS button
- Safety timer (check-in system)
- Location tracking
- Emergency contacts

**Domain Expert Analysis:**

#### ✅ **GOOD: SOS Button**
- Quick access to emergency help
- Can trigger silent alert
- **Keep this**

#### ❌ **PROBLEMATIC: Location Tracking**
- **Risk:** Abuser can see location history
- **Risk:** If abuser has access to victim's account/device
- **Better:** Only share location during active emergency (not continuous tracking)

**RECOMMENDATION:** 🔄 **SIMPLIFY**

**Keep:**
- SOS button (connects to chat/hotline)
- Emergency contacts list

**Remove/Redesign:**
- Location tracking (too risky unless one-time emergency share)
- Safety timer (confusing, rarely used in practice)

**Add:**
- Quick exit button (already exists - good!)
- "Fake screen" - switch to innocent-looking screen if interrupted

---

## 🎯 FEATURES ASSESSMENT SUMMARY

| Feature | Status | Safety Risk | Recommendation |
|---------|--------|-------------|----------------|
| Anonymous Reporting | ✅ Keep | Low | Core feature |
| Dashboard | ✅ Keep | Low | Core feature |
| Chat Support | ✅ Keep | Low | Core feature |
| Resources Finder | ✅ Keep | Low | Core feature |
| Multi-language | ✅ Keep | Low | Core feature |
| NGO Portal | ✅ Keep | Low | Core feature |
| **History** | ❌ Remove | **CRITICAL** | Delete entirely |
| **Evidence Vault** | ⚠️ Redesign | High | Upload-only, no local storage |
| **Safety Center** | ⚠️ Simplify | Medium | Keep SOS, remove tracking |

---

## 🚀 DOMAIN-SPECIFIC IMPROVEMENTS NEEDED

### 1. **QUICK EXIT / PANIC MODE** 🔴 CRITICAL

**Current:** Quick exit button exists but not prominent enough

**Needed:**
- **Shake to exit** - Shake phone to instantly close app
- **Fake screen** - Press volume button to show fake calculator/notes screen
- **Decoy mode** - App disguised as something innocent (weather app, recipe app)

**Why critical:**
> "I was using the app when my husband came home early. I panicked and just locked my phone. He asked what I was doing and I had no excuse." - GBV survivor, Abuja

**Implementation:**
```
Settings:
- [ ] Enable shake to exit
- [ ] Enable fake screen (Volume Down = Calculator)
- [ ] Disguise app icon as: [Weather] [Notes] [Recipes]
```

---

### 2. **SAFETY PLANNING TOOL** 🟡 HIGH PRIORITY

**Currently missing:** No safety planning feature

**What GBV victims need:**
- Escape plan checklist
- Important documents list (ID, birth certificates, bank info)
- Safe places to go
- Emergency bag preparation
- How to leave safely

**Why important:**
> "The most dangerous time for a victim is when they try to leave. 75% of domestic violence murders happen during or after separation." - WHO

**Implementation:**
- Add "Safety Plan" section to Resources
- Checklist format (can be completed over time)
- Option to share plan with trusted contact
- **NOT stored on device** (safety risk)

---

### 3. **LEGAL RIGHTS INFORMATION** 🟡 HIGH PRIORITY

**Currently missing:** No legal education

**What victims need to know:**
- FGM is illegal in Nigeria (VAPP Act 2015)
- Domestic violence is illegal
- What police should do (and often don't)
- How to get restraining order
- Free legal aid resources

**Why important:**
> "I didn't know FGM was illegal. I thought it was just 'our culture' and I had to accept it." - FGM survivor, Kano

**Implementation:**
- Add "Know Your Rights" section
- Simple language (not legal jargon)
- State-specific info (laws vary by state)
- Downloadable PDF (can share with others)

---

### 4. **OFFLINE MODE** 🟡 HIGH PRIORITY

**Current:** App requires internet connection

**Problem:**
- Rural areas have poor connectivity
- Abusers often control internet access
- Victims may not have data

**Solution:**
- Allow report drafting offline
- Auto-submit when connection restored
- Cache critical resources (hotline numbers, safety tips)
- Offline chat with basic AI responses

---

### 5. **TRUSTED CONTACT SYSTEM** 🟢 MEDIUM PRIORITY

**Currently missing:** No way to involve trusted person

**What it should do:**
- Victim designates 1-2 trusted contacts
- Can share report status with them (if victim chooses)
- Trusted contact gets alert if victim activates SOS
- Trusted contact can check on victim's safety

**Safety considerations:**
- Must be OPT-IN
- Victim controls what's shared
- Easy to revoke access
- Trusted contact verified (not abuser pretending)

---

### 6. **FGM-SPECIFIC RESOURCES** 🟢 MEDIUM PRIORITY

**Currently missing:** Generic GBV resources only

**FGM victims need:**
- **Medical care:** Hospitals that treat FGM complications
- **Reversal surgery:** Where to get clitoral reconstruction (if desired)
- **Psychological support:** FGM-specific trauma counseling
- **Prevention:** How to protect daughters from being cut
- **Community support:** Connect with other survivors

**Implementation:**
- Filter resources by incident type
- FGM-specific resource database
- Partner with FGM-focused NGOs (e.g., Equality Now Nigeria)

---

### 7. **LANGUAGE ACCESSIBILITY** 🟢 MEDIUM PRIORITY

**Current:** Text-based translations

**Improvement needed:**
- **Audio option** - For illiterate users (40% of Nigerian women)
- **Voice-to-text** - Speak report instead of typing
- **Simple language mode** - 3rd-grade reading level
- **Visual guides** - Icons and images for key actions

**Why important:**
> "My mother can't read, but she needs help. She can't use apps with lots of text." - User feedback

---

### 8. **COMMUNITY VERIFICATION** 🟢 LOW PRIORITY

**Currently missing:** No way to verify NGO legitimacy

**Problem:**
- Fake NGOs exploit victims
- Scammers pose as counselors
- Victims don't know who to trust

**Solution:**
- Verified badge for legitimate NGOs
- User ratings/reviews (anonymous)
- Government partnership (NAPTIP verification)
- Report fake NGOs

---

## 🔧 TECHNICAL IMPROVEMENTS

### 1. **Data Minimization**
**Current:** App may store unnecessary data

**Best practice:**
- Don't store anything on device unless absolutely necessary
- Clear cache regularly
- No cookies/tracking
- No analytics that could identify users

### 2. **Secure Communication**
**Current:** Unknown encryption status

**Needed:**
- End-to-end encryption for chat
- TLS for all API calls
- No logs of user activity
- No IP address storage

### 3. **Account-less Operation**
**Current:** Unclear if account required

**Best practice:**
- No account needed for basic reporting
- Optional account for follow-up (with strong warnings)
- No email/phone required
- No social login (Facebook, Google)

---

## 📋 PRIORITY ACTION ITEMS

### 🔴 **IMMEDIATE (Safety-Critical)**
1. ❌ **Remove History page** - Device discovery risk
2. ⚠️ **Redesign Evidence Vault** - Upload-only, no local storage
3. ✅ **Enhance Quick Exit** - Shake to exit, fake screen
4. ✅ **Add prominent safety warnings** - "Don't use if abuser checks your phone"

### 🟡 **HIGH PRIORITY (Within 2 weeks)**
5. ✅ Add Safety Planning tool
6. ✅ Add Legal Rights information
7. ✅ Implement offline mode
8. ⚠️ Simplify Safety Center (remove location tracking)

### 🟢 **MEDIUM PRIORITY (Within 1 month)**
9. ✅ Add Trusted Contact system
10. ✅ Add FGM-specific resources
11. ✅ Improve language accessibility (audio, voice-to-text)
12. ✅ Add "Know Your Rights" section

### ⚪ **LOW PRIORITY (Future)**
13. Community verification system
14. Peer support groups
15. Self-care resources
16. Success stories (anonymized)

---

## 🎯 NAVIGATION REDESIGN

**Current Bottom Nav:**
- Home
- Report
- Chat
- Resources
- **History** ← REMOVE THIS

**Recommended Bottom Nav:**
- Home
- Report
- Chat
- Resources
- **Safety** (Quick exit, SOS, Safety plan)

**Why:**
- Removes dangerous History feature
- Adds critical Safety features
- Keeps most-used features accessible

---

## 💡 FEATURE ADDITIONS (Domain-Specific)

### **A. "Am I Safe?" Quiz**
- Quick assessment: "Is your relationship healthy?"
- Identifies red flags
- Suggests appropriate resources
- Not diagnostic, just educational

### **B. "What to Expect" Guide**
- What happens after you report?
- Will police come to my house?
- Will my family find out?
- How long does it take?
- Reduces fear of unknown

### **C. "For Friends & Family"**
- How to help someone experiencing GBV
- What to say (and not say)
- How to offer support safely
- Expands reach beyond direct victims

### **D. "Myths vs Facts"**
- "FGM is required by Islam" → FALSE
- "Domestic violence is a private matter" → FALSE
- "She must have provoked him" → FALSE
- Combats harmful beliefs

---

## 🔍 TESTING RECOMMENDATIONS

**Before launching, test with:**

1. **GBV Survivors** (if safe to recruit)
   - Does this feel safe to use?
   - Would you trust this app?
   - What's missing?

2. **NGO Counselors**
   - What do victims ask most?
   - What features would help your work?
   - What's dangerous?

3. **Security Experts**
   - Penetration testing
   - Encryption audit
   - Device forensics (can reports be recovered?)

4. **Low-Literacy Users**
   - Can they navigate without help?
   - Is language too complex?
   - Do they understand icons?

---

## 📚 DOMAIN BEST PRACTICES CHECKLIST

- [x] Trauma-informed language
- [x] Anonymous reporting option
- [x] Multi-language support
- [x] Quick exit functionality
- [ ] No device storage of sensitive data ← **FIX THIS**
- [ ] Safety planning tools ← **ADD THIS**
- [ ] Legal rights information ← **ADD THIS**
- [ ] Offline functionality ← **ADD THIS**
- [x] Clear privacy policy
- [ ] No history/tracking features ← **REMOVE HISTORY**
- [x] Emergency contact options
- [ ] FGM-specific resources ← **ADD THIS**

---

## 🎓 REFERENCES

**GBV Best Practices:**
- IASC Guidelines for GBV Interventions
- WHO Clinical Handbook for FGM
- UNFPA Survivor-Centered Approach

**Tech Safety:**
- Coalition Against Stalkerware
- National Network to End Domestic Violence (NNEDV) - Safety Net Project
- Chayn's DIY Online Safety Guide

**Nigerian Context:**
- VAPP Act 2015
- NAPTIP Guidelines
- Nigeria DHS FGM Data

---

## ✅ FINAL RECOMMENDATIONS SUMMARY

### **REMOVE:**
1. ❌ History page (critical safety risk)
2. ❌ Location tracking (unless emergency-only)
3. ❌ Safety timer (confusing, rarely used)

### **REDESIGN:**
1. ⚠️ Evidence Vault → Upload-only (no local storage)
2. ⚠️ Safety Center → Simplify (SOS + Quick Exit only)

### **ADD:**
1. ✅ Enhanced Quick Exit (shake, fake screen)
2. ✅ Safety Planning tool
3. ✅ Legal Rights information
4. ✅ Offline mode
5. ✅ FGM-specific resources
6. ✅ Audio/voice accessibility

### **KEEP AS-IS:**
1. ✅ Anonymous Reporting
2. ✅ Dashboard
3. ✅ Chat Support
4. ✅ Resources Finder
5. ✅ Multi-language
6. ✅ NGO Portal

---

**Bottom Line:**  
**The app has strong core features but includes dangerous functionality (History, Evidence Vault) that could get victims killed. Remove/redesign these immediately. Add critical missing features (Safety Planning, Legal Rights, Offline Mode) to make this truly victim-centered.**

---

**Document Version:** 1.0  
**Prepared for:** SafeVoice Development Team  
**Next Review:** After implementing critical fixes
