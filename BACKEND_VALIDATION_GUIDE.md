# Backend Spam/Validation Implementation Guide

## Overview
Add AI-powered validation to filter spam, gibberish, and malicious reports before assigning to NGOs.

---

## 1. Update AI Analysis Service

**File:** `backend/src/services/ai-analysis.service.ts`

### Add Validation Method

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AIAnalysisService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  /**
   * Validate if report is legitimate or spam
   */
  async validateReport(description: string, incidentType: string) {
    try {
      const prompt = `You are a content validator for a GBV/FGM reporting platform in Nigeria.

Analyze this report and classify it as:
- VALID: Real incident report (FGM, child abuse, sexual assault, child labour, domestic violence)
- SPAM: Gibberish, profanity only, trolling, test messages, irrelevant content
- UNCLEAR: Too vague but might be genuine (needs human review)

Incident Type: ${incidentType}
Report: "${description}"

Consider:
- Language barriers (broken English is OK)
- Emotional language (fear, anger is valid)
- Short but urgent messages ("help me" is valid)
- Cultural context (Nigerian English)

Respond with JSON only:
{
  "status": "VALID" | "SPAM" | "UNCLEAR",
  "reason": "brief explanation",
  "confidence": 0-100
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Cheaper model for validation
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      // On error, assume valid (don't block legitimate reports)
      return {
        status: 'VALID',
        reason: 'validation_error',
        confidence: 50,
      };
    }
  }

  /**
   * Analyze urgency (only for valid reports)
   */
  async analyzeUrgency(description: string, incidentType: string) {
    try {
      const prompt = `Analyze this incident report and determine urgency level.

Incident Type: ${incidentType}
Report: "${description}"

HIGH urgency if:
- Immediate danger (happening now, about to happen)
- Child at risk
- Severe injury or bleeding
- Suicide risk
- FGM planned for tomorrow/soon

MEDIUM urgency if:
- Recent incident (last week)
- Ongoing abuse
- Child labour
- Needs intervention soon

LOW urgency if:
- Past incident (months/years ago)
- Seeking information
- General concern
- No immediate danger

Respond with JSON only:
{
  "urgency": "high" | "medium" | "low",
  "reason": "brief explanation",
  "keywords": ["keyword1", "keyword2"]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Urgency analysis error:', error);
      return {
        urgency: 'medium',
        reason: 'analysis_error',
        keywords: [],
      };
    }
  }

  /**
   * Complete report analysis (validation + urgency)
   */
  async analyzeReport(description: string, incidentType: string) {
    // Step 1: Validate
    const validation = await this.validateReport(description, incidentType);

    if (validation.status === 'SPAM') {
      return {
        isValid: false,
        validation,
        urgency: null,
        shouldNotifyNGO: false,
        needsHumanReview: false,
      };
    }

    if (validation.status === 'UNCLEAR') {
      return {
        isValid: true,
        validation,
        urgency: 'low',
        shouldNotifyNGO: false,
        needsHumanReview: true,
      };
    }

    // Step 2: Analyze urgency (only for valid reports)
    const urgencyAnalysis = await this.analyzeUrgency(description, incidentType);

    return {
      isValid: true,
      validation,
      urgency: urgencyAnalysis.urgency,
      urgencyReason: urgencyAnalysis.reason,
      keywords: urgencyAnalysis.keywords,
      shouldNotifyNGO: urgencyAnalysis.urgency === 'high',
      needsHumanReview: false,
    };
  }
}
```

---

## 2. Update Report Schema

**File:** `backend/src/schemas/report.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ required: true })
  incident_type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [String], default: [] })
  files: string[];

  @Prop({ type: Object })
  ai_analysis: {
    isValid: boolean;
    validation: {
      status: 'VALID' | 'SPAM' | 'UNCLEAR';
      reason: string;
      confidence: number;
    };
    urgency: 'high' | 'medium' | 'low' | null;
    urgencyReason?: string;
    keywords?: string[];
    shouldNotifyNGO: boolean;
    needsHumanReview: boolean;
  };

  @Prop({ default: 'pending' })
  status: 'pending' | 'assigned' | 'in_review' | 'resolved' | 'spam' | 'rejected';

  @Prop({ type: Object })
  contact_info?: {
    email?: string;
    phone?: string;
    preferred_method?: string;
    best_time?: string;
  };

  @Prop()
  assigned_ngo?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
```

---

## 3. Update Reports Controller

**File:** `backend/src/controllers/reports.controller.ts`

```typescript
import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { AIAnalysisService } from '../services/ai-analysis.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private aiAnalysisService: AIAnalysisService,
  ) {}

  @Post()
  async createReport(@Body() createReportDto: any) {
    const { description, incident_type, location, files, contact_info } = createReportDto;

    // AI Analysis (validation + urgency)
    const aiAnalysis = await this.aiAnalysisService.analyzeReport(
      description,
      incident_type,
    );

    // If spam, reject immediately
    if (!aiAnalysis.isValid) {
      return {
        success: false,
        message: 'Report could not be submitted. Please provide a detailed description of the incident.',
        validation: aiAnalysis.validation,
      };
    }

    // Create report
    const report = await this.reportsService.create({
      incident_type,
      description,
      location,
      files: files || [],
      contact_info,
      ai_analysis: aiAnalysis,
      status: aiAnalysis.validation.status === 'UNCLEAR' ? 'in_review' : 'pending',
    });

    // If high urgency, notify NGO immediately
    if (aiAnalysis.shouldNotifyNGO) {
      // TODO: Send notification to NGO
      console.log('HIGH URGENCY REPORT:', report._id);
    }

    return {
      success: true,
      _id: report._id,
      ai_analysis: {
        urgency: aiAnalysis.urgency,
        needsHumanReview: aiAnalysis.needsHumanReview,
      },
    };
  }

  @Get('ngo/reports')
  async getNGOReports(@Query() query: any) {
    // Only show valid reports to NGOs
    return this.reportsService.find({
      'ai_analysis.isValid': true,
      status: { $ne: 'spam' },
      ...query,
    });
  }

  @Get('admin/spam')
  async getSpamReports() {
    // Admin can review spam reports
    return this.reportsService.find({
      'ai_analysis.isValid': false,
    });
  }

  @Get('admin/review')
  async getReportsNeedingReview() {
    // Reports marked as UNCLEAR
    return this.reportsService.find({
      'ai_analysis.needsHumanReview': true,
      status: 'in_review',
    });
  }
}
```

---

## 4. Update Frontend to Handle Validation Response

**File:** `src/pages/Report.tsx`

```typescript
try {
  const response = await apiService.createReport({
    incident_type: selectedType || 'other',
    description,
    location: selectedState,
    files: selectedFiles.length > 0 ? selectedFiles : undefined,
  })

  // Check if report was rejected as spam
  if (!response.success) {
    toast({
      title: "Report could not be submitted",
      description: response.message || "Please provide a detailed description of the incident.",
      variant: "destructive"
    })
    return
  }

  // Success
  toast({
    title: t('report.submission_success'),
    description: t('report.submission_success_message'),
  })
  navigate("/report/confirmation", { state: { reportId: response._id } })
} catch (error) {
  toast({ 
    title: t('report.submission_failed'), 
    description: t('report.submission_error'), 
    variant: "destructive" 
  })
} finally {
  setIsSubmitting(false)
}
```

---

## 5. Environment Variables

**File:** `backend/.env`

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini  # Cheaper model for validation
```

---

## 6. Testing

### Test Cases

**SPAM (Should be rejected):**
```
- "test"
- "hello world"
- "asdfghjkl"
- "fuck you"
- "aaaaaaaaaa"
- "123456789"
```

**VALID (Should be accepted):**
```
- "My neighbor is planning to cut his daughter tomorrow"
- "A child is working in a factory instead of going to school"
- "I was beaten by my husband last night"
- "Someone touched me inappropriately at work"
```

**UNCLEAR (Should go to human review):**
```
- "help me"
- "something bad happened"
- "I'm scared"
```

---

## 7. Monitoring & Improvement

### Add Logging

```typescript
// Log all validation results for analysis
console.log('Report Validation:', {
  reportId: report._id,
  status: aiAnalysis.validation.status,
  confidence: aiAnalysis.validation.confidence,
  urgency: aiAnalysis.urgency,
});
```

### Track Metrics

- Spam detection rate
- False positive rate (valid reports marked as spam)
- Human review queue size
- NGO feedback on report quality

---

## 8. Deployment Checklist

- [ ] Add OPENAI_API_KEY to environment variables
- [ ] Update Report schema in database
- [ ] Deploy backend with new validation logic
- [ ] Test with sample spam reports
- [ ] Monitor false positive rate
- [ ] Set up human review queue for NGO admins
- [ ] Add admin dashboard to review spam/unclear reports

---

## 9. Cost Optimization

**GPT-4o-mini pricing:**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**Estimated cost per report:**
- ~500 tokens per validation = $0.0004
- ~1000 reports/day = $0.40/day = $12/month

**Much cheaper than NGO time wasted on spam!**

---

## 10. Future Enhancements

- [ ] Multi-language validation (Yoruba, Hausa, Igbo)
- [ ] Pattern learning (improve over time)
- [ ] Spam reporter tracking (block repeat offenders by IP/device)
- [ ] Confidence threshold tuning (adjust based on false positive rate)
- [ ] A/B testing different prompts
- [ ] Fallback to rule-based validation if OpenAI is down

---

**Implementation Priority:**
1. ✅ Frontend validation (DONE)
2. 🔄 Backend AI validation (IMPLEMENT THIS)
3. ⏳ Human review queue
4. ⏳ Monitoring dashboard
