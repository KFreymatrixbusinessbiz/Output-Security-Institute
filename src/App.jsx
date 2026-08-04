import { useState } from 'react'
import {
  ArrowRight, BookOpen, CheckCircle2, ChevronDown, ClipboardCheck,
  ExternalLink, FileCheck2, FileKey, Fingerprint, Menu, Network,
  SearchCheck, ShieldCheck, Workflow, X
} from 'lucide-react'

const controls = [
  {
    id: 'OICC-01', title: 'Governance and Accountability', function: 'GOVERN',
    objective: 'Assign named ownership for output-system risk, security decisions, operational availability, service access, and lifecycle evidence.',
    actions: ['Define the system owner and information owner', 'Document risk acceptance and exception authority', 'Include output systems in policy, audit, and governance routines'],
    evidence: ['Named owners', 'Approved policy scope', 'Risk and exception records'],
    maps: 'CSF GV; SP 800-53 PM, PL, RA'
  },
  {
    id: 'OICC-02', title: 'Inventory and Criticality', function: 'IDENTIFY',
    objective: 'Maintain an inventory that connects each device and workflow to its location, owner, data types, network context, dependencies, and operational consequence.',
    actions: ['Record hardware, firmware, software, and interfaces', 'Classify data and operational criticality', 'Map upstream and downstream dependencies'],
    evidence: ['Current inventory', 'Data classification', 'Dependency map'],
    maps: 'CSF ID.AM, ID.RA; SP 800-53 CM-8, RA'
  },
  {
    id: 'OICC-03', title: 'Identity and Administrative Access', function: 'PROTECT',
    objective: 'Ensure that users, administrators, applications, and service personnel receive only the access their authorized roles require.',
    actions: ['Remove shared and default administrative credentials', 'Separate user, administrative, and service roles', 'Review dormant accounts and privileged access'],
    evidence: ['Account inventory', 'Role matrix', 'Access review records'],
    maps: 'CSF PR.AA; SP 800-53 AC, IA'
  },
  {
    id: 'OICC-04', title: 'Secure Configuration', function: 'PROTECT',
    objective: 'Establish and maintain an approved baseline for protocols, ports, encryption, certificates, storage, interfaces, firmware, and administrative settings.',
    actions: ['Disable unnecessary services and legacy protocols', 'Document an approved configuration baseline', 'Detect and govern configuration drift'],
    evidence: ['Baseline checklist', 'Configuration exports', 'Change history'],
    maps: 'CSF PR.PS; SP 800-53 CM, SC'
  },
  {
    id: 'OICC-05', title: 'Data Protection and Custody', function: 'PROTECT',
    objective: 'Protect information while it is received, processed, transmitted, stored, rendered, released, retained, and destroyed.',
    actions: ['Encrypt supported data paths and stored information', 'Control release and physical retrieval', 'Verify overwrite, deletion, and media disposition'],
    evidence: ['Data-flow diagram', 'Release controls', 'Sanitization records'],
    maps: 'CSF PR.DS; SP 800-53 MP, SC, SI'
  },
  {
    id: 'OICC-06', title: 'Network and Interface Control', function: 'PROTECT',
    objective: 'Treat every wired, wireless, cloud, fax, USB, mobile, and application interface as an intentional trust boundary.',
    actions: ['Segment according to risk and operational need', 'Restrict management paths and outbound communication', 'Document dual-network and cross-boundary behavior'],
    evidence: ['Network diagram', 'Firewall rules', 'Approved interface list'],
    maps: 'CSF PR.IR; SP 800-53 AC-4, SC-7, CM-7'
  },
  {
    id: 'OICC-07', title: 'Software, Firmware, and Vulnerability Management', function: 'IDENTIFY / PROTECT',
    objective: 'Govern firmware provenance, updates, embedded software, disclosed vulnerabilities, compensating controls, and unsupported components.',
    actions: ['Track firmware and component versions', 'Monitor authoritative vulnerability sources', 'Test, approve, deploy, and verify updates'],
    evidence: ['Version inventory', 'Update records', 'Vulnerability decisions'],
    maps: 'CSF ID.RA, PR.PS; SP 800-53 SI-2, RA-5, SR-11'
  },
  {
    id: 'OICC-08', title: 'Logging, Monitoring, and Evidence', function: 'DETECT',
    objective: 'Preserve enough evidence to establish who did what, when, where, through which path, and under whose authority.',
    actions: ['Define required events and retention periods', 'Synchronize time and protect logs', 'Integrate useful events with monitoring and investigation'],
    evidence: ['Log samples', 'Retention settings', 'Alert and review records'],
    maps: 'CSF DE.CM, DE.AE; SP 800-53 AU, SI-4'
  },
  {
    id: 'OICC-09', title: 'Third-Party Service and Supply Chain', function: 'GOVERN',
    objective: 'Make external access, remote tools, parts, supplies, firmware sources, subcontractors, and support dependencies visible and governable.',
    actions: ['Authorize and record third-party access', 'Validate software, firmware, parts, and supply provenance', 'Define credential, escort, and data-handling requirements'],
    evidence: ['Supplier requirements', 'Access records', 'Approved source list'],
    maps: 'CSF GV.SC; SP 800-53 SR, SA, PS-7'
  },
  {
    id: 'OICC-10', title: 'Incident Response and Investigation', function: 'RESPOND',
    objective: 'Include output systems in incident triage, containment, evidence preservation, communications, and lessons learned.',
    actions: ['Define device and workflow incident scenarios', 'Preserve volatile and persistent evidence', 'Test escalation across security, IT, operations, and vendors'],
    evidence: ['Response playbook', 'Exercise results', 'Case records'],
    maps: 'CSF RS; SP 800-53 IR, AU'
  },
  {
    id: 'OICC-11', title: 'Recovery and Operational Continuity', function: 'RECOVER',
    objective: 'Design recovery around the work that must continue, not only around restoration of a particular device or service relationship.',
    actions: ['Define acceptable interruption and recovery objectives', 'Provide safe local recovery and fallback paths', 'Test continuity when normal support is unavailable'],
    evidence: ['Continuity plan', 'Recovery test', 'Escalation and fallback map'],
    maps: 'CSF RC; SP 800-53 CP, IR-4'
  },
  {
    id: 'OICC-12', title: 'Lifecycle and Verified Disposition', function: 'GOVERN / PROTECT',
    objective: 'Apply security and custody requirements from acquisition through deployment, reassignment, return, resale, and final disposition.',
    actions: ['Define security requirements before acquisition', 'Revalidate controls after moves and ownership changes', 'Verify data removal and chain of custody at disposition'],
    evidence: ['Procurement requirements', 'Transfer records', 'Disposition certificate'],
    maps: 'CSF GV.SC, ID.AM; SP 800-53 SA, SR, MP-6'
  }
]

const standards = [
  {name:'NIST CSF 2.0', status:'Risk framework', relationship:'OICC uses Govern, Identify, Protect, Detect, Respond, and Recover as an outcome structure for output environments.', url:'https://www.nist.gov/cyberframework'},
  {name:'NIST SP 800-53 Rev. 5', status:'Control catalog', relationship:'OICC translates relevant control families into device, workflow, service, evidence, and lifecycle questions.', url:'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final'},
  {name:'NIST SP 800-171 Rev. 3', status:'CUI requirements', relationship:'Organizations should determine whether output components process, store, or transmit CUI and include applicable components within the governed system boundary.', url:'https://csrc.nist.gov/pubs/sp/800/171/r3/final'},
  {name:'NIST SP 800-171A Rev. 3', status:'Assessment procedures', relationship:'Assessment requires evidence. OICC helps identify the device records, settings, observations, and interviews that can support that evidence.', url:'https://csrc.nist.gov/pubs/sp/800/171/a/r3/final'},
  {name:'NIST SP 800-207', status:'Zero Trust Architecture', relationship:'Output systems should receive no implicit trust because of location, ownership, vendor, or traditional treatment as office equipment.', url:'https://csrc.nist.gov/pubs/sp/800/207/final'},
  {name:'NIST SP 800-88 Rev. 1', status:'Media sanitization', relationship:'Stored jobs, address books, logs, caches, removable media, and embedded storage require documented disposition decisions.', url:'https://csrc.nist.gov/pubs/sp/800/88/r1/final'},
  {name:'CISA Secure by Design', status:'Design principle', relationship:'Security outcomes should be built into technology and operating models rather than transferred entirely to customers through optional controls.', url:'https://www.cisa.gov/securebydesign'}
]

const industries = [
  {title:'Defense Industrial Base', focus:'CUI boundaries, evidence, supplier access, remote locations, and continuity.', questions:['Does the component process, store, or transmit CUI?', 'Can external support enter the governed boundary?', 'What evidence supports each applicable requirement?']},
  {title:'Healthcare', focus:'Patient information, clinical availability, qualified internal teams, and controlled intervention.', questions:['Can identity follow the user to release?', 'What happens during clinical downtime?', 'Can recovery occur without unnecessary external access?']},
  {title:'Financial Services', focus:'Customer information, auditability, branch autonomy, retention, and third-party oversight.', questions:['Are branch settings governed centrally?', 'Can logs support an investigation?', 'Which support paths cross security boundaries?']},
  {title:'Government', focus:'Public records, CJIS or regulated information, distributed sites, procurement, and continuity.', questions:['Who owns security after acquisition?', 'Are configurations consistent across locations?', 'Can disposition prove data removal?']},
  {title:'Education', focus:'Shared environments, student records, constrained staffing, accessibility, and distributed operations.', questions:['Are administrative functions separated?', 'Can local staff recover safely?', 'Are student and staff records protected at release?']},
  {title:'Manufacturing', focus:'Intellectual property, production documents, segmentation, uptime, and supply-chain integrity.', questions:['Does output participate in production?', 'Are recipes, drawings, and labels controlled?', 'What dependency can stop the line?']},
  {title:'Logistics and Distribution', focus:'Labels, receiving, chain of custody, 24-hour work, and geographically dispersed sites.', questions:['Can an outage interrupt movement or inventory?', 'Is identity connected to each transaction?', 'Can remote sites operate without waiting for dispatch?']},
  {title:'Professional and Legal', focus:'Client confidentiality, matter-level access, physical custody, and verified disposal.', questions:['Can documents be released to the wrong matter or user?', 'How is physical custody established?', 'What remains in memory after the work is complete?']}
]

const resources = [
  {type:'FOUNDATION', title:'NIST Cybersecurity Framework 2.0', text:'A taxonomy of cybersecurity outcomes for organizations of any size, sector, or maturity.', url:'https://www.nist.gov/cyberframework'},
  {type:'CONTROLS', title:'NIST Cybersecurity and Privacy Reference Tool', text:'Explore NIST publications, controls, mappings, and machine-readable resources.', url:'https://csrc.nist.gov/projects/cprt/catalog'},
  {type:'CUI', title:'NIST Protecting CUI Project', text:'Current publications and supporting resources for safeguarding Controlled Unclassified Information.', url:'https://csrc.nist.gov/projects/protecting-controlled-unclassified-information'},
  {type:'ZERO TRUST', title:'NIST SP 800-207', text:'Zero Trust Architecture principles for resource access, policy enforcement, and continuous evaluation.', url:'https://csrc.nist.gov/pubs/sp/800/207/final'},
  {type:'VULNERABILITIES', title:'CISA Known Exploited Vulnerabilities Catalog', text:'Authoritative catalog of vulnerabilities known to be exploited in the wild.', url:'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'},
  {type:'DISPOSITION', title:'NIST SP 800-88 Rev. 1', text:'Guidance for media sanitization and disposition decisions.', url:'https://csrc.nist.gov/pubs/sp/800/88/r1/final'}
]

function Header(){
  const [open,setOpen]=useState(false)
  const links=[['Doctrine','#doctrine'],['OICC Controls','#controls'],['Standards','#standards'],['Industries','#industries'],['Resources','#resources'],['About','#about']]
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Output Security Institute home"><span className="brand-mark" aria-hidden="true"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></a>
    <nav className={open?'nav open':'nav'} aria-label="Main navigation">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</nav>
    <button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
  </header>
}

function ControlCard({control}){
  return <details className="control-card">
    <summary><span className="control-id">{control.id}</span><span className="control-function">{control.function}</span><ShieldCheck size={25}/><h3>{control.title}</h3><p>{control.objective}</p><span className="expand">Open control <ChevronDown size={15}/></span></summary>
    <div className="control-detail">
      <div><h4>Priority actions</h4><ul>{control.actions.map(x=><li key={x}><CheckCircle2 size={15}/>{x}</li>)}</ul></div>
      <div><h4>Evidence to expect</h4><ul>{control.evidence.map(x=><li key={x}><FileCheck2 size={15}/>{x}</li>)}</ul></div>
      <p className="mapping-note">Relationship: {control.maps}</p>
    </div>
  </details>
}

function App(){return <div id="top"><Header/><main>
  <section className="hero">
    <div className="eyebrow"><span></span>Independent guidance for output security</div>
    <h1>Security does not end<br/>at the <em>screen.</em></h1>
    <p className="hero-copy">Output systems sit where digital information becomes physical, identity becomes action, and policy becomes custody. OSI provides manufacturer-neutral guidance for governing that boundary.</p>
    <div className="hero-actions"><a className="button primary" href="#controls">Use the OICC framework <ArrowRight size={18}/></a><a className="text-link" href="#doctrine">Read the doctrine <ChevronDown size={18}/></a></div>
    <div className="boundary-map" aria-label="Information crossing the digital and physical boundary"><div className="map-label digital">DIGITAL ENVIRONMENT</div><div className="map-node"><Network/><span>Network and identity</span></div><div className="map-line"></div><div className="map-core"><Fingerprint/><b>OUTPUT<br/>BOUNDARY</b><small>CONTROL BECOMES CUSTODY</small></div><div className="map-line"></div><div className="map-node"><FileKey/><span>Physical information</span></div><div className="map-label physical">PHYSICAL ENVIRONMENT</div></div>
  </section>

  <section className="section issue" id="doctrine">
    <div className="section-number">01 / OSI DOCTRINE</div>
    <div className="issue-grid"><h2>Output is an operational boundary.<br/><em>Govern it as one.</em></h2><div><p>Printers, multifunction systems, scanners, label platforms, workflow applications, fax systems, and cloud output services authenticate users, exchange data, execute software, connect networks, and create records.</p><p>Their risk does not come from what the industry calls them. It comes from what they are allowed to do, what information they handle, who can reach them, and what the organization depends on them to keep doing.</p></div></div>
    <div className="principles">
      {[
        ['01','The boundary is larger than the device','Govern the device, its applications, identities, data paths, service methods, physical output, and lifecycle as one system.'],
        ['02','Dependency must be intentional','Every remote tool, credential, supplier, technician, cloud service, and recovery path should justify its place in the operating model.'],
        ['03','Evidence matters before an incident','An organization should be able to establish who acted, what occurred, when, where, through which path, and under whose authority.'],
        ['04','Continuity is a security outcome','A secure system that cannot sustain the required operation can still create organizational risk. Recovery must begin with the work that cannot stop.']
      ].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}
    </div>
  </section>

  <section className="section scope-band">
    <div className="section-number">WHAT BELONGS IN SCOPE</div>
    <div className="scope-grid">{[['DEVICES','Printers, MFPs, scanners, label and specialty output'],['SOFTWARE','Drivers, embedded applications, workflow and management'],['CONNECTIONS','Wired, wireless, mobile, cloud, fax, USB and APIs'],['PEOPLE','Users, administrators, service personnel and suppliers'],['INFORMATION','Jobs, scans, queues, address books, logs and physical records'],['DEPENDENCIES','Credentials, parts, supplies, remote tools and escalation paths']].map(([h,p])=><article key={h}><small>{h}</small><p>{p}</p></article>)}</div>
  </section>

  <section className="section dark controls" id="controls">
    <div className="section-number">02 / OICC FRAMEWORK</div>
    <div className="controls-intro"><div><div className="framework-badge">OICC <small>v1.0 / WORKING FRAMEWORK</small></div><h2>Operational Infrastructure<br/>Critical Controls</h2></div><div><p>The OICC framework organizes output-system governance into twelve control areas. Each area connects an objective to priority actions, expected evidence, and established security frameworks.</p><p className="use-note">Use OICC to discover scope and improve decisions. Do not treat it as a substitute for the authoritative standard or a guarantee of compliance.</p></div></div>
    <div className="control-grid">{controls.map(c=><ControlCard key={c.id} control={c}/>)}</div>
  </section>

  <section className="section assessment">
    <div className="section-number">03 / ASSESSMENT METHOD</div>
    <div className="assessment-grid"><div><h2>Examine.<br/>Interview.<br/><em>Test.</em></h2><p>A policy statement alone does not establish that a control works. A useful assessment connects organizational intent to implemented settings, observable behavior, and retained evidence.</p></div><div className="method-list">{[['01','EXAMINE','Policies, diagrams, inventories, configurations, contracts, logs, tickets, and disposition records.'],['02','INTERVIEW','Security, IT, operations, procurement, privacy, records, facilities, and service owners.'],['03','TEST','Authentication, release, interfaces, logging, recovery, remote access, update, and sanitization behavior.'],['04','RECONCILE','Compare what policy requires, what people believe, what technology does, and what evidence proves.']].map(([n,t,p])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{p}</p></div></article>)}</div></div>
  </section>

  <section className="section standards" id="standards">
    <div className="section-number">04 / STANDARDS CROSSWALK</div>
    <div className="standards-head"><div><h2>Translate authoritative guidance into<br/><em>operational questions.</em></h2><p>OICC is a contextual framework. The originating publication remains authoritative. Applicability depends on the organization, information, contract, jurisdiction, and system boundary.</p></div></div>
    <div className="standards-table" role="table" aria-label="Standards relationships"><div className="standards-row table-head" role="row"><span>REFERENCE</span><span>ROLE</span><span>OICC RELATIONSHIP</span><span>LINK</span></div>{standards.map(s=><article className="standards-row" role="row" key={s.name}><h3>{s.name}</h3><small>{s.status}</small><p>{s.relationship}</p><a href={s.url} target="_blank" rel="noreferrer" aria-label={`Open ${s.name}`}><ExternalLink size={18}/></a></article>)}</div>
  </section>

  <section className="section industries" id="industries">
    <div className="section-number">05 / INDUSTRY IMPLEMENTATION</div>
    <h2>The control objective stays consistent.<br/>The <em>operational consequence</em> changes.</h2>
    <div className="industry-grid">{industries.map(i=><article key={i.title}><span></span><h3>{i.title}</h3><p>{i.focus}</p><details><summary>Questions to bring forward <ChevronDown size={15}/></summary><ul>{i.questions.map(q=><li key={q}>{q}</li>)}</ul></details></article>)}</div>
  </section>

  <section className="section procurement">
    <div className="section-number">06 / PROCUREMENT QUESTIONS</div>
    <div className="procurement-grid"><div><h2>Ask what the technology changes<br/>before asking what it <em>costs.</em></h2><p>Security requirements added after selection become exceptions, workarounds, bolt-ons, and dependencies. Bring them into the decision before the architecture is fixed.</p></div><ol>{['What information will the system process, store, transmit, render, or retain?','Which identities can use, administer, integrate with, or service it?','Which protocols, ports, interfaces, cloud services, and remote tools are required?','What security evidence can the system produce and retain?','How are firmware provenance, vulnerabilities, updates, and end-of-support handled?','What work must continue when the device, network, cloud service, or support provider is unavailable?','How is data removal verified during reassignment, return, replacement, or disposal?','Which dependencies are eliminated, which are introduced, and who owns each one?'].map((q,i)=><li key={q}><span>{String(i+1).padStart(2,'0')}</span>{q}</li>)}</ol></div>
  </section>

  <section className="section resources" id="resources">
    <div className="resource-copy"><div className="section-number">07 / AUTHORITATIVE RESOURCES</div><h2>Start with the source.<br/>Then apply it to the boundary.</h2><p>OSI curates primary government and standards resources. Links open the authoritative publisher so readers can verify scope, revision, and applicability.</p></div>
    <div className="resource-grid">{resources.map(r=><a className="resource-card" key={r.title} href={r.url} target="_blank" rel="noreferrer"><small>{r.type}</small><BookOpen size={25}/><h3>{r.title}</h3><p>{r.text}</p><span>Open authoritative source <ExternalLink size={14}/></span></a>)}</div>
  </section>

  <section className="section about" id="about">
    <div className="section-number">08 / ABOUT OSI</div>
    <div className="about-grid"><h2>Independent guidance for a boundary that deserves clearer governance.</h2><div><p>The Output Security Institute develops practical, manufacturer-neutral guidance for the security, integrity, and continuity of systems that create, move, and manage physical information.</p><p>OSI is an independent educational initiative. It does not certify products, organizations, security, or regulatory compliance. References to external frameworks do not imply affiliation or endorsement.</p><p>Our purpose is direct: help security, IT, compliance, operations, and procurement teams ask better questions, establish clearer ownership, reduce unexamined dependency, and strengthen continuity.</p><a className="text-link dark-link" href="mailto:info@outputsecurityinstitute.org?subject=Contributing%20to%20OSI">Contribute expertise or request guidance <ArrowRight size={17}/></a></div></div>
  </section>
</main>
<footer><div className="brand footer-brand"><span className="brand-mark"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></div><p>Security beyond the screen.</p><div><a href="#doctrine">Doctrine</a><a href="#controls">OICC Framework</a><a href="#standards">Standards</a><a href="#resources">Resources</a></div><small>© {new Date().getFullYear()} Output Security Institute. Independent educational guidance. Verify all requirements with the authoritative source.</small></footer></div>}

export default App
