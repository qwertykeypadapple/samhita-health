export const CATEGORIES = [
  { id: 'gov', name: 'Governance & accountability', tone: '#b0761c' },
  { id: 'consent', name: 'Consent & purpose', tone: '#0d8b88' },
  { id: 'tech', name: 'Technical & security', tone: '#24506a' },
  { id: 'ai', name: 'AI-specific & ethics', tone: '#8a5a12' },
]

export const QUESTIONS = [
  {
    id: 'q1',
    cat: 'gov',
    weight: 1,
    q: 'Have you assessed whether your hospital is likely to be notified a Significant Data Fiduciary?',
    ref: 'S. 10 · Rule 13',
    action:
      'Run the SDF assessment against volume and sensitivity of processing. If it lands positive, you need an India-based DPO answerable to the board and an independent data auditor before 13 May 2027.',
    priority: 'high',
  },
  {
    id: 'q2',
    cat: 'gov',
    weight: 1,
    q: 'Is there a named Data Protection Officer or equivalent accountable to your board?',
    ref: 'S. 10 · Rule 13',
    action:
      'Appoint and publish a DPO contact. The Rules require the contact be reachable and named on your notice. A shared inbox with no owner is a common audit finding.',
    priority: 'high',
  },
  {
    id: 'q3',
    cat: 'gov',
    weight: 1,
    q: 'Have you completed a Data Protection Impact Assessment covering analytics or AI use of patient data?',
    ref: 'Rule 13',
    action:
      'Scope a DPIA specifically for secondary use. SDFs must repeat it annually and report significant observations to the Data Protection Board.',
    priority: 'high',
  },
  {
    id: 'q4',
    cat: 'gov',
    weight: 1,
    q: 'Can you produce a breach report to the Board within 72 hours, with patient intimation without delay?',
    ref: 'S. 8(6) · Rule 7',
    action:
      'Write and rehearse the runbook now. Seventy-two hours is not enough time to work out who decides, who drafts and who signs.',
    priority: 'high',
  },
  {
    id: 'q5',
    cat: 'consent',
    weight: 1.2,
    q: 'Does your consent notice list AI or model development as a distinct, itemised purpose?',
    ref: 'S. 5, 6 · Rule 3',
    action:
      'Separate secondary-use consent from treatment consent. Bundling them into the admission form fails the "free, specific and unconditional" test and is the single most common gap we find.',
    priority: 'high',
  },
  {
    id: 'q6',
    cat: 'consent',
    weight: 0.8,
    q: 'Is the notice available in English and the relevant Eighth Schedule languages?',
    ref: 'Rule 3',
    action:
      'Translate and validate the notice for the languages your catchment actually speaks. Rule 3 makes availability in Eighth Schedule languages an express requirement.',
    priority: 'medium',
  },
  {
    id: 'q7',
    cat: 'consent',
    weight: 1.2,
    q: 'Can a patient withdraw consent as easily as they gave it, with the withdrawal reaching your data systems?',
    ref: 'S. 6(4)–(6)',
    action:
      'Build the withdrawal path end to end, not just the button. A withdrawal that stops at the front desk and never reaches the analytics cohort is a live non-compliance.',
    priority: 'high',
  },
  {
    id: 'q8',
    cat: 'consent',
    weight: 1,
    q: 'Do you have a documented retention schedule and erasure trigger for data used in analytics?',
    ref: 'S. 8(7) · Rule 8',
    action:
      'Map clinical record retention mandates against the erase-when-purpose-served default, and record where each overrides the other.',
    priority: 'medium',
  },
  {
    id: 'q9',
    cat: 'tech',
    weight: 1.2,
    q: 'Is patient data pseudonymised or de-identified before any analytics workload reads it?',
    ref: 'S. 8(4) · Rule 6',
    action:
      'Put de-identification upstream of the workload, not inside it. The Samhita node enforces this at read time, but the identifier mapping stays yours.',
    priority: 'high',
  },
  {
    id: 'q10',
    cat: 'tech',
    weight: 1,
    q: 'Do you retain access logs for analytics access to clinical systems?',
    ref: 'Rule 6',
    action:
      'Enable and retain logs for the period the Rules prescribe. Without them you cannot evidence safeguards, and you cannot investigate a breach.',
    priority: 'medium',
  },
  {
    id: 'q11',
    cat: 'tech',
    weight: 0.8,
    q: 'Do you have an ABDM-compliant FHIR R4 interoperability layer?',
    ref: 'ABDM · EHR Standards 2016',
    action:
      'This is the same work that earns Digital Health Incentive Scheme payments and makes you federation-ready. Sequence it first if it is missing.',
    priority: 'medium',
  },
  {
    id: 'q12',
    cat: 'tech',
    weight: 1,
    q: 'Is there a segregated network zone where a training workload could run without broad access to hospital systems?',
    ref: 'S. 8(4) · Rule 6',
    action:
      'Provision a VLAN or DMZ with read-only access to the FHIR layer and a single outbound egress rule. This is the standard deployment pattern for a Samhita node.',
    priority: 'medium',
  },
  {
    id: 'q13',
    cat: 'ai',
    weight: 1.2,
    q: 'Has your Institutional Ethics Committee reviewed AI or ML use of clinical data under the ICMR 2023 guidelines?',
    ref: 'ICMR 2023 · S. 17(2)(b)',
    action:
      'Take the protocol to your IEC before the first training round, not after the pilot. If you intend to rely on the research exemption, IEC approval is what makes that position defensible.',
    priority: 'high',
  },
  {
    id: 'q14',
    cat: 'ai',
    weight: 1,
    q: 'Do you evaluate model performance across demographic and site subgroups?',
    ref: 'ICMR 2023',
    action:
      'Define subgroup slices (sex, age band, region, socioeconomic proxy, referral site) before training, and report per-slice metrics every round.',
    priority: 'high',
  },
  {
    id: 'q15',
    cat: 'ai',
    weight: 1,
    q: 'For any model used in care, have you confirmed its CDSCO classification and licensing status?',
    ref: 'MDR 2017',
    action:
      'Determine risk class A–D against the intended clinical claim. Research training is out of scope; deployment into care is not.',
    priority: 'high',
  },
  {
    id: 'q16',
    cat: 'ai',
    weight: 1,
    q: 'Is human oversight documented: who can override the model, and how?',
    ref: 'ICMR 2023',
    action:
      'Name the accountable clinician and write the override path into the clinical SOP. ICMR treats accountability as non-delegable to the vendor.',
    priority: 'medium',
  },
]

export const BANDS = [
  {
    min: 85,
    label: 'Federation-ready',
    tone: 'verify',
    text: 'You are in strong shape. The remaining gaps are refinements rather than blockers, and a pilot could realistically start within a quarter.',
  },
  {
    min: 62,
    label: 'Close; targeted work needed',
    tone: 'verify',
    text: 'The foundations are there. Focus on the high-priority gaps below; most hospitals in this band reach readiness in one to two quarters.',
  },
  {
    min: 38,
    label: 'Material gaps',
    tone: 'statute',
    text: 'Meaningful work is needed before a federated programme is defensible, and much of it is work you owe by 13 May 2027 regardless of whether you ever train a model.',
  },
  {
    min: 0,
    label: 'Early stage',
    tone: 'risk',
    text: 'Start with governance and consent architecture. These are prerequisites for DPDP compliance in general, not just for federated learning, so the effort is not specific to this project.',
  },
]
