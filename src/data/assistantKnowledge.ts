import type { ChatMessage } from '../types';

export interface AssistantResponse {
  triggers: string[];
  response: string;
}

export const KNOWLEDGE_BASE: AssistantResponse[] = [
  {
    triggers: ['most critical', 'highest critical', 'critical today', 'critical incidents'],
    response: 'Madhapur currently has the highest number of critical demo incidents, with 14 recorded today. Hitech City Expressway follows with 9 critical incidents, primarily overspeeding violations between 7 AM and 9 AM.',
  },
  {
    triggers: ['critical violations', 'show critical', 'critical violations today'],
    response: 'Today\'s critical violations include:\n\n• **TG-20483** — Wrong-Side Driving at Kukatpally Y-Junction (96% AI confidence, 4 cameras)\n• **TG-20486** — Overspeeding at Hitech City Expressway (99% AI confidence, detected at 87 km/h in a 40 km/h zone)\n\nBoth are currently under officer review. All data is simulated for demonstration purposes.',
  },
  {
    triggers: ['most incidents', 'areas most', 'which areas', 'highest incidents'],
    response: 'Based on today\'s simulated data, the top areas for incidents are:\n\n1. **Madhapur** — 87 incidents (High risk)\n2. **Gachibowli** — 64 incidents (High risk)\n3. **Kukatpally** — 52 incidents (Medium risk)\n4. **Ameerpet** — 48 incidents (High risk)\n5. **Banjara Hills** — 39 incidents (Medium risk)\n\nMadhapur\'s peak violation period is 6 PM – 9 PM.',
  },
  {
    triggers: ['why high priority', 'why priority', 'high priority reason'],
    response: 'An incident is classified as HIGH or CRITICAL priority based on several factors:\n\n• **AI Confidence** — Detection certainty above 90%\n• **Violation Type** — Wrong-side driving and overspeeding have inherently higher risk\n• **Evidence Quality** — Multi-camera confirmation raises priority\n• **Location** — Known high-risk junctions receive elevated priority\n• **Time of day** — Evening peak hours trigger additional weighting\n\nFinal priority classification is always reviewed by an authorized officer.',
  },
  {
    triggers: ['helmet', 'no helmet', 'helmet violations', 'unresolved helmet'],
    response: 'Current unresolved no-helmet violations include:\n\n• **TG-20482** — Gachibowli Flyover (94% confidence, Pending Review)\n• **TG-20489** — Secunderabad Clock Tower (93% confidence, Pending Review)\n\nIn total, 289 no-helmet violations have been recorded this week. 187 are verified, 42 are pending review.',
  },
  {
    triggers: ['hotspots', 'safety hotspots', 'dangerous areas', 'road hotspots'],
    response: 'Current Hyderabad road safety hotspots (simulated data):\n\n🔴 **#1 Madhapur Junction** — 87 incidents, HIGH risk\n🔴 **#2 Gachibowli Flyover** — 64 incidents, HIGH risk\n🟠 **#3 Kukatpally Y-Junction** — 52 incidents, MEDIUM risk\n🔴 **#4 Ameerpet Metro Junction** — 48 incidents, HIGH risk\n🟡 **#5 Banjara Hills Road 12** — 39 incidents, MEDIUM risk\n\nPeak violation period: **6 PM – 9 PM** across most hotspots.',
  },
  {
    triggers: ['summarize today', 'summary', 'today\'s summary', 'today summary'],
    response: 'Today\'s Hyderabad Road Safety Summary (simulated demo data):\n\n📊 **Total Incidents**: 127 recorded today\n🔴 **Critical**: 14 incidents requiring immediate attention\n🟠 **High Priority**: 38 incidents\n⏳ **Pending Review**: 42 incidents awaiting officer action\n✅ **Verified**: 89 incidents confirmed and actioned\n🏙️ **Hotspot**: Madhapur Junction with 14 critical incidents\n📷 **Active Cameras**: 3,842 vehicles contributing to the network',
  },
  {
    triggers: ['wrong side', 'wrong-side', 'wrong side driving'],
    response: 'Wrong-side driving incidents today:\n\n• **TG-20483** — Kukatpally Y-Junction (CRITICAL, 4 cameras, Under Investigation)\n• **TG-20490** — Mehdipatnam Junction (HIGH, 3 cameras, Under Investigation)\n\nWrong-side driving accounts for 187 of this week\'s total violations and carries the highest collision risk. AI analysis suggests inadequate lane separation infrastructure at both locations.',
  },
  {
    triggers: ['pending', 'review', 'pending review', 'awaiting'],
    response: 'Currently **127 incidents** are pending officer review:\n\n• 14 are CRITICAL priority\n• 38 are HIGH priority\n• 52 are MEDIUM priority\n• 23 are LOW priority\n\nOldest pending: TG-20489 (Secunderabad, 2 hours 41 minutes). I can help prioritize the review queue if needed.',
  },
  {
    triggers: ['camera network', 'cameras', 'active cameras', 'network'],
    response: 'The TrafficGuard AI network currently has **3,842 active vehicle cameras** contributing to road safety monitoring:\n\n• 2,341 private dashcams\n• 891 commercial fleet vehicles\n• 487 auto-rickshaws\n• 123 TSRTC buses\n\nNetwork coverage is strongest in Hitech City, Madhapur, and Gachibowli corridors. Coverage is expanding in Uppal and LB Nagar areas.',
  },
];

export const SUGGESTED_PROMPTS = [
  'Which area has the most critical incidents today?',
  'Show today\'s critical violations.',
  'Which areas have the most incidents?',
  'Why is this incident high priority?',
  'Show unresolved helmet violations.',
  'What are the current road safety hotspots?',
  'Summarize today\'s incidents.',
];

export function getAssistantResponse(userInput: string): string {
  const lower = userInput.toLowerCase();
  for (const item of KNOWLEDGE_BASE) {
    if (item.triggers.some(trigger => lower.includes(trigger))) {
      return item.response;
    }
  }
  return 'I can help you with information about Hyderabad road safety incidents, hotspots, violations, and camera network data. Try asking:\n\n• "Which area has the most incidents?"\n• "Show today\'s critical violations."\n• "What are the current hotspots?"\n• "Summarize today\'s incidents."';
}

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'init-1',
    role: 'assistant',
    content: 'Good afternoon! I\'m the **TrafficGuard Assistant**, your AI interface for Hyderabad road safety data.\n\nYou can ask me about incidents, hotspots, violation patterns, camera network status, or officer priorities.\n\n*All data shown is simulated for demonstration purposes.*',
    timestamp: '18:02',
  },
];
