import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ClipboardCheck, ExternalLink,
  FileKey, Fingerprint, Menu, Network, ScanSearch, Search, ShieldCheck, X,
  Monitor, Printer, FileOutput, Archive, Trash2, Users, CalendarDays, Newspaper
} from 'lucide-react'

const august14Brief = [
  {
    title: 'CMMC Phase II suspended, but security requirements remain',
    category: 'CMMC / Federal information',
    confirmed: 'On July 13, the Department suspended CMMC Phase II, including the November 10 implementation date and subsequent milestones, pending a 60-day review. Phase I self-assessments remain in effect. Contractors must still protect covered defense information, and NIST SP 800-171 Rev. 2 continues to be enforced through self-assessments and selected government assessments.',
    why: 'The announcement pauses part of the certification structure. It does not suspend the responsibility to protect covered federal information.',
    implication: 'Organizations should distinguish delayed certification milestones from the continuing obligation to safeguard covered information, including information processed, transmitted, stored, or physically reproduced by output systems.',
    source: 'Official Department announcement',
    url: 'https://business.defense.gov/Engage/News/Article/4542563/forging-the-arsenal-of-freedom-department-of-war-suspends-cmmc-phase-ii-require/'
  },
  {
    title: 'Windows now prefers IPP for new printer installations',
    category: 'Windows / IPP',
    confirmed: 'Microsoft’s Windows Ready Print rollout makes the Windows inbox IPP driver the preferred option for new installations when supported. Existing queues are unaffected. Windows Protected Print Mode remains a separate, stronger setting that exclusively permits the modern Windows print stack.',
    why: 'IPP support is moving from an optional compatibility feature toward a basic Windows deployment requirement. Capable Print Support Apps are increasingly important where organizations need advanced functionality without legacy drivers.',
    implication: 'Output-security teams need a clear distinction among IPP compatibility, Windows Ready Print, Windows Protected Print Mode, and Print Support Apps before making deployment or procurement decisions.',
    source: 'Microsoft announcement',
    url: 'https://techcommunity.microsoft.com/blog/partnernews/introducing-windows-ready-print-and-modernized-driver-selection/4526895',
    source2: 'Windows update documentation',
    url2: 'https://support.microsoft.com/en-us/topic/june-23-2026-kb5095093-os-builds-26200-8737-and-26100-8737-preview'
  },
  {
    title: 'Federal IoT acquisition guidance is open for comment',
    category: 'NIST / Acquisition',
    confirmed: 'Draft NIST SP 800-213 Rev. 1 treats an IoT product as a system element whose acquisition and integration can change the receiving system’s risk assessment and required controls. Comments close August 24, 2026.',
    inference: 'NIST does not expressly classify every printer as an IoT product. Networked printers and multifunction devices nevertheless fit the publication’s architectural reasoning when their integration changes system risk.',
    why: 'The draft provides an authoritative pathway for evaluating connected products by the risks they introduce into an information system, rather than only by their primary business function.',
    implication: 'Output-device acquisition should examine firmware integrity and support, local storage, service pathways, identity integration, exportable audit records, network and cloud connections, and end-of-life sanitization.',
    source: 'NIST announcement and draft',
    url: 'https://csrc.nist.gov/News/2026/nist-releases-sp-800-213r1-ipd'
  },
  {
    title: 'NIST updates storage-security guidance',
    category: 'NIST / Device data',
    confirmed: 'Draft NIST SP 800-209 Rev. 1 expands guidance concerning authentication, authorization, encryption, configuration, auditability, and media protection. Comments close September 8, 2026.',
    inference: 'The publication addresses broader storage infrastructure, not multifunction-device storage specifically. Its principles remain relevant to devices that retain print jobs, scans, address books, credentials, configuration data, or logs.',
    why: 'Device security cannot stop at network access. Organizations also need to understand what a device retains throughout its operational life.',
    implication: 'A device-data lifecycle review should identify what is stored, why it is retained, who can access or export it, when it is deleted, whether deletion can be verified, and how media is sanitized when equipment is reassigned, returned, or disposed of.',
    source: 'NIST announcement and draft',
    url: 'https://csrc.nist.gov/News/2026/security-guidelines-storage-infrastructure-draft'
  },
  {
    title: 'Printer API exposed credentials without authentication',
    category: 'Vulnerability / API authorization',
    confirmed: 'CERT/CC disclosed that affected HP DeskJet 2800 firmware permits unauthenticated API requests to retrieve Wi-Fi credentials, SNMP settings, cloud-registration metadata, and device-security information. CERT/CC reported no available firmware patch as of its July 6 revision and recommended isolation, restricted management access, access-control lists, and disabling unnecessary Wi-Fi Direct, SNMP, discovery, and cloud functions.',
    why: 'The visible interface required authentication, but the underlying API did not. A secure-looking control panel does not prove that every device service enforces the same protections.',
    implication: 'Output-security validation should include API authorization, segmentation, unnecessary-service reduction, management-path restrictions, and independent confirmation that protections apply below the visible interface.',
    source: 'CERT/CC VU#828543',
    url: 'https://kb.cert.org/vuls/id/828543'
  }
]

const library = [
  {title:'NIST Cybersecurity Framework 2.0',source:'National Institute of Standards and Technology',type:'Framework',industry:'All Industries',control:'Governance & Ownership',date:'2024-02-26',reviewed:'2026-07-18',url:'https://www.nist.gov/cyberframework',summary:'A risk-based framework organized around Govern, Identify, Protect, Detect, Respond, and Recover.',relevance:'Provides the governing structure for bringing output systems into an organization-wide cybersecurity risk program.'},
  {title:'NIST SP 800-53 Rev. 5',source:'NIST Computer Security Resource Center',type:'Security Controls',industry:'Government & Defense',control:'Secure Configuration',date:'2020-12-10',reviewed:'2026-07-18',url:'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final',summary:'A flexible catalog of security and privacy controls for information systems and organizations.',relevance:'Supports control selection for access, configuration, audit, communications, maintenance, media, supply chain, and system integrity.'},
  {title:'NIST SP 800-53A Rev. 5',source:'NIST Computer Security Resource Center',type:'Assessment Guidance',industry:'Government & Defense',control:'Visibility & Evidence',date:'2022-01-25',reviewed:'2026-07-18',url:'https://csrc.nist.gov/pubs/sp/800/53/a/r5/final',summary:'Assessment procedures and methodology for evaluating security and privacy controls.',relevance:'Helps turn an output-security control statement into evidence that can be examined, tested, and documented.'},
  {title:'NIST SP 800-171 Rev. 3',source:'NIST Computer Security Resource Center',type:'Security Requirements',industry:'Government & Defense',control:'Data Protection',date:'2024-05-14',reviewed:'2026-07-18',url:'https://csrc.nist.gov/pubs/sp/800/171/r3/final',summary:'Recommended security requirements for protecting the confidentiality of CUI in nonfederal systems and organizations.',relevance:'Relevant when output devices, queues, workflows, storage, service processes, or physical documents handle controlled information.'},
  {title:'Zero Trust Maturity Model Version 2.0',source:'Cybersecurity and Infrastructure Security Agency',type:'Implementation Guidance',industry:'Government & Defense',control:'Identity & Access',date:'2023-04-11',reviewed:'2026-07-18',url:'https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model',summary:'A maturity model for advancing identity, device, network, application, workload, and data protections.',relevance:'Provides a useful lens for questioning implicit trust in output endpoints, administrators, users, service paths, and device data.'},
  {title:'Adapting Zero Trust Principles to Operational Technology',source:'CISA and Joint Authoring Organizations',type:'Implementation Guidance',industry:'Manufacturing',control:'Recovery & Continuity',date:'2026-04-29',reviewed:'2026-07-18',url:'https://www.cisa.gov/sites/default/files/2026-04/joint-guide-adapting-zero-trust-principles-to-operational-technology_508c.pdf',summary:'Joint guidance for applying Zero Trust principles while respecting safety, availability, and operational constraints.',relevance:'Useful where output systems support production, segmented environments, critical processes, or locations where availability shapes security decisions.'}
]

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
  const links = [['Why It Matters', '/#why'], ['Follow a Document', '/#lifecycle'], ['Weekly Brief', '/briefings'], ['OICC Controls', '/#controls'], ['Knowledge Center', '/knowledge']]
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Output Security Institute home">
      <span className="brand-mark" aria-hidden="true"><span>O</span><span>S</span><span>I</span></span>
      <span><strong>Output Security</strong><em>Institute</em></span>
    </a>
    <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
      {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-action" href="mailto:info@outputsecurityinstitute.org?subject=Question for OSI" onClick={() => setOpen(false)}>Ask OSI <ArrowRight size={15}/></a>
    </nav>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
  </header>
}

function KnowledgeCenterPage(){
  const [query,setQuery]=useState('')
  const [type,setType]=useState('All')
  const types=['All',...new Set(library.map(x=>x.type))]
  const visible=library.filter(x=>(type==='All'||x.type===type)&&`${x.title} ${x.source} ${x.industry} ${x.control}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="kc-page"><Header/><main>
    <section className="kc-hero"><a href="/" className="kc-back"><ArrowLeft size={15}/> Output Security Institute</a><div className="eyebrow"><span></span> Curated primary-source guidance</div><h1>Knowledge<br/><em>Center.</em></h1><p>Standards, requirements, implementation guidance, and evidence organized for the security and continuity of output environments.</p></section>
    <section className="kc-library">
      <div className="kc-toolbar"><label><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search publications, controls, or industries"/></label><div className="kc-filters">{types.map(t=><button className={type===t?'active':''} key={t} onClick={()=>setType(t)}>{t}</button>)}</div></div>
      <div className="kc-count"><span>{String(visible.length).padStart(2,'0')} RESOURCES</span><span>LAST LIBRARY REVIEW: JULY 18, 2026</span></div>
      <div className="kc-results">{visible.map((item,i)=><article key={item.title}>
        <div className="kc-meta"><span>{String(i+1).padStart(2,'0')}</span><b>{item.type}</b><span>{item.industry}</span></div>
        <div className="kc-body"><small>{item.source}</small><h2>{item.title}</h2><p>{item.summary}</p><div className="kc-relevance"><strong>OUTPUT SECURITY RELEVANCE</strong><p>{item.relevance}</p></div></div>
        <div className="kc-record"><span><b>Published</b>{item.date}</span><span><b>Last reviewed</b>{item.reviewed}</span><span><b>OICC mapping</b>{item.control}</span><a href={item.url} target="_blank" rel="noreferrer">Open original source <ExternalLink size={15}/></a></div>
      </article>)}</div>
      <aside className="kc-disclosure"><ShieldCheck size={25}/><div><strong>Source and interpretation standard</strong><p>OSI links to the original publisher whenever possible. “Output Security Relevance” is OSI interpretation, not language from or endorsement by the source organization. Inclusion does not establish compliance.</p></div></aside>
    </section>
  </main></div>
}

function BriefingsPage(){
  return <div className="brief-page"><Header/><main>
    <section className="brief-hero">
      <a href="/" className="kc-back"><ArrowLeft size={15}/> Output Security Institute</a>
      <div className="eyebrow"><span></span> Primary-source developments for output environments</div>
      <h1>OSI Security<br/><em>Brief.</em></h1>
      <div className="brief-hero-meta"><span><CalendarDays size={17}/> August 14, 2026</span><span>Baseline edition</span><span>5 material developments</span></div>
      <p>OSI identifies developments that deserve attention, explains why they matter to output systems and physical information, and distinguishes confirmed facts from OSI interpretation.</p>
    </section>

    <section className="brief-editorial">
      <strong>Editorial standard</strong>
      <p>OSI prioritizes authoritative primary sources, excludes routine promotion and recycled commentary, and states when a conclusion is an inference rather than source language. Inclusion does not establish endorsement or compliance.</p>
    </section>

    <section className="brief-list">
      {august14Brief.map((item,i)=><article className="brief-item" key={item.title}>
        <div className="brief-index"><span>{String(i+1).padStart(2,'0')}</span><small>{item.category}</small></div>
        <div className="brief-content"><h2>{item.title}</h2>
          <div className="brief-fact"><strong>Confirmed</strong><p>{item.confirmed}</p></div>
          {item.inference&&<div className="brief-inference"><strong>OSI inference</strong><p>{item.inference}</p></div>}
          <div className="brief-why"><strong>Why it matters</strong><p>{item.why}</p></div>
          <div className="brief-implication"><strong>Practical implication for output security</strong><p>{item.implication}</p></div>
        </div>
        <div className="brief-sources"><a href={item.url} target="_blank" rel="noreferrer">{item.source} <ExternalLink size={14}/></a>{item.url2&&<a href={item.url2} target="_blank" rel="noreferrer">{item.source2} <ExternalLink size={14}/></a>}</div>
      </article>)}
    </section>

    <section className="brief-none section">
      <div className="section-number">CATEGORIES WITHOUT MATERIAL DEVELOPMENTS</div>
      <h2>Silence is part of the <em>record.</em></h2>
      <p>No material new developments were identified for HIPAA Security Rule activity, new Zero Trust standards, or Epson-, Brother-, and Kyocera-specific security advisories during this review period.</p>
    </section>

    <section className="brief-priorities section">
      <div className="section-number">OSI PRIORITIES ARISING FROM THIS BRIEF</div>
      <ol>
        <li><span>01</span><p>Prepare OSI comments on NIST SP 800-213 Rev. 1 before August 24.</p></li>
        <li><span>02</span><p>Publish a plain-language explanation of Windows Ready Print, IPP, Windows Protected Print Mode, and Print Support Apps.</p></li>
        <li><span>03</span><p>Explain why the CMMC pause is not a pause in the responsibility to protect covered information.</p></li>
        <li><span>04</span><p>Develop an OICC Device Data Lifecycle control objective.</p></li>
        <li><span>05</span><p>Publish a neutral case study on API authorization and independent device validation.</p></li>
      </ol>
    </section>
  </main><footer><div className="brand footer-brand"><span className="brand-mark"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></div><p>Security beyond the screen.</p><div><a href="/briefings">Security Briefs</a><a href="/#controls">OICC Framework</a><a href="/knowledge">Knowledge Center</a></div><small>© {new Date().getFullYear()} Output Security Institute. Educational guidance only.</small></footer></div>
}

function App() {
  if(window.location.pathname.startsWith('/knowledge')) return <KnowledgeCenterPage/>
  if(window.location.pathname.startsWith('/briefings')) return <BriefingsPage/>
  return <div id="top">
    <Header />
    <main>
      <section className="hero">
        <div className="eyebrow"><span></span> A plain-language introduction to output security</div>
        <h1>What happens after<br/>someone presses <em>Print?</em></h1>
        <p className="hero-copy">A printer once put information on paper. Today, printers and scanners are connected to networks, applications, cloud services, people, and outside support. The technology changed. The responsibility for the information did not.</p>
        <div className="hero-actions">
          <a className="button primary" href="#lifecycle">Follow a document <ArrowRight size={18}/></a>
          <a className="text-link" href="#why">Why this matters <ChevronDown size={18}/></a>
        </div>
        <div className="hero-principle">
          <span>THE CENTRAL IDEA</span>
          <strong>The information does not become less sensitive when it leaves the screen.</strong>
        </div>
      </section>

      <section className="issue section" id="why">
        <div className="section-number">01 / WHAT CHANGED</div>
        <div className="issue-grid">
          <h2>The familiar office device became part of the <em>information system.</em></h2>
          <div>
            <p>Modern printers, copiers, scanners, and document workflows can authenticate users, process and store information, communicate across networks, run software, use certificates, connect to cloud services, and allow administrative or service access.</p>
            <p>They also create something most other endpoints do not: a physical document that can be retrieved, carried, copied, stored, shared, misplaced, retained, or destroyed.</p>
          </div>
        </div>
        <div className="questions">
          <article><span>THEN</span><h3>A largely mechanical device</h3><p>Its visible purpose was straightforward: receive a document and place it on paper.</p></article>
          <article><span>NOW</span><h3>A connected endpoint</h3><p>It exchanges information with users, systems, networks, applications, administrators, and support providers.</p></article>
          <article><span>STILL</span><h3>A physical information boundary</h3><p>Digital controls meet human custody when information becomes paper or is scanned into another destination.</p></article>
        </div>
      </section>

      <section className="lifecycle section" id="lifecycle">
        <div className="section-number">02 / FOLLOW ONE DOCUMENT</div>
        <div className="lifecycle-intro"><h2>One ordinary action creates a <em>complete lifecycle.</em></h2><p>Consider a customer record, medical document, financial report, student file, legal matter, or piece of intellectual property. Its sensitivity continues through every step.</p></div>
        <div className="journey" aria-label="The lifecycle of a printed document">
          {[
            [Monitor,'Created','Who created it, and what information does it contain?'],
            [Network,'Sent','Where does it travel, and which systems can reach it?'],
            [Printer,'Processed','Does the device store, log, route, or reproduce it?'],
            [FileOutput,'Released','Who is permitted to retrieve the physical output?'],
            [Users,'Used','Who sees, carries, copies, or shares the document?'],
            [Archive,'Retained','Where is it stored, and how long should it remain?'],
            [Trash2,'Destroyed','Can the organization verify its final disposition?']
          ].map(([Icon,title,text],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><Icon size={25}/><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <div className="continuity-statement"><strong>Digital security and physical custody are not separate stories.</strong><p>They are consecutive stages in the life of the same information.</p></div>
      </section>

      <section className="ownership section" id="ownership">
        <div className="section-number">03 / HOW THE BLIND SPOT DEVELOPED</div>
        <div className="ownership-grid"><div><h2>Responsibility is divided.<br/><em>The lifecycle is continuous.</em></h2><p>No one has to be careless for a gap to exist. Each group may manage its own responsibility while no one examines the entire chain.</p></div><div className="roles">{[
          ['IT','Connectivity and administration'],['Cybersecurity','Digital access and protection'],['Facilities','Equipment and physical location'],['Purchasing','Vendors and agreements'],['Service providers','Maintenance and remote support'],['Employees','Retrieval and physical handling'],['Records management','Retention and destruction']
        ].map(([role,work],i)=><article key={role}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{role}</strong><p>{work}</p></div></article>)}</div></div>
      </section>

      <section className="pathways section" id="pathways">
        <div className="section-number">04 / WHERE TO BEGIN</div>
        <div className="pathway-intro"><h2>You do not need to understand a framework to <em>begin.</em></h2><p>Start with the question closest to where you are today.</p></div>
        <div className="pathway-grid">
          <a className="path understand" href="#why"><small>UNDERSTAND</small><BookOpen/><h3>What am I missing?</h3><p>Learn how connected output systems and physical information create one continuous responsibility.</p><span>Start with the issue <ArrowRight size={16}/></span></a>
          <a className="path examine" href="#resources"><small>EXAMINE</small><ScanSearch/><h3>What should we review?</h3><p>Use practical questions to examine ownership, access, data handling, service, evidence, recovery, and lifecycle.</p><span>See what to examine <ArrowRight size={16}/></span></a>
          <a className="path act" href="#controls"><small>ACT</small><ShieldCheck/><h3>What should we put in place?</h3><p>Explore the OICC controls, authoritative standards, implementation guidance, and evidence expectations.</p><span>Use the controls <ArrowRight size={16}/></span></a>
        </div>
        <aside className="ask-osi"><div><strong>Not sure where to begin?</strong><p>Describe the condition you are trying to understand. You do not need to know the terminology.</p></div><a href="mailto:info@outputsecurityinstitute.org?subject=Help me begin with output security">Ask OSI a question <ArrowRight size={17}/></a></aside>
      </section>

      <section className="weekly-brief section" id="weekly-brief">
        <div className="section-number">05 / WEEKLY SECURITY BRIEF</div>
        <div className="weekly-grid">
          <div className="weekly-copy"><div className="weekly-date"><CalendarDays size={17}/> August 14, 2026</div><h2>What changed.<br/><em>Why it matters.</em></h2><p>OSI reviews authoritative sources for developments affecting output systems, physical information, security, compliance, and continuity. Each brief separates confirmed facts from OSI interpretation and records when no material development was found.</p><a className="button primary" href="/briefings">Read the August 14 brief <ArrowRight size={18}/></a></div>
          <div className="weekly-list"><span>LATEST BRIEF / 5 MATERIAL DEVELOPMENTS</span>{august14Brief.map((item,i)=><a href="/briefings" key={item.title}><b>{String(i+1).padStart(2,'0')}</b><p>{item.title}</p><ArrowRight size={16}/></a>)}</div>
        </div>
      </section>

      <section className="controls section dark" id="controls">
        <div className="section-number">06 / A STRUCTURED RESPONSE</div>
        <div className="controls-intro">
          <div><div className="framework-badge">OICC <small>v1.0 / FOUNDATIONAL DRAFT</small></div><h2>Operational Infrastructure<br/>Critical Controls</h2></div>
          <p>Once the lifecycle is visible, the OICC framework organizes the decisions needed to govern it across security, operations, service, and lifecycle. It helps organizations move from recognition to evidence-based action.</p>
        </div>
        <div className="control-grid">
          {controls.map((c, i) => {
            const ControlIcon = [ShieldCheck, Fingerprint, Check, FileKey, ScanSearch, Network, ClipboardCheck, BookOpen][i]
            return <article key={c.n} className="control-card"><span>{c.n}</span><ControlIcon size={25}/><h3>{c.title}</h3><p>{c.text}</p><a href="#resources" aria-label={`Learn about ${c.title}`}>View control objective <ArrowRight size={15}/></a></article>
          })}
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

      <section className="knowledge section" id="knowledge">
        <div className="section-number">04 / KNOWLEDGE CENTER</div>
        <div className="knowledge-intro">
          <h2>A curated source for what<br/>output security teams <em>need to know.</em></h2>
          <div><p>The OSI Knowledge Center will organize authoritative standards, regulatory developments, security advisories, research, and practical guidance without treating every source as though it carries the same authority.</p><a className="text-link dark-link" href="mailto:info@outputsecurityinstitute.org?subject=OSI Knowledge Center Updates">Receive Knowledge Center updates <ArrowRight size={17}/></a></div>
        </div>
        <div className="knowledge-grid">
          {[
            ['Standards & Regulations','Primary-source requirements and guidance from NIST, regulators, standards bodies, and government agencies.','REQUIREMENT / GUIDANCE'],
            ['Industry Centers','Focused collections for healthcare, government, defense, finance, education, manufacturing, and legal operations.','INDUSTRY / JURISDICTION'],
            ['Security Advisories','Relevant vulnerabilities, firmware notices, certificate changes, service risks, and supply-chain developments.','ADVISORY / INCIDENT'],
            ['OICC Guidance','Practical interpretations, assessment questions, procurement considerations, and control implementation resources.','OSI INTERPRETATION'],
            ['Research & Evidence','Government reports, technical research, documented events, and evidence that advances understanding.','RESEARCH / EVIDENCE'],
            ['Regulatory Updates','Proposed rules, revisions, deadlines, enforcement activity, and changes requiring organizational attention.','PROPOSED / FINAL / ENFORCED']
          ].map(([title,text,type],i) => <article key={title}><span>0{i+1}</span><small>{type}</small><h3>{title}</h3><p>{text}</p><a href="/knowledge">Explore collection <ArrowRight size={15}/></a></article>)}
        </div>
        <div className="source-standard"><strong>Every indexed resource will identify:</strong><span>Original source</span><span>Authority type</span><span>Publication date</span><span>Last reviewed</span><span>Industry</span><span>Jurisdiction</span><span>Related OICC control</span></div>
      </section>

      <section className="industries section" id="industries">
        <div className="section-number">05 / OPERATIONAL CONTEXT</div>
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
        <div className="resource-copy"><div className="section-number">06 / PRACTICAL GUIDANCE</div><h2>Begin with the questions<br/>your environment must answer.</h2><p>The first OSI field guide will help security, IT, compliance, operations, and procurement teams examine ownership, access, data handling, service dependency, evidence, and recovery together.</p><a className="button light" href="mailto:info@outputsecurityinstitute.org?subject=OSI Field Guide Updates">Request publication updates <ArrowRight size={18}/></a></div>
        <div className="document-card"><div className="doc-top"><span>OSI / FIELD GUIDE 01</span><ClipboardCheck size={34}/></div><div><small>FORTHCOMING</small><h3>Output Security<br/>Assessment Guide</h3><p>A cross-functional starting point for evaluating output systems as part of organizational security and continuity.</p></div><div className="doc-foot"><span>12 CONTROL AREAS</span><span>V1.0</span></div></div>
      </section>

      <section className="about section" id="about">
        <div className="section-number">07 / ABOUT OSI</div>
        <div className="about-grid"><h2>An independent initiative for a boundary that deserves clearer governance.</h2><div><p>The Output Security Institute develops practical, manufacturer-neutral guidance for the security, integrity, and continuity of systems that create, move, and manage physical information.</p><p>OSI is an independent educational initiative. It is not affiliated with or endorsed by NIST, and it does not certify products, organizations, or regulatory compliance.</p><a className="text-link dark-link" href="mailto:info@outputsecurityinstitute.org">Contribute to the discussion <ArrowRight size={17}/></a></div></div>
      </section>
    </main>
    <footer><div className="brand footer-brand"><span className="brand-mark"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></div><p>Security beyond the screen.</p><div><a href="#controls">OICC Framework</a><a href="#standards">Standards</a><a href="#about">Transparency</a></div><small>© {new Date().getFullYear()} Output Security Institute. Educational guidance only.</small></footer>
  </div>
}

export default App
