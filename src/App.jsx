import { useState } from 'react'
import {
  ArrowRight, BookOpen, CheckCircle2, ChevronDown, ClipboardCheck,
  Download, ExternalLink, FileCheck2, FileKey, FileText, Fingerprint, Menu, Network,
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
  {name:'NIST CSF 2.0', status:'Risk framework', relationship:'OICC uses Govern, Identify, Protect, Detect, Respond, and Recover as an outcome structure for output environments.', applicability:'Useful as an organization-wide risk vocabulary. It does not prescribe a single implementation or certify compliance.', url:'https://www.nist.gov/cyberframework'},
  {name:'NIST SP 800-53 Rev. 5', status:'Control catalog', relationship:'OICC translates relevant control families into device, workflow, service, evidence, and lifecycle questions.', applicability:'Select controls according to system categorization, risk, mission, and the organization’s tailoring process.', url:'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final'},
  {name:'NIST SP 800-171 Rev. 3', status:'CUI requirements', relationship:'Organizations should determine whether output components process, store, or transmit CUI and include applicable components within the governed system boundary.', applicability:'Relevant when nonfederal systems handle CUI under an applicable law, regulation, policy, or contract.', url:'https://csrc.nist.gov/pubs/sp/800/171/r3/final'},
  {name:'NIST SP 800-171A Rev. 3', status:'Assessment procedures', relationship:'Assessment requires evidence. OICC helps identify the device records, settings, observations, and interviews that can support that evidence.', applicability:'Use with the corresponding SP 800-171 requirements and assessment objectives that apply to the defined system.', url:'https://csrc.nist.gov/pubs/sp/800/171/a/r3/final'},
  {name:'NIST SP 800-207', status:'Zero Trust Architecture', relationship:'Output systems should receive no implicit trust because of location, ownership, vendor, or traditional treatment as office equipment.', applicability:'Use as an architectural principle for resource access and policy enforcement, not as a product label.', url:'https://csrc.nist.gov/pubs/sp/800/207/final'},
  {name:'NIST SP 800-88 Rev. 1', status:'Media sanitization', relationship:'Stored jobs, address books, logs, caches, removable media, and embedded storage require documented disposition decisions.', applicability:'Apply sanitization decisions to the actual media, information sensitivity, reuse path, and verification requirement.', url:'https://csrc.nist.gov/pubs/sp/800/88/r1/final'},
  {name:'HIPAA Security Rule', status:'Healthcare safeguards', relationship:'Output workflows that create, receive, maintain, or transmit electronic protected health information belong within administrative, physical, and technical safeguard decisions.', applicability:'Applies to covered entities and business associates as defined by HIPAA. Determine scope and required or addressable implementation specifications.', url:'https://www.hhs.gov/hipaa/for-professionals/security/index.html'},
  {name:'FBI CJIS Security Policy', status:'Criminal justice information', relationship:'Devices, applications, service access, logs, and physical output that handle CJI must be considered across the full information lifecycle.', applicability:'Applies according to CJIS agreements, roles, access, and the current policy. Confirm requirements with the responsible CJIS authority.', url:'https://www.fbi.gov/services/cjis/cjis-security-policy-resource-center'},
  {name:'PCI DSS v4.0.1', status:'Payment account data', relationship:'Output systems enter scope when they store, process, transmit, display, or materially affect the security of payment account data or the cardholder data environment.', applicability:'Scope follows the payment environment and segmentation decisions. Validate applicability with current PCI SSC publications.', url:'https://www.pcisecuritystandards.org/document_library/'},
  {name:'CISA Secure by Design', status:'Design principle', relationship:'Security outcomes should be built into technology and operating models rather than transferred entirely to customers through optional controls.', applicability:'Use to inform procurement, architecture, vendor accountability, and lifecycle decisions. It is guidance, not a certification.', url:'https://www.cisa.gov/securebydesign'}
]

const industries = [
  {title:'Defense Industrial Base', focus:'CUI boundaries, evidence, supplier access, remote locations, and continuity.', consequence:'A poorly defined output boundary can expose CUI, invalidate assessment evidence, or introduce ungoverned supplier access.', evidence:['Component and data-flow inventory','CUI boundary and role decisions','Configuration, access, update, and disposition records'], questions:['Does the component process, store, or transmit CUI?', 'Can external support enter the governed boundary?', 'What evidence supports each applicable requirement?']},
  {title:'Healthcare', focus:'Patient information, clinical availability, qualified internal teams, and controlled intervention.', consequence:'An output interruption can delay care while weak release or service practices can expose patient information.', evidence:['ePHI workflow and release map','Administrative and service access records','Downtime, recovery, and sanitization procedures'], questions:['Can identity follow the user to release?', 'What happens during clinical downtime?', 'Can recovery occur without unnecessary external access?']},
  {title:'Financial Services', focus:'Customer information, auditability, branch autonomy, retention, and third-party oversight.', consequence:'A local device can become a branch-wide confidentiality, investigation, or continuity problem.', evidence:['Approved branch baseline','Privileged and third-party access reviews','Event retention and recovery test records'], questions:['Are branch settings governed centrally?', 'Can logs support an investigation?', 'Which support paths cross security boundaries?']},
  {title:'Government', focus:'Public records, CJIS or regulated information, distributed sites, procurement, and continuity.', consequence:'Inconsistent configurations and custody practices can undermine records obligations and regulated information handling.', evidence:['Information-type and jurisdiction decision','Site configuration attestations','Custody, incident, and verified disposition records'], questions:['Who owns security after acquisition?', 'Are configurations consistent across locations?', 'Can disposition prove data removal?']},
  {title:'Education', focus:'Shared environments, student records, constrained staffing, accessibility, and distributed operations.', consequence:'Open access, changing populations, and limited local staffing make identity, release, and safe recovery especially important.', evidence:['Administrative role separation','Student and staff release configuration','Local recovery and escalation guide'], questions:['Are administrative functions separated?', 'Can local staff recover safely?', 'Are student and staff records protected at release?']},
  {title:'Manufacturing', focus:'Intellectual property, production documents, segmentation, uptime, and supply-chain integrity.', consequence:'An output failure or uncontrolled production document can stop work, misdirect material, or expose intellectual property.', evidence:['Production dependency map','Approved label, drawing, and recipe workflows','Segmentation and continuity test results'], questions:['Does output participate in production?', 'Are recipes, drawings, and labels controlled?', 'What dependency can stop the line?']},
  {title:'Logistics and Distribution', focus:'Labels, receiving, chain of custody, 24-hour work, and geographically dispersed sites.', consequence:'A failed label, receiving, or shipping workflow can interrupt physical movement even while core systems remain online.', evidence:['Transaction-to-output traceability','Remote-site operating baseline','Fallback and replenishment procedures'], questions:['Can an outage interrupt movement or inventory?', 'Is identity connected to each transaction?', 'Can remote sites operate without waiting for dispatch?']},
  {title:'Professional and Legal', focus:'Client confidentiality, matter-level access, physical custody, and verified disposal.', consequence:'A single misreleased document can breach client confidentiality or compromise matter-level custody.', evidence:['Matter and user release rules','Physical custody procedures','Retention, deletion, and disposition verification'], questions:['Can documents be released to the wrong matter or user?', 'How is physical custody established?', 'What remains in memory after the work is complete?']}
]

const resources = [
  {category:'Foundations', type:'RISK FRAMEWORK', publisher:'NIST', title:'Cybersecurity Framework 2.0', text:'A taxonomy of cybersecurity outcomes for organizations of any size, sector, or maturity.', use:'Organize output-security outcomes and connect them to enterprise risk governance.', applies:'All sectors', url:'https://www.nist.gov/cyberframework'},
  {category:'Foundations', type:'CONTROL REFERENCE', publisher:'NIST', title:'Cybersecurity and Privacy Reference Tool', text:'Explore NIST publications, controls, mappings, and machine-readable resources.', use:'Trace an operational question to authoritative controls and related publications.', applies:'All sectors', url:'https://csrc.nist.gov/projects/cprt/catalog'},
  {category:'Foundations', type:'CONTROL CATALOG', publisher:'NIST', title:'SP 800-53 Rev. 5', text:'A comprehensive catalog of security and privacy controls for information systems and organizations.', use:'Select and tailor control objectives after risk, categorization, and system boundaries are understood.', applies:'Federal and adaptable use', url:'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final'},
  {category:'Foundations', type:'ZERO TRUST', publisher:'NIST', title:'SP 800-207', text:'Zero Trust Architecture principles for resource access, policy enforcement, and continuous evaluation.', use:'Challenge implicit trust based on device location, ownership, or traditional treatment as office equipment.', applies:'Architecture and access', url:'https://csrc.nist.gov/pubs/sp/800/207/final'},
  {category:'Federal & CUI', type:'CUI PROGRAM', publisher:'NIST', title:'Protecting CUI Project', text:'Current publications and supporting resources for safeguarding Controlled Unclassified Information.', use:'Identify current CUI publications and determine which requirements belong in the governed boundary.', applies:'CUI environments', url:'https://csrc.nist.gov/projects/protecting-controlled-unclassified-information'},
  {category:'Federal & CUI', type:'CUI REQUIREMENTS', publisher:'NIST', title:'SP 800-171 Rev. 3', text:'Security requirements for protecting CUI in nonfederal systems and organizations.', use:'Establish applicable requirements for output components that process, store, or transmit CUI.', applies:'Nonfederal CUI systems', url:'https://csrc.nist.gov/pubs/sp/800/171/r3/final'},
  {category:'Federal & CUI', type:'ASSESSMENT', publisher:'NIST', title:'SP 800-171A Rev. 3', text:'Assessment procedures and objectives corresponding to the SP 800-171 requirements.', use:'Plan what must be examined, interviewed, and tested to support a defensible assessment conclusion.', applies:'CUI assessment', url:'https://csrc.nist.gov/pubs/sp/800/171/a/r3/final'},
  {category:'Sector Requirements', type:'HEALTHCARE', publisher:'HHS', title:'HIPAA Security Rule', text:'Official guidance for administrative, physical, and technical safeguards protecting electronic protected health information.', use:'Connect output workflows involving ePHI to the covered entity or business associate safeguard analysis.', applies:'Healthcare', url:'https://www.hhs.gov/hipaa/for-professionals/security/index.html'},
  {category:'Sector Requirements', type:'CRIMINAL JUSTICE', publisher:'FBI', title:'CJIS Security Policy Resource Center', text:'The current CJIS Security Policy and supporting resources for protecting criminal justice information.', use:'Evaluate devices, applications, access, logs, service, and physical output that handle CJI.', applies:'Criminal justice', url:'https://www.fbi.gov/services/cjis/cjis-security-policy-resource-center'},
  {category:'Sector Requirements', type:'PAYMENT DATA', publisher:'PCI SSC', title:'Document Library', text:'Current PCI Security Standards Council publications, including PCI DSS and supporting guidance.', use:'Determine whether output systems store, process, transmit, display, or affect the security of payment account data.', applies:'Payment environments', url:'https://www.pcisecuritystandards.org/document_library/'},
  {category:'Sector Requirements', type:'FINANCIAL DATA', publisher:'FTC', title:'Safeguards Rule Guidance', text:'Official business guidance explaining the FTC Safeguards Rule and covered financial institutions.', use:'Frame administrative, technical, physical, service-provider, and incident obligations around customer information.', applies:'Covered financial institutions', url:'https://www.ftc.gov/business-guidance/resources/ftc-safeguards-rule-what-your-business-needs-know'},
  {category:'Sector Requirements', type:'STUDENT RECORDS', publisher:'U.S. Department of Education', title:'FERPA', text:'Official resources concerning privacy rights and protections for student education records.', use:'Determine where output, scanning, release, custody, and disposal intersect with protected education records.', applies:'Education', url:'https://studentprivacy.ed.gov/ferpa'},
  {category:'Vulnerability & Lifecycle', type:'EXPLOITED VULNERABILITIES', publisher:'CISA', title:'Known Exploited Vulnerabilities Catalog', text:'The authoritative catalog of vulnerabilities known to be exploited in the wild.', use:'Prioritize remediation and compensating-control decisions using evidence of active exploitation.', applies:'Vulnerability management', url:'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'},
  {category:'Vulnerability & Lifecycle', type:'DISPOSITION', publisher:'NIST', title:'SP 800-88 Rev. 1', text:'Guidance for media sanitization, verification, and disposition decisions.', use:'Govern stored jobs, logs, credentials, address books, removable media, and embedded storage at lifecycle transitions.', applies:'All information systems', url:'https://csrc.nist.gov/pubs/sp/800/88/r1/final'},
  {category:'Vulnerability & Lifecycle', type:'SOFTWARE TRANSPARENCY', publisher:'CISA', title:'Software Bill of Materials', text:'Resources for understanding software components and improving software supply-chain transparency.', use:'Ask what embedded and supporting software exists, how it is tracked, and how component risk is communicated.', applies:'Software supply chain', url:'https://www.cisa.gov/topics/information-communications-technology-supply-chain-security/sbom'},
  {category:'Procurement & Supply Chain', type:'SECURE PROCUREMENT', publisher:'CISA', title:'Secure by Demand Guide', text:'Questions and considerations designed to help customers demand secure products from technology manufacturers.', use:'Bring product-security expectations into procurement before selection, contracting, and deployment.', applies:'Technology acquisition', url:'https://www.cisa.gov/resources-tools/resources/secure-demand-guide'},
  {category:'Procurement & Supply Chain', type:'PRODUCT RISK', publisher:'CISA', title:'Product Security Bad Practices', text:'A catalog of dangerous product-development practices with significant security implications.', use:'Identify product characteristics that should trigger deeper supplier questions or procurement conditions.', applies:'Product evaluation', url:'https://www.cisa.gov/resources-tools/resources/product-security-bad-practices'},
  {category:'Procurement & Supply Chain', type:'SUPPLY CHAIN', publisher:'NIST', title:'SP 800-161 Rev. 1', text:'Cybersecurity supply-chain risk management practices for systems and organizations.', use:'Govern suppliers, service paths, components, software, updates, custody, and lifecycle dependencies.', applies:'Enterprise supply chain', url:'https://csrc.nist.gov/pubs/sp/800/161/r1/upd1/final'}
]

function ResourceCenter(){
  const categories=['All', ...new Set(resources.map(resource=>resource.category))]
  const [category,setCategory]=useState('All')
  const [query,setQuery]=useState('')
  const normalized=query.trim().toLowerCase()
  const filtered=resources.filter(resource=>(category==='All'||resource.category===category)&&(!normalized||[resource.title,resource.publisher,resource.type,resource.text,resource.use,resource.applies].join(' ').toLowerCase().includes(normalized)))
  return <section className="section resources" id="resources" data-page="resources">
    <div className="resource-copy"><div className="section-number">08 / RESOURCE INTELLIGENCE CENTER</div><h2>Find what applies.<br/>Then return to the source.</h2><p>Search primary government and standards resources by requirement, sector, lifecycle concern, or implementation purpose. Every result explains when it becomes useful and opens the authoritative publisher.</p></div>
    <div className="resource-toolbar">
      <label className="resource-search"><SearchCheck size={20}/><span className="sr-only">Search resources</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search CUI, healthcare, disposition, procurement..."/></label>
      <div className="resource-filters" aria-label="Resource categories">{categories.map(item=><button className={category===item?'active':''} type="button" key={item} onClick={()=>setCategory(item)}>{item}</button>)}</div>
      <p className="resource-count">{filtered.length} authoritative {filtered.length===1?'resource':'resources'}</p>
    </div>
    <div className="resource-grid">{filtered.map(resource=><a className="resource-card" key={resource.title} href={resource.url} target="_blank" rel="noreferrer"><div className="resource-meta"><small>{resource.type}</small><b>{resource.publisher}</b></div><BookOpen size={25}/><h3>{resource.title}</h3><p>{resource.text}</p><div className="resource-use"><b>Use this when</b><p>{resource.use}</p><small>{resource.applies}</small></div><span>Open authoritative source <ExternalLink size={14}/></span></a>)}</div>
    {filtered.length===0&&<div className="resource-empty"><SearchCheck size={28}/><h3>No matching resources</h3><p>Try a broader term or select All.</p></div>}
  </section>
}

const pathways = [
  {number:'01', icon:FileKey, title:'A requirement entered the conversation', start:'A contract, regulation, customer expectation, or internal policy introduced a security obligation.', first:'Define the information and system boundary before choosing controls.', steps:['Identify the authoritative requirement and current revision','Determine which information and components are actually in scope','Assign an accountable owner and document applicability','Use the assessment objectives to define evidence'], links:[['Find the authoritative source','/resources.html'],['Define the boundary','/tools.html'],['Review standards relationships','/standards.html']]},
  {number:'02', icon:ClipboardCheck, title:'An assessment or audit is approaching', start:'The organization needs to demonstrate implementation, not merely point to policy language.', first:'Work backward from the conclusion to the evidence required to support it.', steps:['Translate each applicable objective into an observable condition','Identify records, responsible people, and test procedures','Reconcile policy, configuration, behavior, and retained evidence','Record gaps without turning assumptions into conclusions'], links:[['Use the evidence patterns','/evidence.html'],['Download the evidence workbook','/tools.html'],['Review OICC controls','/controls.html']]},
  {number:'03', icon:Workflow, title:'Technology is being acquired or replaced', start:'A product decision is moving forward and security cannot be added after the architecture is fixed.', first:'Start with the work, information, dependencies, and consequences the technology must support.', steps:['Define required outcomes before comparing specifications','Expose administrative, cloud, service, software, and supply-chain dependencies','Require evidence for security and lifecycle claims','Make continuity and disposition part of the selection'], links:[['Use the procurement questionnaire','/tools.html'],['Review procurement questions','/standards.html'],['Examine supply-chain resources','/resources.html']]},
  {number:'04', icon:SearchCheck, title:'The boundary is unclear', start:'The device is visible, but its data paths, applications, identities, people, and dependencies are not governed as one system.', first:'Inventory the full operating environment instead of cataloging the equipment alone.', steps:['Map devices, software, interfaces, information, people, and locations','Identify every trust boundary and privileged path','Connect each component to ownership and operational criticality','Reconcile procurement, network, security, and service inventories'], links:[['Read the OSI doctrine','/doctrine.html'],['Use the boundary workbook','/tools.html'],['Review recurring patterns','/evidence.html']]},
  {number:'05', icon:ShieldCheck, title:'Continuity depends on outside response', start:'Required work can stop while the organization waits for dispatch, connectivity, a supplier, a part, or a particular person.', first:'Define what must continue before designing the recovery method.', steps:['Establish maximum tolerable interruption for the actual work','Move safe first-response capability to the point of operation','Document fallback capacity and controlled escalation','Test recovery when normal support and connectivity are unavailable'], links:[['Review continuity controls','/controls.html'],['See industry consequences','/industries.html'],['Use the assessment workbook','/tools.html']]}
]

function Pathways(){
  return <section className="section pathways" id="pathways" data-page="pathways">
    <div className="section-number">09 / IMPLEMENTATION PATHWAYS</div>
    <div className="pathways-intro"><h2>Begin with the condition<br/>you are facing <em>now.</em></h2><div><p>Organizations rarely begin with a finished output-security program. They begin with a requirement, an acquisition, an assessment, an interruption, or a boundary no one has fully defined.</p><p>Select the closest starting condition. Each pathway identifies the first decision, the work sequence, and the OSI material that can help move the discussion forward.</p></div></div>
    <div className="pathway-grid">{pathways.map(pathway=>{const Icon=pathway.icon;return <article className="pathway-card" key={pathway.number}><div className="pathway-heading"><span>{pathway.number}</span><Icon size={27}/><h3>{pathway.title}</h3><p>{pathway.start}</p></div><div className="pathway-first"><small>BEGIN HERE</small><p>{pathway.first}</p></div><ol>{pathway.steps.map((step,index)=><li key={step}><span>{index+1}</span>{step}</li>)}</ol><div className="pathway-links">{pathway.links.map(([label,href])=><a href={href} key={label}>{label}<ArrowRight size={14}/></a>)}</div></article>})}</div>
    <div className="pathway-principle"><Fingerprint size={34}/><div><small>OSI IMPLEMENTATION PRINCIPLE</small><h3>Boundary before controls. Controls before evidence. Evidence before conclusions.</h3><p>The sequence prevents a familiar mistake: selecting a technology or declaring a control effective before the organization has established what it governs and what evidence would make the conclusion defensible.</p></div></div>
  </section>
}

const briefings = [
  {number:'01', topic:'SYSTEM BOUNDARY', title:'The device is not the system', premise:'An output device is only the visible component. The governed system also includes identities, applications, data paths, cloud services, administrators, service methods, physical locations, and lifecycle dependencies.', assumption:'If the device appears in inventory, the risk boundary has been defined.', decisions:['Which information enters, remains within, and leaves the environment?','Which people, applications, suppliers, and networks can act on the system?','Which upstream or downstream failure can interrupt the required work?'], evidence:['Reconciled component inventory','Data-flow and trust-boundary diagram','Named system and information owners'], controls:'OICC-01, OICC-02, OICC-06, OICC-09'},
  {number:'02', topic:'IDENTITY & CUSTODY', title:'Authentication is not the end of identity', premise:'Identity must remain connected to the action from submission through release, administration, investigation, and physical custody. A login alone does not establish who retrieved the information or who changed the system.', assumption:'Directory integration makes the complete workflow accountable.', decisions:['Where can identity be lost between submission and physical release?','Which actions require individual rather than shared accountability?','Can one transaction be reconstructed across device, identity, application, and network records?'], evidence:['Role and account inventory','Secure-release configuration','Correlated transaction and administrative logs'], controls:'OICC-03, OICC-05, OICC-08'},
  {number:'03', topic:'SERVICE ACCESS', title:'Support is a privileged pathway', premise:'A technician, remote tool, temporary credential, replacement component, or removed part can cross the same security boundary the organization works to protect elsewhere.', assumption:'A trusted service provider makes each service action trustworthy.', decisions:['What access is necessary, authorized, time-bound, and attributable?','What information or component may leave organizational custody?','Can recovery occur without introducing unnecessary external access?'], evidence:['Work order and participant identity','Remote-session and privileged-access record','Parts, media, and credential custody record'], controls:'OICC-03, OICC-05, OICC-09, OICC-12'},
  {number:'04', topic:'FIRMWARE & VULNERABILITY', title:'An update is a risk decision', premise:'Installing, deferring, or automating firmware changes can alter security, functionality, configuration, support status, and embedded component risk. Every path requires ownership and evidence.', assumption:'Firmware belongs to routine maintenance rather than security governance.', decisions:['Who monitors authoritative advisories and decides applicability?','How are provenance, testing, approval, rollback, and exceptions governed?','What verifies that security settings and required functions survived the change?'], evidence:['Firmware and component inventory','Advisory and vulnerability review','Approval, deployment, rollback, and verification records'], controls:'OICC-04, OICC-07, OICC-09'},
  {number:'05', topic:'INFORMATION DISPOSITION', title:'Removing the asset does not remove the information', premise:'Stored jobs, address books, credentials, logs, certificates, settings, removable media, and embedded storage can remain when a device is reassigned, returned, replaced, resold, or discarded.', assumption:'A factory reset or returned lease establishes sanitization.', decisions:['Which storage locations exist and what information can each retain?','What sanitization method fits the sensitivity and intended reuse path?','Who verifies the result and preserves evidence through final custody?'], evidence:['Storage and media inventory','Approved sanitization and reuse decision','Verification, transfer, return, or destruction record'], controls:'OICC-05, OICC-09, OICC-12'},
  {number:'06', topic:'OPERATIONAL CONTINUITY', title:'Response time is not continuity', premise:'A support commitment measures activity after interruption. Continuity measures whether the organization can keep performing the required work while normal devices, networks, cloud services, suppliers, or personnel are unavailable.', assumption:'A fast dispatch commitment is an adequate recovery strategy.', decisions:['What work cannot wait and for how long?','Which first-response capability should exist at the point of operation?','Which dependencies should be removed, retained, duplicated, or escalated?'], evidence:['Maximum tolerable interruption and recovery objective','Local recovery and fallback procedure','Exercise results without normal support or connectivity'], controls:'OICC-02, OICC-09, OICC-10, OICC-11'}
]

function Briefings(){
  return <section className="section briefings" id="briefings" data-page="briefings">
    <div className="section-number">10 / OSI DECISION BRIEFINGS</div>
    <div className="briefings-intro"><h2>Short guidance for decisions<br/>that carry <em>long consequences.</em></h2><div><p>Each briefing begins with a familiar assumption, reframes the condition as an operational security decision, and identifies the questions and evidence that should follow.</p><p>The briefings are manufacturer-neutral. They are designed to support discussion across security, IT, compliance, operations, procurement, records, and service ownership.</p></div></div>
    <div className="briefing-list">{briefings.map(briefing=><details className="briefing-card" key={briefing.number}><summary><span>{briefing.number}</span><small>{briefing.topic}</small><h3>{briefing.title}</h3><p>{briefing.premise}</p><b>Read decision briefing <ChevronDown size={15}/></b></summary><div className="briefing-body"><div className="briefing-assumption"><small>ASSUMPTION TO EXAMINE</small><p>{briefing.assumption}</p></div><div><h4>Decisions to make visible</h4><ul>{briefing.decisions.map(item=><li key={item}><SearchCheck size={15}/>{item}</li>)}</ul></div><div><h4>Evidence to expect</h4><ul>{briefing.evidence.map(item=><li key={item}><FileCheck2 size={15}/>{item}</li>)}</ul></div><p className="briefing-controls">Related controls: {briefing.controls}</p></div></details>)}</div>
    <div className="briefing-closing"><ShieldCheck size={34}/><div><small>THE PRACTICAL TEST</small><h3>Can the organization explain the decision before it has to defend the outcome?</h3><p>If ownership, scope, dependency, evidence, and operational consequence become visible early, the organization can co-author the decision instead of reconstructing it after an interruption or assessment.</p></div></div>
  </section>
}

const tools = [
  {number:'01', title:'OICC Assessment Workbook', purpose:'Connect each OICC control objective to implementation, evidence, ownership, gaps, and the next decision.', use:['Initial discovery','Internal control review','Assessment preparation','Remediation planning'], file:'/tools/oicc-assessment-workbook.xlsx', format:'Excel workbook'},
  {number:'02', title:'Output System Boundary Workbook', purpose:'Define the devices, software, identities, data, connections, people, physical locations, and dependencies that belong within the governed system.', use:['System scoping','CUI boundary review','Data-flow validation','Ownership assignment'], file:'/tools/output-system-boundary-workbook.xlsx', format:'Excel workbook'},
  {number:'03', title:'Procurement Security Questionnaire', purpose:'Bring security, continuity, evidence, lifecycle, and dependency questions into the decision before a product or operating model is selected.', use:['RFI and RFP development','Vendor evaluation','Architecture review','Contract requirements'], file:'/tools/procurement-security-questionnaire.docx', format:'Word questionnaire'},
  {number:'04', title:'Evidence Collection Workbook', purpose:'Establish what must be examined, who should be interviewed, what should be tested, and how often evidence should be refreshed.', use:['Audit readiness','Control validation','Incident preparation','Continuous governance'], file:'/tools/output-security-evidence-collection-matrix.xlsx', format:'Excel workbook'}
]

const evidencePatterns = [
  {number:'01', title:'The device is present, but absent from the governed inventory', condition:'An output device has an IP address, administrative interface, firmware, storage, applications, and external connections, yet the asset record identifies only a model, serial number, and location.', consequence:'Security ownership, criticality, data handling, vulnerability decisions, and lifecycle obligations remain undefined because the organization is governing equipment instead of the system it participates in.', collect:['Asset record and network discovery results','Named system and information owners','Data types, interfaces, dependencies, and criticality','Reconciliation between procurement, network, and security inventories'], controls:'OICC-01, OICC-02, OICC-06, OICC-12'},
  {number:'02', title:'Administrative access exists without individual accountability', condition:'Shared credentials, default passwords, undocumented local accounts, or vendor-controlled access allow configuration changes without reliably connecting the action to one authorized person.', consequence:'The organization cannot establish who changed a security-relevant setting, whether the action was authorized, or which credentials must be revoked after a role or supplier changes.', collect:['Administrative account export','Authentication and role configuration','Password-vault or credential issuance records','Access review and administrator activity logs'], controls:'OICC-03, OICC-08, OICC-09'},
  {number:'03', title:'Convenience creates an unexamined data path', condition:'Email, cloud connectors, mobile printing, USB, fax, address books, scan destinations, or dual-network interfaces are enabled because they are useful, but their trust boundaries and information flows have not been documented.', consequence:'Information may leave the intended environment through a path that is technically functional but not authorized, monitored, retained, or included in the organization’s risk decisions.', collect:['Enabled protocol and interface list','Data-flow and network diagrams','Destination, certificate, and encryption settings','Firewall, proxy, DNS, and outbound connection records'], controls:'OICC-04, OICC-05, OICC-06, OICC-08'},
  {number:'04', title:'A support event crosses the security boundary', condition:'An outside technician, remote support tool, replacement component, temporary credential, or removed part enters or leaves the environment without the same access, custody, and evidence requirements applied to other privileged activity.', consequence:'The service process can create a separate path to systems and information even when the device itself is securely configured.', collect:['Work order and identity of every participant','Escort, remote-session, and privileged-access records','Parts and media custody documentation','Credentials created, used, disabled, and reviewed'], controls:'OICC-03, OICC-05, OICC-09, OICC-12'},
  {number:'05', title:'Logs exist, but cannot answer the investigation', condition:'Event records are available on the device or management platform, but time is inconsistent, retention is short, access is unprotected, important events are disabled, or logs are not connected to user and network context.', consequence:'After a suspected disclosure, configuration change, or unauthorized release, the organization cannot establish who, what, when, where, through which path, and under whose authority.', collect:['Required-event and retention decisions','Time synchronization configuration','Representative device, application, identity, and network logs','Test correlation of one transaction from submission through release'], controls:'OICC-05, OICC-08, OICC-10'},
  {number:'06', title:'The continuity plan begins after the work has stopped', condition:'Recovery depends on dispatch, parts arrival, a specific supplier, remote connectivity, or a person who is not available during the operating period.', consequence:'A support commitment may describe response activity without establishing how the required work continues during the interruption.', collect:['Maximum tolerable interruption and recovery objective','Local recovery actions and authorized roles','Fallback workflow and alternate capacity','Exercise results when normal support and connectivity are unavailable'], controls:'OICC-02, OICC-09, OICC-10, OICC-11'},
  {number:'07', title:'A firmware decision has no recorded owner', condition:'Firmware is installed automatically, deferred indefinitely, supplied through an informal path, or treated as routine maintenance without testing, approval, rollback, and verification decisions.', consequence:'The organization may inherit known vulnerabilities, unreviewed functionality, configuration changes, or an unsupported state without an accountable risk decision.', collect:['Current firmware and embedded component inventory','Authoritative advisory and vulnerability review','Test, approval, deployment, rollback, and exception records','Post-update configuration and functional verification'], controls:'OICC-04, OICC-07, OICC-09'},
  {number:'08', title:'Disposition removes the asset record before it removes the information', condition:'A device is returned, reassigned, replaced, resold, or discarded based on a logistics process that does not identify every storage location or verify the selected sanitization method.', consequence:'Stored jobs, address books, credentials, logs, certificates, settings, and removable or embedded media may leave organizational control without evidence of removal.', collect:['Media and storage component inventory','Information sensitivity and reuse decision','Sanitization method, verification, and responsible person','Transfer, return, destruction, and final custody records'], controls:'OICC-05, OICC-09, OICC-12'}
]

function Header(){
  const [open,setOpen]=useState(false)
  const links=[['Doctrine','/doctrine.html'],['OICC Controls','/controls.html'],['Standards','/standards.html'],['Industries','/industries.html'],['Evidence','/evidence.html'],['Resources','/resources.html'],['Pathways','/pathways.html'],['Briefings','/briefings.html'],['Tools','/tools.html']]
  return <header className="site-header">
    <a className="brand" href="/" aria-label="Output Security Institute home"><span className="brand-mark" aria-hidden="true"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></a>
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

function App(){
  const filename=(window.location.pathname.split('/').pop()||'index.html').replace('.html','')
  const view=filename==='index'?'home':filename
  return <div id="top"><Header/><main className={view==='home'?'home-view':'page-view'} data-view={view}>
  <section className="hero" data-page="home">
    <div className="eyebrow"><span></span>Independent guidance for output security</div>
    <h1>Security does not end<br/>at the <em>screen.</em></h1>
    <p className="hero-copy">Output systems sit where digital information becomes physical, identity becomes action, and policy becomes custody. OSI provides manufacturer-neutral guidance for governing that boundary.</p>
    <div className="hero-actions"><a className="button primary" href="/controls.html">Use the OICC framework <ArrowRight size={18}/></a><a className="text-link" href="/doctrine.html">Read the doctrine <ArrowRight size={18}/></a></div>
    <div className="boundary-map" aria-label="Information crossing the digital and physical boundary"><div className="map-label digital">DIGITAL ENVIRONMENT</div><div className="map-node"><Network/><span>Network and identity</span></div><div className="map-line"></div><div className="map-core"><Fingerprint/><b>OUTPUT<br/>BOUNDARY</b><small>CONTROL BECOMES CUSTODY</small></div><div className="map-line"></div><div className="map-node"><FileKey/><span>Physical information</span></div><div className="map-label physical">PHYSICAL ENVIRONMENT</div></div>
  </section>

  <section className="section issue" id="doctrine" data-page="doctrine">
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

  <section className="section scope-band" data-page="doctrine">
    <div className="section-number">WHAT BELONGS IN SCOPE</div>
    <div className="scope-grid">{[['DEVICES','Printers, MFPs, scanners, label and specialty output'],['SOFTWARE','Drivers, embedded applications, workflow and management'],['CONNECTIONS','Wired, wireless, mobile, cloud, fax, USB and APIs'],['PEOPLE','Users, administrators, service personnel and suppliers'],['INFORMATION','Jobs, scans, queues, address books, logs and physical records'],['DEPENDENCIES','Credentials, parts, supplies, remote tools and escalation paths']].map(([h,p])=><article key={h}><small>{h}</small><p>{p}</p></article>)}</div>
  </section>

  <section className="section dark controls" id="controls" data-page="controls">
    <div className="section-number">02 / OICC FRAMEWORK</div>
    <div className="controls-intro"><div><div className="framework-badge">OICC <small>v1.0 / WORKING FRAMEWORK</small></div><h2>Operational Infrastructure<br/>Critical Controls</h2></div><div><p>The OICC framework organizes output-system governance into twelve control areas. Each area connects an objective to priority actions, expected evidence, and established security frameworks.</p><p className="use-note">Use OICC to discover scope and improve decisions. Do not treat it as a substitute for the authoritative standard or a guarantee of compliance.</p></div></div>
    <div className="control-grid">{controls.map(c=><ControlCard key={c.id} control={c}/>)}</div>
  </section>

  <section className="section assessment" data-page="controls">
    <div className="section-number">03 / ASSESSMENT METHOD</div>
    <div className="assessment-grid"><div><h2>Examine.<br/>Interview.<br/><em>Test.</em></h2><p>A policy statement alone does not establish that a control works. A useful assessment connects organizational intent to implemented settings, observable behavior, and retained evidence.</p></div><div className="method-list">{[['01','EXAMINE','Policies, diagrams, inventories, configurations, contracts, logs, tickets, and disposition records.'],['02','INTERVIEW','Security, IT, operations, procurement, privacy, records, facilities, and service owners.'],['03','TEST','Authentication, release, interfaces, logging, recovery, remote access, update, and sanitization behavior.'],['04','RECONCILE','Compare what policy requires, what people believe, what technology does, and what evidence proves.']].map(([n,t,p])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{p}</p></div></article>)}</div></div>
  </section>

  <section className="section standards" id="standards" data-page="standards">
    <div className="section-number">04 / STANDARDS CROSSWALK</div>
    <div className="standards-head"><div><h2>Translate authoritative guidance into<br/><em>operational questions.</em></h2><p>OICC is a contextual framework. The originating publication remains authoritative. Applicability depends on the organization, information, contract, jurisdiction, and system boundary.</p></div></div>
    <div className="standards-table" role="table" aria-label="Standards relationships"><div className="standards-row table-head" role="row"><span>REFERENCE</span><span>ROLE</span><span>OICC RELATIONSHIP AND APPLICABILITY</span><span>LINK</span></div>{standards.map(s=><article className="standards-row" role="row" key={s.name}><h3>{s.name}</h3><small>{s.status}</small><div><p>{s.relationship}</p><p className="applicability"><b>Applicability:</b> {s.applicability}</p></div><a href={s.url} target="_blank" rel="noreferrer" aria-label={`Open ${s.name}`}><ExternalLink size={18}/></a></article>)}</div>
  </section>

  <section className="section industries" id="industries" data-page="industries">
    <div className="section-number">05 / INDUSTRY IMPLEMENTATION</div>
    <h2>The control objective stays consistent.<br/>The <em>operational consequence</em> changes.</h2>
    <div className="industry-grid">{industries.map(i=><article key={i.title}><span></span><h3>{i.title}</h3><p>{i.focus}</p><p className="industry-consequence"><b>Operational consequence:</b> {i.consequence}</p><details><summary>Implementation guide <ChevronDown size={15}/></summary><h4>Evidence to expect</h4><ul>{i.evidence.map(e=><li key={e}>{e}</li>)}</ul><h4>Questions to bring forward</h4><ul>{i.questions.map(q=><li key={q}>{q}</li>)}</ul></details></article>)}</div>
  </section>

  <section className="section procurement" data-page="standards">
    <div className="section-number">06 / PROCUREMENT QUESTIONS</div>
    <div className="procurement-grid"><div><h2>Ask what the technology changes<br/>before asking what it <em>costs.</em></h2><p>Security requirements added after selection become exceptions, workarounds, bolt-ons, and dependencies. Bring them into the decision before the architecture is fixed.</p></div><ol>{['What information will the system process, store, transmit, render, or retain?','Which identities can use, administer, integrate with, or service it?','Which protocols, ports, interfaces, cloud services, and remote tools are required?','What security evidence can the system produce and retain?','How are firmware provenance, vulnerabilities, updates, and end-of-support handled?','What work must continue when the device, network, cloud service, or support provider is unavailable?','How is data removal verified during reassignment, return, replacement, or disposal?','Which dependencies are eliminated, which are introduced, and who owns each one?'].map((q,i)=><li key={q}><span>{String(i+1).padStart(2,'0')}</span>{q}</li>)}</ol></div>
  </section>

  <section className="section evidence" id="evidence" data-page="evidence">
    <div className="section-number">07 / EVIDENCE PATTERN LIBRARY</div>
    <div className="evidence-intro"><h2>Look for the condition.<br/><em>Then test the claim.</em></h2><div><p>These patterns describe recurring governance conditions, not allegations against a product, supplier, or industry.</p><p>Each pattern begins with something that can be observed. The purpose is to connect the observation to its operational consequence and identify the evidence needed for a defensible conclusion.</p></div></div>
    <div className="evidence-grid">{evidencePatterns.map(pattern=><details className="evidence-card" key={pattern.number}><summary><span>{pattern.number}</span><SearchCheck size={25}/><h3>{pattern.title}</h3><p>{pattern.condition}</p><b>Examine pattern <ChevronDown size={15}/></b></summary><div className="evidence-detail"><div><h4>Why it matters</h4><p>{pattern.consequence}</p></div><div><h4>Evidence to collect</h4><ul>{pattern.collect.map(item=><li key={item}><FileCheck2 size={14}/>{item}</li>)}</ul></div><small>Related controls: {pattern.controls}</small></div></details>)}</div>
    <div className="evidence-rule"><Fingerprint size={32}/><div><span>EVIDENCE RULE</span><h3>A setting is not evidence that a control works.</h3><p>A defensible conclusion compares documented intent, implemented configuration, observed behavior, accountable ownership, and retained records. When those sources disagree, the disagreement is part of the evidence.</p></div></div>
  </section>

  <ResourceCenter/>

  <Pathways/>

  <Briefings/>

  <section className="section tools" id="tools" data-page="tools">
    <div className="section-number">11 / IMPLEMENTATION TOOLS</div>
    <div className="tools-intro"><h2>Turn the principle into<br/><em>a governed decision.</em></h2><div><p>These working documents are designed for security, IT, compliance, operations, procurement, records, and service owners to complete together.</p><p>They do not produce a certification or compliance determination. Their purpose is to make scope, ownership, evidence, dependency, and unresolved decisions visible.</p></div></div>
    <div className="tool-grid">{tools.map(t=><article className="tool-card" key={t.title}><div className="tool-number">{t.number}</div><FileText size={28}/><h3>{t.title}</h3><p>{t.purpose}</p><div className="tool-use"><h4>Useful for</h4><ul>{t.use.map(x=><li key={x}>{x}</li>)}</ul></div><a className="button tool-download" href={t.file} download>Download {t.format} <Download size={16}/></a></article>)}</div>
    <div className="tool-method"><div><span>USE THE TOOLS IN SEQUENCE</span><h3>Boundary before controls.<br/>Controls before evidence.<br/>Evidence before conclusions.</h3></div><ol><li><b>Define</b><span>Establish the work, information, components, people, and dependencies in scope.</span></li><li><b>Assess</b><span>Compare each control objective with the implemented condition and accountable owner.</span></li><li><b>Collect</b><span>Examine records, interview responsible people, and test actual behavior.</span></li><li><b>Decide</b><span>Record gaps, accepted risk, required change, responsible owner, and due date.</span></li></ol></div>
  </section>

  <section className="section about" id="about" data-page="about">
    <div className="section-number">12 / ABOUT OSI</div>
    <div className="about-grid"><h2>Independent guidance for a boundary that deserves clearer governance.</h2><div><p>The Output Security Institute develops practical, manufacturer-neutral guidance for the security, integrity, and continuity of systems that create, move, and manage physical information.</p><p>OSI is an independent educational initiative. It does not certify products, organizations, security, or regulatory compliance. References to external frameworks do not imply affiliation or endorsement.</p><p>Our purpose is direct: help security, IT, compliance, operations, and procurement teams ask better questions, establish clearer ownership, reduce unexamined dependency, and strengthen continuity.</p><a className="text-link dark-link" href="mailto:info@outputsecurityinstitute.org?subject=Contributing%20to%20OSI">Contribute expertise or request guidance <ArrowRight size={17}/></a></div></div>
  </section>
</main>
<footer><div className="brand footer-brand"><span className="brand-mark"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></div><p>Security beyond the screen.</p><div><a href="/doctrine.html">Doctrine</a><a href="/controls.html">OICC Framework</a><a href="/standards.html">Standards</a><a href="/evidence.html">Evidence</a><a href="/resources.html">Resources</a><a href="/pathways.html">Pathways</a><a href="/briefings.html">Briefings</a><a href="/tools.html">Tools</a><a href="/about.html">About</a></div><small>© {new Date().getFullYear()} Output Security Institute. Independent educational guidance. Verify all requirements with the authoritative source.</small></footer></div>}

export default App
