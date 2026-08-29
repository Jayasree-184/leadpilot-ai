import { GoogleGenAI } from '@google/genai';

/**
 * Deterministic Heuristic AI Qualification Engine (for Demo Mode / Fallback)
 * Implements the 100-point B2B ICP scoring framework.
 */
export function calculateDeterministicQualification(lead) {
  const {
    companyName = 'Company',
    industry = 'General',
    employees = 0,
    revenue = '$0',
    location = 'Unspecified',
    technologies = [],
    contactName = '',
    contactRole = ''
  } = lead;

  const ind = industry.toLowerCase();
  const techStr = Array.isArray(technologies) ? technologies.join(' ').toLowerCase() : String(technologies).toLowerCase();
  const loc = location.toLowerCase();

  // 1. Industry Fit (Max 25)
  let industryFit = 12;
  if (ind.includes('saas') || ind.includes('software')) industryFit = 25;
  else if (ind.includes('cyber') || ind.includes('security') || ind.includes('ai') || ind.includes('analytics')) industryFit = 24;
  else if (ind.includes('fintech') || ind.includes('finance') || ind.includes('payments')) industryFit = 23;
  else if (ind.includes('health') || ind.includes('medtech')) industryFit = 21;
  else if (ind.includes('logistics') || ind.includes('supply')) industryFit = 18;
  else if (ind.includes('edtech') || ind.includes('education')) industryFit = 17;
  else if (ind.includes('mfg') || ind.includes('manufacturing')) industryFit = 15;
  else if (ind.includes('retail') || ind.includes('commerce')) industryFit = 13;

  // 2. Company Size (Max 20)
  let companySize = 6;
  const emp = Number(employees) || 0;
  if (emp >= 500) companySize = 20;
  else if (emp >= 200) companySize = 18;
  else if (emp >= 100) companySize = 16;
  else if (emp >= 50) companySize = 14;
  else if (emp >= 20) companySize = 10;
  else companySize = 6;

  // 3. Revenue Potential (Max 20)
  let revenuePotential = 6;
  const revStr = String(revenue).toUpperCase();
  const revNumMatch = revStr.match(/[\d.]+/);
  const revVal = revNumMatch ? parseFloat(revNumMatch[0]) : 0;
  const isMillion = revStr.includes('M');
  const isBillion = revStr.includes('B');

  if (isBillion || (isMillion && revVal >= 20)) revenuePotential = 20;
  else if (isMillion && revVal >= 10) revenuePotential = 19;
  else if (isMillion && revVal >= 5) revenuePotential = 17;
  else if (isMillion && revVal >= 2) revenuePotential = 14;
  else if (isMillion && revVal >= 1) revenuePotential = 11;
  else revenuePotential = 7;

  // 4. Technology Fit (Max 15)
  let techFit = 6;
  let techMatches = 0;
  const modernTechs = ['react', 'node', 'aws', 'gcp', 'azure', 'kubernetes', 'k8s', 'kafka', 'python', 'rust', 'golang', 'microservices', 'snowflake', 'graphql', 'postgres', 'fastapi', 'docker'];
  modernTechs.forEach(t => {
    if (techStr.includes(t)) techMatches++;
  });
  if (techMatches >= 4) techFit = 15;
  else if (techMatches >= 2) techFit = 13;
  else if (techMatches >= 1) techFit = 10;
  else techFit = 6;

  // 5. Location Fit (Max 10)
  let locationFit = 5;
  if (loc.includes('bangalore') || loc.includes('bengaluru')) locationFit = 10;
  else if (loc.includes('mumbai') || loc.includes('hyderabad') || loc.includes('chennai') || loc.includes('pune')) locationFit = 9;
  else if (loc.includes('delhi') || loc.includes('ncr') || loc.includes('gurgaon') || loc.includes('noida')) locationFit = 8;
  else if (loc.includes('kolkata') || loc.includes('india')) locationFit = 7;
  else locationFit = 6;

  // 6. Other Signals (Max 10)
  let otherSignals = 5;
  if (emp > 100 && (isMillion && revVal >= 5)) otherSignals = 8;
  else if (emp > 50) otherSignals = 6;
  else otherSignals = 4;

  const totalScore = Math.min(100, Math.max(0, industryFit + companySize + revenuePotential + techFit + locationFit + otherSignals));

  // Category & Confidence
  let category = 'COLD';
  if (totalScore >= 85) category = 'HOT';
  else if (totalScore >= 70) category = 'WARM';

  const confidence = (totalScore >= 85 || totalScore <= 50) ? 'HIGH' : 'MEDIUM';

  // Explainable Reasons
  const reasons = [];
  if (industryFit >= 22) reasons.push(`Prime ${industry} target ICP fit`);
  else if (industryFit >= 16) reasons.push(`Solid industry alignment in ${industry}`);
  else reasons.push(`Secondary market sector (${industry})`);

  if (companySize >= 16) reasons.push(`High organizational capacity with ${emp}+ employees`);
  else if (companySize >= 10) reasons.push(`Mid-sized team with ${emp} employees`);
  else reasons.push(`Small operational footprint (${emp} employees)`);

  if (revenuePotential >= 16) reasons.push(`Strong purchasing power with estimated ${revenue} annual revenue`);
  else reasons.push(`Estimated revenue scale around ${revenue}`);

  if (techFit >= 12) reasons.push(`Modern stack architecture: ${Array.isArray(technologies) && technologies.length > 0 ? technologies.slice(0, 4).join(', ') : 'Cloud & Microservices'}`);
  if (locationFit >= 9) reasons.push(`Located in primary Tier-1 tech hub (${location})`);

  // Recommended Decision Maker
  let decisionMaker = contactName ? `${contactName} (${contactRole || 'Key Stakeholder'})` : 'Head of Technology / Operations';
  if (!contactName && ind.includes('saas')) decisionMaker = 'Chief Technology Officer (CTO)';
  else if (!contactName && ind.includes('cyber')) decisionMaker = 'Chief Information Security Officer (CISO)';
  else if (!contactName && ind.includes('fintech')) decisionMaker = 'VP of Engineering / CPO';

  // Recommended Action & Outreach Angle
  let recommendedAction = '';
  let outreachAngle = '';
  let generatedSubject = '';
  let generatedMessage = '';

  const firstName = contactName ? contactName.split(' ')[0] : 'there';
  const roleTitle = contactRole || 'Leadership';

  if (category === 'HOT') {
    recommendedAction = contactRole ? `Contact ${contactRole} immediately with personalized value proposition.` : 'Contact the CTO or Head of Engineering first.';
    outreachAngle = `Focus on engineering velocity, infrastructure scalability, and automated operational efficiency for ${companyName}.`;
    generatedSubject = `Scaling engineering velocity & workflows at ${companyName}`;
    generatedMessage = `Hi ${firstName},\n\nI noticed ${companyName}'s recent momentum and expanding footprint in ${industry}. High-performing teams at your scale often face critical bottlenecks in workflow orchestration and operational scalability.\n\nLeadPilot helps leaders automate prioritization without adding engineering overhead. Would you be open to a 10-minute chat next Tuesday to exchange ideas?\n\nBest regards,\nAlex Vance\nLeadPilot AI`;
  } else if (category === 'WARM') {
    recommendedAction = `Engage ${roleTitle} with consultative use case and relevant peer benchmarks.`;
    outreachAngle = `Highlight operational risk mitigation, time-to-value acceleration, and modular integration for ${companyName}.`;
    generatedSubject = `Accelerating workflow efficiency for ${companyName}`;
    generatedMessage = `Hi ${firstName},\n\nHope you're having a productive week. As ${companyName} expands in ${location}, streamlining high-priority account handoffs becomes crucial to sustaining revenue growth.\n\nWe provide explainable prioritization designed for fast-moving teams. Would love to share a few benchmarks with you this Thursday if you're open.\n\nBest,\nAlex Vance\nLeadPilot AI`;
  } else {
    recommendedAction = 'Enroll in automated nurture track; deprioritize outbound calling.';
    outreachAngle = `Provide self-service ROI guides and low-friction product tours.`;
    generatedSubject = `Self-serve resources for ${companyName}`;
    generatedMessage = `Hi ${firstName},\n\nSharing a quick resource on streamlining operational workflows. If you're exploring automated prioritization tools with zero integration friction, feel free to review our product tour.\n\nBest,\nAlex Vance\nLeadPilot AI`;
  }

  return {
    score: totalScore,
    category,
    confidence,
    scoreBreakdown: {
      industryFit,
      companySize,
      revenuePotential,
      techFit,
      locationFit,
      otherSignals
    },
    reasons,
    decisionMaker,
    recommendedAction,
    outreachAngle,
    generatedSubject,
    generatedMessage
  };
}

/**
 * Main AI Qualification Service
 * Supports Google GenAI SDK (Gemini 3.7 Flash) and graceful Demo Mode fallback.
 */
export async function qualifyLeadWithAI(lead) {
  const apiKey = process.env.AI_API_KEY;
  const isDemoMode = process.env.DEMO_MODE === 'true' || !apiKey || apiKey.trim() === '';

  if (isDemoMode) {
    console.log(`[AI Service] Running deterministic qualification in DEMO_MODE for "${lead.companyName}"`);
    return calculateDeterministicQualification(lead);
  }

  try {
    console.log(`[AI Service] Invoking Gemini AI for lead "${lead.companyName}"...`);
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the core intelligence engine of LeadPilot AI, a premium B2B sales intelligence platform.
Evaluate the given raw B2B company lead and output strict JSON adhering exactly to the scoring framework.

Scoring Framework (Total 100 pts):
1. Industry Fit (0-25): SaaS (25), AI/Cybersecurity (24), Fintech (22), HealthTech (20), Logistics/EdTech (17), Manufacturing (15), Retail (12).
2. Company Size (0-20): 500+ (20), 200-499 (18), 100-199 (16), 50-99 (14), 20-49 (10), <20 (6).
3. Revenue Potential (0-20): >$20M (20), $10M-$20M (18), $5M-$10M (16), $2M-$5M (13), $1M-$2M (10), <$1M (6).
4. Technology Fit (0-15): Modern cloud/microservices/data stack (12-15), moderate stack (8-11), legacy/basic (4-7).
5. Location Fit (0-10): Tier-1 tech hubs like Bangalore, Mumbai, Hyderabad, Chennai, Pune (8-10), others (5-7).
6. Other Signals (0-10): Growth indicators, hiring velocity (4-10).

Classification Thresholds:
- Score 85-100: "HOT"
- Score 70-84: "WARM"
- Score 0-69: "COLD"

Confidence: "HIGH", "MEDIUM", or "LOW".

Return ONLY raw JSON with this exact schema:
{
  "score": <number 0-100>,
  "category": "HOT" | "WARM" | "COLD",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "scoreBreakdown": {
    "industryFit": <number 0-25>,
    "companySize": <number 0-20>,
    "revenuePotential": <number 0-20>,
    "techFit": <number 0-15>,
    "locationFit": <number 0-10>,
    "otherSignals": <number 0-10>
  },
  "reasons": ["<bullet 1>", "<bullet 2>", "<bullet 3>", "<bullet 4>"],
  "decisionMaker": "<Name (Role) or best role to target>",
  "recommendedAction": "<Concise immediate next best sales action>",
  "outreachAngle": "<Strategic outreach angle focusing on company pain points>",
  "generatedSubject": "<Compelling, personalized, non-spammy email subject>",
  "generatedMessage": "<Short, punchy 3-paragraph executive outreach email tailored to contact/company>"
}`;

    const leadContext = `
Company: ${lead.companyName}
Industry: ${lead.industry}
Employees: ${lead.employees}
Revenue: ${lead.revenue}
Location: ${lead.location}
Website: ${lead.website || 'N/A'}
Contact Name: ${lead.contactName || 'N/A'}
Contact Role: ${lead.contactRole || 'N/A'}
Email: ${lead.email || 'N/A'}
Technologies: ${Array.isArray(lead.technologies) ? lead.technologies.join(', ') : lead.technologies || 'N/A'}
`;

    // Wrap API call with timeout for fast fallback on 503 or transient network latency
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation request timeout')), 7000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nLEAD TO EVALUATE:\n${leadContext}` }] }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(responseText);

    // Validate and sanitize response
    const validScore = typeof parsed.score === 'number' ? Math.min(100, Math.max(0, parsed.score)) : 70;
    const category = validScore >= 85 ? 'HOT' : (validScore >= 70 ? 'WARM' : 'COLD');

    return {
      score: validScore,
      category,
      confidence: parsed.confidence || 'HIGH',
      scoreBreakdown: {
        industryFit: parsed.scoreBreakdown?.industryFit ?? 20,
        companySize: parsed.scoreBreakdown?.companySize ?? 15,
        revenuePotential: parsed.scoreBreakdown?.revenuePotential ?? 15,
        techFit: parsed.scoreBreakdown?.techFit ?? 12,
        locationFit: parsed.scoreBreakdown?.locationFit ?? 8,
        otherSignals: parsed.scoreBreakdown?.otherSignals ?? 5
      },
      reasons: Array.isArray(parsed.reasons) && parsed.reasons.length > 0 ? parsed.reasons : ['High ICP match and expansion indicators'],
      decisionMaker: parsed.decisionMaker || (lead.contactName ? `${lead.contactName} (${lead.contactRole})` : 'VP of Engineering'),
      recommendedAction: parsed.recommendedAction || 'Engage decision maker on infrastructure velocity.',
      outreachAngle: parsed.outreachAngle || `Focus on operational scale and automated intelligence for ${lead.companyName}.`,
      generatedSubject: parsed.generatedSubject || `Optimizing workflow scaling at ${lead.companyName}`,
      generatedMessage: parsed.generatedMessage || `Hi ${lead.contactName ? lead.contactName.split(' ')[0] : 'there'},\n\nNoticed ${lead.companyName}'s growth in ${lead.industry}. Would love to share how we help similar teams streamline workflow prioritization.\n\nBest,\nAlex Vance\nLeadPilot AI`
    };

  } catch (err) {
    console.warn(`[AI Service] Gemini API call failed (${err.message}). Seamlessly falling back to deterministic heuristic qualification.`);
    return calculateDeterministicQualification(lead);
  }
}
