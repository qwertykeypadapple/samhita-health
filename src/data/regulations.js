/**
 * Regulatory reference content for the compliance hub.
 * Written for hospital DPOs, CIOs, CMIOs and ethics committees.
 *
 * Accuracy notes: rule/section numbers are cited as published. This is an
 * informational summary, not legal advice. Every card links back to the
 * primary instrument so counsel can verify.
 */

export const TIMELINE = [
  {
    date: 'Aug 2023',
    title: 'DPDP Act, 2023 receives assent',
    body: 'India’s first horizontal data protection statute. Passed, but substantially dormant pending rules.',
    state: 'done',
  },
  {
    date: '13 Nov 2025',
    title: 'DPDP Rules, 2025 notified',
    body: 'The Act is operationalised in phases. Provisions constituting the Data Protection Board of India take effect immediately.',
    state: 'done',
  },
  {
    date: '13 Nov 2026',
    title: 'Consent Manager regime opens',
    body: 'Registration and obligations for Consent Managers commence one year after notification. Relevant to any hospital relying on ABDM-style consent artefacts.',
    state: 'next',
  },
  {
    date: '13 May 2027',
    title: 'Substantive obligations bite',
    body: 'Notice, security safeguards, breach notification, retention & erasure, data principal rights, cross-border transfer and Significant Data Fiduciary duties all become enforceable. No grace period follows.',
    state: 'future',
  },
]

export const REGULATIONS = [
  {
    id: 'dpdp',
    short: 'DPDP Act & Rules',
    tag: 'Primary statute',
    name: 'Digital Personal Data Protection Act, 2023',
    sub: 'read with the DPDP Rules, 2025',
    authority: 'MeitY · Data Protection Board of India',
    status: 'Phased; full force 13 May 2027',
    tone: 'statute',
    summary:
      'India’s general data protection law. It does not create a separate “sensitive personal data” category the way the old SPDI Rules did. Health data is governed by the same consent-and-purpose machinery as everything else, which makes purpose limitation, retention and erasure the operative constraints on AI training.',
    obligations: [
      {
        ref: 'S. 5 · Rule 3',
        text: 'Itemised notice in clear plain language, available in English and the Eighth Schedule languages, stating the personal data and the specific purpose. “Future research” is not a purpose.',
      },
      {
        ref: 'S. 6',
        text: 'Consent must be free, specific, informed, unconditional, unambiguous and as easy to withdraw as to give. Bundling AI-training consent into the admission form is the classic failure mode.',
      },
      {
        ref: 'S. 8(4) · Rule 6',
        text: 'Reasonable security safeguards: encryption, access control, logging and log retention, and contractual flow-down to processors.',
      },
      {
        ref: 'S. 8(6) · Rule 7',
        text: 'Personal data breach: intimate affected Data Principals without delay, and the Board with a detailed report within 72 hours.',
      },
      {
        ref: 'S. 8(7) · Rule 8',
        text: 'Erase personal data when the purpose is served or consent is withdrawn, unless retention is required by law. Clinical record retention mandates generally survive this.',
      },
      {
        ref: 'S. 10 · Rule 13',
        text: 'If notified a Significant Data Fiduciary: an India-based DPO answerable to the board, an independent data auditor, an annual DPIA and audit reported to the Board, and due diligence that algorithmic software does not pose risks to Data Principal rights.',
      },
      {
        ref: 'S. 16 · Rule 15',
        text: 'Transfers abroad are permitted subject to requirements the Central Government may specify for making data available to a foreign State or its instrumentalities. Government-specified categories may be barred from leaving India entirely for SDFs.',
      },
    ],
    fl: {
      helps: [
        'Identifiable records never leave the hospital, so no cross-border transfer of patient data occurs, so Rule 15 exposure collapses to the model artefacts.',
        'Purpose limitation is enforceable at the node: a training job runs only against the cohort your consent artefact actually covers.',
        'Erasure on withdrawal is tractable: you delete locally and exclude that record from the next round, rather than chasing a copy sitting in a vendor’s data lake.',
      ],
      owed: [
        'You are still the Data Fiduciary. Local training is processing, and it needs a lawful basis.',
        'Model updates can, in principle, carry information about individuals, which is why we treat them as protected artefacts and apply DP, not as anonymous exhaust.',
        'If you are notified an SDF, algorithmic due diligence under Rule 13 covers the model you help train.',
      ],
    },
    link: 'https://www.meity.gov.in/data-protection-framework',
  },
  {
    id: 'research',
    short: 'Research exemption',
    tag: 'The exemption everyone asks about',
    name: 'Research & statistical processing exemption',
    sub: 'DPDP Act s. 17(2)(b) read with the Second Schedule',
    authority: 'MeitY',
    status: 'Conditional; standards apply',
    tone: 'signal',
    summary:
      'Processing for research, archiving or statistical purposes is exempted from most of the Act’s obligations, provided it is carried out in accordance with prescribed standards. This is the single most consequential provision for hospital AI, and the most frequently over-read.',
    obligations: [
      {
        ref: 'S. 17(2)(b)',
        text: 'The exemption attaches to the purpose, not the organisation. The moment output is used to take a decision specific to an individual patient, you are outside it.',
      },
      {
        ref: 'Second Schedule',
        text: 'Conditions include lawful, fair and transparent processing, purpose and data minimisation, accuracy, storage limitation, security safeguards and accountability. In practice: an ethics-committee-approved protocol with a defined cohort and a defined endpoint.',
      },
      {
        ref: 'Practice',
        text: 'Institutional Ethics Committee review under the ICMR National Ethical Guidelines remains the operative gate for research use. The exemption does not displace it.',
      },
    ],
    fl: {
      helps: [
        'A federated protocol maps cleanly onto Second Schedule conditions: minimisation is structural, because only aggregates leave.',
        'Every round is bound to a registered protocol ID and cohort definition, giving your IEC an auditable record of exactly what was trained on.',
      ],
      owed: [
        'Deploying the resulting model back into care is a new purpose. It needs its own basis, and likely CDSCO clearance.',
        'Do not assume the exemption covers commercial model development. Read it with counsel before you rely on it.',
      ],
    },
    link: 'https://www.meity.gov.in/data-protection-framework',
  },
  {
    id: 'abdm',
    short: 'ABDM HDMP',
    tag: 'Sectoral policy',
    name: 'ABDM Health Data Management Policy',
    sub: 'with the National Digital Health Blueprint',
    authority: 'National Health Authority',
    status: 'In force · ABDM integration effectively mandatory for empanelled hospitals',
    tone: 'signal',
    summary:
      'ABDM is itself built on a federated architecture: health records stay with the health information provider that created them, and move only against a granular, revocable consent artefact. Federated learning is the natural extension of that principle from record retrieval to model training.',
    obligations: [
      {
        ref: 'HDMP',
        text: 'Consent must be explicit, informed, granular by purpose, data type and duration, revocable, and recorded as an auditable consent artefact.',
      },
      {
        ref: 'HDMP',
        text: 'No commercial exploitation of health data without consent. Privacy by design and data minimisation are stated policy defaults.',
      },
      {
        ref: 'NDHB',
        text: 'Federated architecture: data stays with the creator. There is no central national repository of patient records to train against.',
      },
      {
        ref: 'EHR Standards 2016 · FHIR R4',
        text: 'Interoperability via SNOMED CT, LOINC and FHIR R4 resources; ABHA as the linkage identifier.',
      },
    ],
    fl: {
      helps: [
        'You do not have to argue that federation is acceptable, because ABDM already assumes it. The policy’s own architecture is the precedent.',
        'Samhita nodes read from your FHIR R4 layer, so the same interoperability work that earns DHIS incentives also makes you federation-ready.',
        'Consent artefact IDs are carried into the training manifest, so a cohort can be reconciled against ABDM consent records.',
      ],
      owed: [
        'AI training is a distinct purpose from care delivery or record sharing. Your existing ABDM consent artefact almost certainly does not cover it.',
        'ABHA-linked identifiers must be stripped before any local training job. The node enforces this, but the mapping is yours.',
      ],
    },
    link: 'https://abdm.gov.in/publications/policies_regulations',
  },
  {
    id: 'icmr',
    short: 'ICMR AI ethics',
    tag: 'Ethics',
    name: 'ICMR Ethical Guidelines for AI in Biomedical Research & Healthcare',
    sub: '2023 · a living document',
    authority: 'Indian Council of Medical Research',
    status: 'In force · IEC-enforced',
    tone: 'signal',
    summary:
      'India’s first dedicated ethical framework for medical AI. It is the instrument your Institutional Ethics Committee will actually apply when you bring a federated study to them, and it is explicit that accountability cannot be delegated to the vendor.',
    obligations: [
      {
        ref: 'Autonomy',
        text: 'Informed consent for AI-specific use of data, with the patient told that an AI system is involved and what it does.',
      },
      {
        ref: 'Safety & risk minimisation',
        text: 'Validation before deployment, human oversight in the loop, and a defined mechanism for when the model is wrong.',
      },
      {
        ref: 'Fairness',
        text: 'Test for bias across sex, age, region, caste, socioeconomic status and site. A model trained on five metro tertiary centres is not validated for a district hospital.',
      },
      {
        ref: 'Accountability & transparency',
        text: 'A named accountable person, documented data provenance, and explainability proportionate to clinical risk.',
      },
      {
        ref: 'Governance',
        text: 'IEC review for AI research; data sharing must be governed and traceable.',
      },
    ],
    fl: {
      helps: [
        'Federation is the strongest available answer to the fairness requirement, because you can include a district hospital in training without that hospital exporting anything.',
        'Per-site evaluation is native: every round reports metrics per node, so site-level performance disparities surface before deployment rather than after.',
        'Provenance is recorded per contribution, giving the IEC a verifiable chain from consent artefact to model version.',
      ],
      owed: [
        'Bias testing is a clinical exercise, not an infrastructure one. We give you the per-site numbers; interpreting them is your investigators’ job.',
        'The named accountable person under the ICMR guidelines is at your institution, not at the vendor.',
      ],
    },
    link: 'https://www.icmr.gov.in/ethical-guidelines-for-application-of-artificial-intelligence-in-biomedical-research-and-healthcare',
  },
  {
    id: 'cdsco',
    short: 'CDSCO · SaMD',
    tag: 'Device regulation',
    name: 'CDSCO · Medical Devices Rules, 2017',
    sub: 'Software as a Medical Device',
    authority: 'Central Drugs Standard Control Organization',
    status: 'Applies at deployment, not at training',
    tone: 'statute',
    summary:
      'Software intended for diagnosis, prevention, monitoring or treatment is a medical device in India and is risk-classified A to D. Research training is outside this; the regulatory trigger is the intended clinical claim you make when you deploy.',
    obligations: [
      {
        ref: 'MDR 2017',
        text: 'Risk classification A–D by intended use; licensing via the State or Central Licensing Authority accordingly.',
      },
      {
        ref: 'MDR 2017',
        text: 'Clinical performance evaluation appropriate to class, quality management system, and post-market surveillance with adverse event reporting.',
      },
      {
        ref: 'Practice',
        text: 'Model updates matter. A continuously-learning model that changes its behaviour after clearance raises change-control questions India has not fully settled, so plan for versioned, frozen releases.',
      },
    ],
    fl: {
      helps: [
        'Every global model is content-addressed and immutable, so the exact artefact you submit is the exact artefact in production.',
        'The training manifest (sites, cohort sizes, rounds, per-site metrics) is the evidence package a performance evaluation needs.',
      ],
      owed: [
        'Licensing is the manufacturer’s obligation. If your hospital makes the clinical claim, your hospital carries it.',
        'Do not ship an online-learning model into care and assume the clearance follows it. Freeze, evaluate, submit, then deploy.',
      ],
    },
    link: 'https://cdsco.gov.in/opencms/opencms/en/Medical-Device-Diagnostics/Medical-Device-Diagnostics/',
  },
  {
    id: 'intl',
    short: 'HIPAA · GDPR · AI Act',
    tag: 'Cross-border',
    name: 'HIPAA · GDPR · EU AI Act',
    sub: 'when your federation crosses a border',
    authority: 'OCR (US) · EU/EEA supervisory authorities',
    status: 'Relevant to multi-country collaborations',
    tone: 'neutral',
    summary:
      'Indian hospitals increasingly join multi-country consortia. Federation changes the analysis materially, because the thing crossing the border is a gradient tensor rather than a patient record. But it does not make the analysis go away.',
    obligations: [
      {
        ref: 'HIPAA',
        text: 'PHI never leaves the covered entity, so no BAA is needed for record access. Safe Harbor and Expert Determination de-identification standards still shape what the local node may read.',
      },
      {
        ref: 'GDPR Art. 9',
        text: 'Health data processing needs an Art. 9(2) condition, typically explicit consent or scientific research under Art. 9(2)(j) with Art. 89 safeguards.',
      },
      {
        ref: 'GDPR Ch. V',
        text: 'Chapter V transfer machinery is confined to the model updates. With secure aggregation and DP applied, most consortia treat this as a narrow, documentable question rather than an SCC exercise over patient records.',
      },
      {
        ref: 'EU AI Act',
        text: 'Medical AI is generally high-risk: risk management, data governance, technical documentation, logging, human oversight and post-market monitoring.',
      },
    ],
    fl: {
      helps: [
        'Reduces a cross-border patient-data transfer problem to a cross-border model-artefact problem, which is a far smaller surface.',
        'Data governance evidence required by the EU AI Act is produced as a by-product of every training round.',
      ],
      owed: [
        'Model updates may still be personal data under GDPR in the regulator’s view. Assume so, and document your DP parameters accordingly.',
        'Each participating site remains responsible under its own regime. Federation coordinates; it does not consolidate liability.',
      ],
    },
    link: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
  },
]

/** Centralised pooling vs. federated, obligation by obligation. */
export const MAPPING = [
  {
    obligation: 'Cross-border transfer of patient data',
    ref: 'S. 16 · Rule 15',
    central: { verdict: 'bad', text: 'Records leave India. Full Rule 15 analysis, plus any Government-specified restriction.' },
    fed: { verdict: 'good', text: 'No patient record leaves the premises, let alone the country.' },
  },
  {
    obligation: 'Purpose limitation',
    ref: 'S. 5, 6',
    central: { verdict: 'bad', text: 'Once pooled, the copy outlives the purpose it was collected for.' },
    fed: { verdict: 'good', text: 'Enforced per job: a round runs only against the consented cohort.' },
  },
  {
    obligation: 'Erasure on consent withdrawal',
    ref: 'S. 8(7) · Rule 8',
    central: { verdict: 'bad', text: 'You must locate and delete every downstream copy, at every partner.' },
    fed: { verdict: 'warn', text: 'Delete locally and exclude from future rounds. Prior model versions may retain a trace, so retraining cadence is a policy decision.' },
  },
  {
    obligation: 'Breach notification exposure',
    ref: 'S. 8(6) · Rule 7',
    central: { verdict: 'bad', text: 'A single pooled repository is a single catastrophic target across all partners.' },
    fed: { verdict: 'good', text: 'No aggregated honeypot exists. Blast radius stays inside one hospital.' },
  },
  {
    obligation: 'Security safeguards',
    ref: 'S. 8(4) · Rule 6',
    central: { verdict: 'warn', text: 'You inherit the weakest partner’s controls.' },
    fed: { verdict: 'good', text: 'Each site keeps its own perimeter; no inbound access is granted to anyone.' },
  },
  {
    obligation: 'Algorithmic due diligence (SDF)',
    ref: 'S. 10 · Rule 13',
    central: { verdict: 'warn', text: 'Required, and hard to evidence across an opaque pooled pipeline.' },
    fed: { verdict: 'warn', text: 'Still required. Per-round manifests and per-site metrics make it evidenceable.' },
  },
  {
    obligation: 'Consent artefact alignment (ABDM)',
    ref: 'HDMP',
    central: { verdict: 'bad', text: 'Pooling conflicts with ABDM’s data-stays-with-creator architecture.' },
    fed: { verdict: 'good', text: 'Architecturally aligned: the same principle, applied to training.' },
  },
  {
    obligation: 'Site-level fairness evaluation',
    ref: 'ICMR 2023',
    central: { verdict: 'warn', text: 'Possible, but provenance is often lost in the pooling step.' },
    fed: { verdict: 'good', text: 'Native: every round reports metrics per participating site.' },
  },
]

export const FAQS = [
  {
    q: 'Do we still need patient consent if the data never leaves?',
    a: 'Almost certainly yes. Training on records is processing under the DPDP Act regardless of where it happens, so it needs a lawful basis. The realistic paths are a specific AI-training consent, or the s. 17(2)(b) research exemption with Second Schedule standards and Institutional Ethics Committee approval. What federation removes is the disclosure to a third party, which is a separate and much harder thing to consent to.',
  },
  {
    q: 'Can model updates leak information about individual patients?',
    a: 'Yes, in principle. This is a real and well-documented research finding, not a hypothetical. Membership-inference and gradient-inversion attacks have recovered training signal from raw updates. It is precisely why we do not ship raw updates: secure aggregation means the coordinator only ever sees a sum across sites, and differential privacy bounds what any single patient can contribute to that sum. Treat any vendor who tells you gradients are inherently anonymous as a red flag.',
  },
  {
    q: 'Where does the aggregation server run?',
    a: 'Your choice, and it is a compliance decision rather than a technical one. Options are a Government Community Cloud or MeitY-empanelled provider in India, a consortium-hosted node at a lead institution, or your own data centre if you are the convening site. The coordinator never receives patient data in any configuration, but hosting it in India keeps the entire system within one jurisdiction, which is the simplest story to tell a regulator.',
  },
  {
    q: 'What does a hospital actually have to install?',
    a: 'One Samhita node: a containerised service on your infrastructure, inside your network. It reads from your HIS or FHIR R4 layer over a read-only connection, trains locally on your GPU or CPU, and makes a single outbound TLS connection to the coordinator. It accepts no inbound connections. Typical deployment for a hospital with an existing FHIR layer runs four to six weeks including IT security review.',
  },
  {
    q: 'Do we need CDSCO approval to participate?',
    a: 'Not to train. Research and model development sit outside the Medical Devices Rules. The regulatory trigger is deployment into care with a clinical claim. At that point the software is a medical device, risk-classified A to D, and needs the corresponding licence. We supply the training manifest and per-site performance evidence that a submission needs; the licence itself belongs to whoever makes the clinical claim.',
  },
  {
    q: 'What happens if a hospital leaves the federation?',
    a: 'It stops contributing from the next round. Its historical contributions are already dissolved into aggregate model weights and cannot be extracted or attributed back, which is a genuine consequence worth understanding before you join, because it also means past contributions cannot be surgically withdrawn. Governance agreements should set out exit terms, rights to the model at exit, and retraining obligations up front. We provide a template consortium agreement as a starting point for your counsel.',
  },
  {
    q: 'How much accuracy do we give up versus pooling the data?',
    a: 'Under IID conditions, federated averaging converges close to centralised training. Real hospital data is not IID, because scanner vendors, case mix and coding practice differ by site, so expect a gap, typically a few points, which is why we ship personalisation layers that adapt the global model to your site. Differential privacy costs additional accuracy on top, and how much depends entirely on your epsilon. The honest comparison is not federated versus pooled; it is federated versus the model you can train alone, because pooling was never legally available to you.',
  },
  {
    q: 'Is the site’s compliance content legal advice?',
    a: 'No. It is an informational summary maintained for hospital DPOs, IT leaders and ethics committees, with citations back to the primary instruments so your counsel can verify each point. Regulatory positions in India are moving quickly: the DPDP Rules were notified in November 2025 and substantive obligations do not commence until 13 May 2027, with further Government notifications expected in between. Engage counsel for your specific deployment.',
  },
]
