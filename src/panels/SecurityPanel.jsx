import { Icons } from '../lib/ui'

const CONTROLS = [
  {
    icon: Icons.server,
    title: 'Runs inside your perimeter',
    body: 'A containerised node on your infrastructure: bare metal, your VMware estate or your own cloud tenancy. We never host your data because we never receive it.',
  },
  {
    icon: Icons.lock,
    title: 'Outbound-only, single destination',
    body: 'One egress rule to the coordinator over mutual TLS. No inbound ports, no VPN into your network, no vendor jump host. A short conversation with your firewall team.',
  },
  {
    icon: Icons.eye,
    title: 'Read-only, scoped data access',
    body: 'A service account with read access to the FHIR R4 resources the protocol declares, and nothing wider. Identifiers are stripped at read time, before a tensor exists.',
  },
  {
    icon: Icons.shield,
    title: 'Keys you hold',
    body: 'Aggregation masks and model-signing keys are generated in your node and can live in your HSM. A coordinator compromise does not yield readable site updates.',
  },
  {
    icon: Icons.doc,
    title: 'Per-round audit manifest',
    body: 'Every round writes an immutable record: protocol ID, cohort definition, consent artefact references, record counts, DP budget spent and the resulting model hash.',
  },
  {
    icon: Icons.pulse,
    title: 'Kill switch and budget ceiling',
    body: 'Your DPO can halt participation mid-round from your own console. Cumulative privacy budget is enforced in the node, and once spent it refuses to train rather than continuing silently.',
  },
]

const SPECS = [
  ['Deployment', 'Docker / Podman · K8s optional'],
  ['Minimum node', '8 vCPU · 32 GB · 500 GB'],
  ['Accelerator', 'Optional; T4 class or better'],
  ['Data interface', 'FHIR R4 · HL7 v2 · DICOMweb'],
  ['Egress', '443/TCP out, one host, mTLS'],
  ['Inbound', 'None'],
  ['Identity', 'SAML / OIDC against your IdP'],
  ['Typical rollout', '4–6 weeks incl. security review'],
]

export default function SecurityPanel() {
  return (
    <div>
      <p className="max-w-[74ch] text-[0.94rem] leading-[1.7] text-ink-600">
        The architecture is deliberately boring where it matters. One container, one outbound connection, read-only
        access to the resources your protocol declares, and an audit trail your DPO can read without our help.
      </p>

      <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        {CONTROLS.map((c) => (
          <div key={c.title} className="flex gap-3.5">
            <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-200 bg-white text-signal-700">
              <c.icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[0.92rem] font-semibold text-ink-900">{c.title}</h3>
              <p className="mt-1 text-[0.8rem] leading-relaxed text-ink-600">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
        {SPECS.map(([k, v]) => (
          <div key={k} className="bg-white px-4 py-3.5">
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ink-400">{k}</div>
            <div className="mt-1 text-[0.82rem] font-medium leading-snug text-ink-800">{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
