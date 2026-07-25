import { useState } from 'react'
import {
  ArrowRight, BookOpen, Check, ChevronDown, ClipboardCheck, ExternalLink,
  FileKey, Fingerprint, Menu, Network, ScanSearch, ShieldCheck, X
} from 'lucide-react'

const controls = [
  { n: '01', title: 'Governance & Ownership', text: 'Assign accountability for output systems, their data, configurations, service access, and lifecycle decisions.' },
  { n: '02', title: 'Identity & Access', text: 'Control who can administer, use, release, retrieve, and service output systems and the information they handle.' },
  { n: '03', title: 'Secure Configuration', text: 'Establish approved baselines for protocols, ports, certificates, firmware, storage, logging, and administrative settings.' },
  { n: '04', title: 'Data Protection', text: 'Protect information while it is transmitted, processed, stored, printed, scanned, released, and disposed of.' },
  { n: '05', title: 'Visibility & Evidence', text: 'Maintain the logs, inventories, ownership records, and event evidence needed to understand what happened and when.' },
  { n: '06', title: 'Service & Supply Chain', text: 'Govern external access, replacement components, firmware sources, credentials, remote tools, and third-party dependencies.' },
  { n: '07', title: 'Recovery & Continuity', text: 'Design for safe recovery, documented escalation, operational availability, and continuity when normal support is unavailable.' },
  { n: '08', title: 'Lifecycle Assurance', text: 'Evaluate acquisition, deployment, maintenance, reassignment, decommissioning, and verified data removal as one control system.' }
]

const mappings = [
  ['NIST CSF 2.0', 'Govern, Identify, Protect, Detect, Respond, and Recover applied to output environments.'],
  ['NIST SP 800-53', 'Control families translated into practical questions for devices, workflows, access, evidence, and service.'],
  ['NIST SP 800-171', 'Safeguarding requirements considered where output systems process or expose controlled information.'],
  ['Zero Trust', 'No implicit trust for users, devices, administrators, service paths, or location.'],
  ['Sector Requirements', 'Contextual guidance for healthcare, government, defense, education, finance, and industry.']
]

function Header() {
  const [open, setOpen] = useState(false)
  const links = [['The Issue', '#issue'], ['OICC Controls', '#controls'], ['Standards', '#standards'], ['Industries', '#industries'], ['About', '#about']]
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Output Security Institute home">
      <span className="brand-mark" aria-hidden="true"><span>O</span><span>S</span><span>I</span></span>
      <span><strong>Output Security</strong><em>Institute</em></span>
    </a>
    <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
      {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-action" href="#resources" onClick={() => setOpen(false)}>Resources <ArrowRight size={15}/></a>
    </nav>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
  </header>
}

function App() {
  return <div id="top">
    <Header />
    <main>
      <section className="hero">
        <div className="eyebrow"><span></span> Independent guidance for output security</div>
        <h1>Security does not end<br/>at the <em>screen.</em></h1>
        <p className="hero-copy">Organizations protect networks, identities, applications, and data. Yet the systems that turn digital information into physical information often remain outside the same governance.</p>
        <div className="hero-actions">
          <a className="button primary" href="#controls">Explore the OICC framework <ArrowRight size={18}/></a>
          <a className="text-link" href="#issue">Understand the issue <ChevronDown size={18}/></a>
        </div>
        <div className="boundary-map" aria-label="Diagram showing information crossing the digital and physical boundary">
          <div className="map-label digital">DIGITAL ENVIRONMENT</div>
          <div className="map-node"><Network/><span>Network</span></div>
          <div className="map-line"></div>
          <div className="map-core"><Fingerprint/><b>OUTPUT<br/>SYSTEM</b><small>THE OVERLOOKED ENDPOINT</small></div>
          <div className="map-line"></div>
          <div className="map-node"><FileKey/><span>Physical information</span></div>
          <div className="map-label physical">PHYSICAL ENVIRONMENT</div>
        </div>
      </section>

      <section className="issue section" id="issue">
        <div className="section-number">01 / THE ISSUE</div>
        <div className="issue-grid">
          <h2>Information crosses a boundary.<br/><em>Governance often does not.</em></h2>
          <div>
            <p>Printers, copiers, scanners, and document workflows authenticate users, store information, communicate across networks, run firmware, use certificates, and create physical records.</p>
            <p>They are not simply office equipment. They are connected systems operating at the boundary between digital control and physical custody.</p>
          </div>
        </div>
        <div className="questions">
          <article><span>01</span><h3>Who owns the risk?</h3><p>IT may manage connectivity. Facilities may manage equipment. Procurement may manage vendors. Security accountability can disappear between them.</p></article>
          <article><span>02</span><h3>Who can reach the data?</h3><p>Users, administrators, service personnel, applications, embedded storage, and remote tools can each create a different access path.</p></article>
          <article><span>03</span><h3>What evidence remains?</h3><p>When an event occurs, organizations may lack the logs, identity records, configuration history, and chain of custody needed to explain it.</p></article>
        </div>
      </section>

      <section className="controls section dark" id="controls">
        <div className="section-number">02 / THE FRAMEWORK</div>
        <div className="controls-intro">
          <div><div className="framework-badge">OICC <small>v1.0 / FOUNDATIONAL DRAFT</small></div><h2>Operational Infrastructure<br/>Critical Controls</h2></div>
          <p>The OICC framework organizes the decisions needed to govern output systems across security, operations, service, and lifecycle. It is designed to help organizations ask better questions before selecting products or adding controls.</p>
        </div>
        <div className="control-grid">
          {controls.map((c, i) => <article key={c.n} className="control-card"><span>{c.n}</span>{[ShieldCheck,Fingerprint,Check,FileKey,ScanSearch,Network,ClipboardCheck,BookOpen][i]({size:25})}<h3>{c.title}</h3><p>{c.text}</p><a href="#resources" aria-label={`Learn about ${c.title}`}>View control objective <ArrowRight size={15}/></a></article>)}
        </div>
      </section>

      <section className="standards section" id="standards">
        <div className="section-number">03 / STANDARDS MAPPING</div>
        <div className="standards-grid">
          <div><h2>Translate standards into<br/><em>operational decisions.</em></h2><p>OSI does not create regulatory requirements or certify compliance. It helps organizations interpret established security principles in the context of output systems.</p></div>
          <div className="mapping-list">
            {mappings.map(([name, text], i) => <article key={name}><span>0{i+1}</span><div><h3>{name}</h3><p>{text}</p></div><ExternalLink size={18}/></article>)}
          </div>
        </div>
      </section>

      <section className="industries section" id="industries">
        <div className="section-number">04 / OPERATIONAL CONTEXT</div>
        <h2>Controls become meaningful<br/>when applied to the <em>operation.</em></h2>
        <div className="industry-grid">
          {[
            ['Healthcare','Patient information, clinical availability, qualified internal teams, and controlled service access.'],
            ['Government & Defense','Controlled information, air-gapped environments, identity, evidence, and mission continuity.'],
            ['Financial Services','Customer information, auditability, retention, secure release, and third-party oversight.'],
            ['Education','Distributed environments, shared devices, student records, limited resources, and continuity.'],
            ['Manufacturing','Production documents, intellectual property, segmented networks, uptime, and remote locations.'],
            ['Legal & Professional','Client confidentiality, matter-level access, chain of custody, and verified disposal.']
          ].map(([title,text]) => <article key={title}><span></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="resources section" id="resources">
        <div className="resource-copy"><div className="section-number">05 / PRACTICAL GUIDANCE</div><h2>Begin with the questions<br/>your environment must answer.</h2><p>The first OSI field guide will help security, IT, compliance, operations, and procurement teams examine ownership, access, data handling, service dependency, evidence, and recovery together.</p><a className="button light" href="mailto:info@outputsecurityinstitute.org?subject=OSI Field Guide Updates">Request publication updates <ArrowRight size={18}/></a></div>
        <div className="document-card"><div className="doc-top"><span>OSI / FIELD GUIDE 01</span><ClipboardCheck size={34}/></div><div><small>FORTHCOMING</small><h3>Output Security<br/>Assessment Guide</h3><p>A cross-functional starting point for evaluating output systems as part of organizational security and continuity.</p></div><div className="doc-foot"><span>12 CONTROL AREAS</span><span>V1.0</span></div></div>
      </section>

      <section className="about section" id="about">
        <div className="section-number">06 / ABOUT OSI</div>
        <div className="about-grid"><h2>An independent initiative for a boundary that deserves clearer governance.</h2><div><p>The Output Security Institute develops practical, manufacturer-neutral guidance for the security, integrity, and continuity of systems that create, move, and manage physical information.</p><p>OSI is an independent educational initiative. It is not affiliated with or endorsed by NIST, and it does not certify products, organizations, or regulatory compliance.</p><a className="text-link dark-link" href="mailto:info@outputsecurityinstitute.org">Contribute to the discussion <ArrowRight size={17}/></a></div></div>
      </section>
    </main>
    <footer><div className="brand footer-brand"><span className="brand-mark"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></div><p>Security beyond the screen.</p><div><a href="#controls">OICC Framework</a><a href="#standards">Standards</a><a href="#about">Transparency</a></div><small>© {new Date().getFullYear()} Output Security Institute. Educational guidance only.</small></footer>
  </div>
}

export default App
