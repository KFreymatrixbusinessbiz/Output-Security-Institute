import { useEffect, useState } from 'react'
import {
  ArrowRight, BookOpen, CheckCircle2, ChevronDown, ClipboardCheck, Compass,
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

const methodologyPrinciples = [
  ['01','Primary sources first','OSI begins with issuing authorities, standards bodies, regulators, and official technical publications. Secondary commentary can provide context, but it cannot replace the source.'],
  ['02','Applicability before interpretation','A requirement is not applied merely because it sounds relevant. The organization, information, contract, jurisdiction, and system boundary determine whether it governs the decision.'],
  ['03','Boundary before controls','OSI identifies the work, information, components, identities, connections, people, locations, and dependencies before recommending a control or drawing a conclusion.'],
  ['04','Evidence before conclusions','A claim becomes defensible only when documented intent, implemented configuration, observed behavior, accountable ownership, and retained records support it.'],
  ['05','Manufacturer neutrality','No manufacturer, reseller, service provider, or sponsor controls OSI conclusions. Commercial experience may reveal a condition; it does not establish the proof.'],
  ['06','Revision discipline','Guidance should change when an authoritative source changes, a material fact is corrected, stronger evidence appears, or field experience exposes a weakness in the method.']
]

const methodologySteps = [
  ['OBSERVE','Identify a recurring operational condition without assuming its cause.'],
  ['SOURCE','Locate the strongest authoritative material that governs or informs it.'],
  ['TRANSLATE','Turn source language into boundary, ownership, control, evidence, and continuity questions.'],
  ['CHALLENGE','Test assumptions, conflicts, limitations, and plausible alternate explanations.'],
  ['PUBLISH','State the conclusion at the strength the evidence supports and identify its limitations.'],
  ['REVIEW','Revisit the guidance when sources, technology, evidence, or operating conditions change.']
]

function Methodology(){
  return <section className="section methodology" id="methodology" data-page="methodology">
    <div className="section-number">11 / METHODOLOGY &amp; INDEPENDENCE</div>
    <div className="method-intro"><h2>Trust the method.<br/><em>Then test the claim.</em></h2><div><p>OSI guidance is designed to be examined, challenged, and improved. Its credibility should come from transparent reasoning, authoritative sources, observable evidence, and clear limitations—not from institutional language or commercial association.</p><p>The originating source remains authoritative. OSI translates that source into operational questions for output systems and states clearly when a conclusion is interpretation rather than requirement.</p></div></div>
    <div className="method-principles">{methodologyPrinciples.map(([number,title,body])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    <div className="method-sequence"><div><small>HOW OSI DEVELOPS GUIDANCE</small><h3>From recurring condition<br/>to defensible guidance.</h3></div><ol>{methodologySteps.map(([title,body],index)=><li key={title}><span>{String(index+1).padStart(2,'0')}</span><div><b>{title}</b><p>{body}</p></div></li>)}</ol></div>
    <div className="method-columns"><div><small>STATEMENT TYPES</small><h3>Know what kind of statement you are reading.</h3><div className="statement-list"><article><b>REQUIREMENT</b><p>Language traceable to an applicable authoritative source.</p></article><article><b>GUIDANCE</b><p>A recommended practice published by an authoritative body.</p></article><article><b>OSI INTERPRETATION</b><p>OSI’s reasoned translation of a source into the output-system context.</p></article><article><b>OPERATIONAL OBSERVATION</b><p>A recurring condition that should be investigated, not treated as proof by itself.</p></article></div></div><div><small>SOURCE HIERARCHY</small><h3>Authority determines how strongly a conclusion can be stated.</h3><ol className="source-levels"><li><span>01</span>Issuing authority or standards body</li><li><span>02</span>Official supplemental guidance</li><li><span>03</span>Regulator or agency interpretation</li><li><span>04</span>Peer-reviewed research</li><li><span>05</span>Reputable independent technical evidence</li><li><span>06</span>Vendor claims, identified and verified as claims</li></ol></div></div>
    <div className="independence-grid"><div><ShieldCheck size={34}/><small>INDEPENDENCE STANDARD</small><h3>No pay-to-play conclusions.</h3><p>OSI does not sell product certification, rankings, endorsements, or favorable findings. Contributors should disclose relevant roles, affiliations, and material interests. Attribution does not imply endorsement by a contributor’s employer.</p></div><div><Workflow size={34}/><small>EDITORIAL CONTROL</small><h3>Experience informs the question—not the answer.</h3><p>Manufacturer and service experience can reveal conditions worth examining. OSI retains editorial control, tests those conditions against authoritative sources and evidence, and avoids presenting commercial preference as security doctrine.</p></div><div><FileCheck2 size={34}/><small>REVISION &amp; CORRECTION</small><h3>Substantive guidance should be versioned.</h3><p>Working drafts, published guidance, superseded material, and withdrawn material should be distinguishable. Material corrections should be made visibly, with the reason for revision preserved.</p></div></div>
    <div className="method-limit"><Fingerprint size={34}/><div><small>LIMIT OF THE METHOD</small><h3>OSI does not make the organization’s decision.</h3><p>OSI material is educational guidance—not legal advice, certification, attestation, product approval, or a compliance determination. Applicability and implementation must be validated within the organization’s actual environment and against the controlling source.</p><div className="method-links"><a href="/resources.html">Examine the authoritative resources <ArrowRight size={15}/></a><a href="mailto:info@outputsecurityinstitute.org?subject=OSI%20Methodology%20Feedback">Challenge or improve the guidance <ArrowRight size={15}/></a></div></div></div>
  </section>
}

const governanceRoles = [
  ['01','Executive and risk authority','Sets risk tolerance, accepts material exceptions, resolves priority conflicts, and ensures output systems are included in enterprise governance.'],
  ['02','System owner','Owns the operating outcome, system boundary, inventory, criticality, dependencies, lifecycle, and coordination of control decisions.'],
  ['03','Information owner','Defines sensitivity, authorized use, release, retention, custody, disclosure, and disposition requirements for the information handled.'],
  ['04','Security and identity','Defines architecture, authentication, administrative access, configuration, vulnerability, logging, and incident requirements.'],
  ['05','Operations and local capability','Owns continuity at the point of work, authorized first response, fallback procedures, exercises, and escalation when local recovery is insufficient.'],
  ['06','Procurement and supplier governance','Turns control objectives into selection, contract, evidence, access, service, provenance, and end-of-support requirements.'],
  ['07','Privacy, legal and records','Interprets privacy, records, disclosure, contractual, jurisdictional, and retention obligations that shape the workflow.'],
  ['08','Lifecycle custodian','Governs deployment, change, service access, updates, parts and media custody, reassignment, return, sanitization, and verified disposition.']
]

const decisionRights = [
  ['Define the governed boundary','System owner','Information owner; security; operations','Approved boundary, inventory, data flow, dependencies'],
  ['Authorize privileged or service access','Security and identity','System owner; supplier governance','Named account, approval, session or activity record, review'],
  ['Approve firmware or material configuration change','System owner','Security; operations; lifecycle custodian','Test, risk decision, rollback plan, change and verification record'],
  ['Accept a security or continuity exception','Executive or delegated risk authority','Control owner; legal or compliance; system owner','Scope, rationale, compensating controls, expiration, approver'],
  ['Invoke local recovery or fallback','Operations and local capability','System owner; security; information owner as needed','Authorized action, event record, outcome, escalation decision'],
  ['Release, retain, sanitize or dispose of information','Information owner','Records; privacy or legal; lifecycle custodian','Method, authority, custody, verification and final disposition']
]

const lifecycleEvents = [
  ['ACQUIRE','Who converts risk and continuity needs into selection and contract requirements?'],
  ['DEPLOY','Who approves the boundary, baseline, identities, interfaces, evidence and operating acceptance?'],
  ['OPERATE','Who reviews access, events, vulnerabilities, dependencies, exceptions and local readiness?'],
  ['CHANGE','Who evaluates the effect of firmware, configuration, workflow, network, ownership or supplier change?'],
  ['INTERRUPT','Who may act locally, preserve evidence, invoke fallback and decide when escalation is required?'],
  ['RETIRE','Who identifies information-bearing components and verifies custody, sanitization, return or destruction?']
]

function Governance(){
  return <section className="section governance" id="governance" data-page="governance">
    <div className="section-number">12 / GOVERNANCE &amp; OWNERSHIP</div>
    <div className="governance-intro"><h2>Ownership is<br/><em>a control.</em></h2><div><p>Output security often fails in the handoffs between security, IT, operations, procurement, records, privacy, and service. A generic team cannot accept risk, authorize access, invoke continuity, or verify disposition.</p><p>Governance should name the decision, the person or role with authority, the participants whose knowledge is required, the evidence that records the result, and the event that causes review.</p></div></div>
    <div className="governance-roles">{governanceRoles.map(([number,title,body])=><article key={number}><span>{number}</span><Workflow size={24}/><h3>{title}</h3><p>{body}</p></article>)}</div>
    <div className="decision-rights"><div className="decision-heading"><small>DECISION RIGHTS</small><h3>Accountability belongs to a decision—not merely a department.</h3><p>Titles will vary by organization. The requirement is that authority and participation are explicit before the decision is needed.</p></div><div className="decision-table" role="table" aria-label="Output security decision rights"><div className="decision-row decision-labels" role="row"><span>DECISION</span><span>ACCOUNTABLE OWNER</span><span>REQUIRED PARTICIPANTS</span><span>RETAINED EVIDENCE</span></div>{decisionRights.map(([decision,owner,participants,evidence])=><article className="decision-row" role="row" key={decision}><h4>{decision}</h4><p>{owner}</p><p>{participants}</p><p>{evidence}</p></article>)}</div></div>
    <div className="lifecycle-governance"><small>REVIEW TRIGGERS</small><h3>Ownership must remain visible across the lifecycle.</h3><div className="lifecycle-grid">{lifecycleEvents.map(([event,question],index)=><article key={event}><span>{String(index+1).padStart(2,'0')}</span><b>{event}</b><p>{question}</p></article>)}</div></div>
    <div className="governance-cadence"><ShieldCheck size={34}/><div><small>GOVERNANCE CADENCE</small><h3>Review when risk changes—not only when the calendar says so.</h3><p>Continuous monitoring, periodic access and inventory review, supplier and recovery exercises, and annual policy review can provide a useful baseline. Material changes to information, interfaces, location, ownership, firmware, suppliers, workflow, or operational consequence should trigger review immediately. Scale the cadence to risk and applicable requirements.</p></div></div>
    <div className="ownership-close"><FileCheck2 size={34}/><div><small>THE CLOSING TEST</small><h3>No orphaned decisions.</h3><p>For every material control, the organization should be able to identify who owns the outcome, who has authority to decide, who must participate, what evidence proves the decision, and when it must be reconsidered.</p><div className="method-links"><a href="/controls.html">Connect ownership to the OICC controls <ArrowRight size={15}/></a><a href="/tools.html">Record ownership in the working tools <ArrowRight size={15}/></a></div></div></div>
  </section>
}

const maturityStages = [
  ['01','VISIBLE','The organization can identify the output environment, its information, owners, interfaces, dependencies, critical work, and material unknowns.','Current inventory; preliminary boundary; named discovery owner; unresolved-question register'],
  ['02','DEFINED','Control objectives, decision rights, approved baselines, supplier requirements, continuity needs, and evidence expectations are documented.','Approved scope; role and authority matrix; configuration baseline; evidence plan'],
  ['03','GOVERNED','Controls operate through assigned roles, authorized processes, documented exceptions, controlled changes, and lifecycle requirements.','Access reviews; change records; exception decisions; service and custody records'],
  ['04','VERIFIED','The organization examines records, interviews owners, tests behavior, reconciles contradictions, and records defensible conclusions.','Test results; evidence samples; findings; risk decisions; remediation ownership'],
  ['05','SUSTAINED','Monitoring, review triggers, exercises, source changes, supplier changes, incidents, and lessons learned continuously improve the operating model.','Trend review; recovery exercises; source watch; revised baselines; closed-loop corrective action']
]

const implementationMoves = [
  ['START WITH THE WORK','Identify what must continue, the acceptable interruption, and the consequence when output is unavailable, misdirected, altered, or unaccountable.'],
  ['DRAW THE BOUNDARY','Include devices, software, identities, information, interfaces, people, locations, service paths, suppliers, parts, media, and physical custody.'],
  ['ASSIGN THE DECISIONS','Name who owns the outcome, who has authority, who must participate, what evidence records the decision, and what triggers reconsideration.'],
  ['ESTABLISH THE BASELINE','Define the authorized architecture, configuration, access, information handling, evidence, continuity, update, service, and disposition condition.'],
  ['TEST THE CLAIMS','Examine documentation, interview accountable people, observe behavior, test recovery and control operation, and preserve contradictions as findings.'],
  ['CLOSE THE LOOP','Prioritize action by operational consequence, record accepted risk, verify remediation, refresh evidence, and revise the model when conditions change.']
]

function Maturity(){
  return <section className="section maturity" id="maturity" data-page="maturity">
    <div className="section-number">13 / IMPLEMENTATION MATURITY</div>
    <div className="maturity-intro"><h2>Progress is the ability<br/>to make a <em>better decision.</em></h2><div><p>Output-security maturity is not the number of products installed, policies written, or boxes checked. It is the organization’s increasing ability to see the environment, assign authority, operate controls, verify claims, and adapt before an interruption or incident forces the issue.</p><p>The stages below describe observable operating conditions. They are not a certification scale, a compliance score, or a substitute for the requirements that apply to the organization.</p></div></div>
    <div className="maturity-stages">{maturityStages.map(([number,title,condition,evidence])=><article key={number}><div><span>{number}</span><b>{title}</b></div><h3>{condition}</h3><p><strong>Evidence of progress</strong>{evidence}</p></article>)}</div>
    <div className="implementation-path"><div className="implementation-path-head"><small>A PRACTICAL IMPLEMENTATION PATH</small><h3>Move in sequence.<br/>Repeat when the boundary changes.</h3></div><ol>{implementationMoves.map(([title,body],index)=><li key={title}><span>{String(index+1).padStart(2,'0')}</span><div><b>{title}</b><p>{body}</p></div></li>)}</ol></div>
    <div className="maturity-measures"><div><small>MEASURES THAT INFORM</small><h3>Measure control health, not activity volume.</h3></div><div className="measure-grid">{[['BOUNDARY','Known components and dependencies reconciled against discovery.'],['OWNERSHIP','Material decisions with a named accountable owner and authority.'],['EVIDENCE','Control conclusions supported by current, retrievable evidence.'],['EXCEPTIONS','Open risk decisions with scope, owner, compensating control and expiration.'],['CONTINUITY','Critical workflows exercised without assuming normal support is available.'],['LIFECYCLE','Changes, service events and disposition completed with verified custody.']].map(([title,body])=><article key={title}><b>{title}</b><p>{body}</p></article>)}</div></div>
    <div className="maturity-warning"><Fingerprint size={34}/><div><small>MATURITY WARNING</small><h3>Do not average away a critical weakness.</h3><p>A strong score in one area cannot neutralize an ungoverned trust path, unavailable recovery capability, unidentified information store, or ownerless risk decision. Report material conditions and their operational consequence directly.</p></div></div>
    <div className="maturity-close"><CheckCircle2 size={34}/><div><small>THE OPERATING TEST</small><h3>The model is mature when it survives contact with change.</h3><p>New information, users, interfaces, locations, suppliers, firmware, workflows, incidents, and mission priorities should trigger known owners and repeatable decisions—not a return to discovery from the beginning.</p><div className="method-links"><a href="/governance.html">Assign the ownership model <ArrowRight size={15}/></a><a href="/tools.html">Begin with the OSI working tools <ArrowRight size={15}/></a></div></div></div>
  </section>
}

const startingProfiles = [
  {number:'01', title:'The boundary is unclear', signal:'Devices are known, but the information, interfaces, owners, service paths, physical custody, and operational dependencies around them are not.', first:'Define the work and draw the complete system boundary.', controls:'OICC-01, OICC-02, OICC-06', evidence:'Boundary workbook, component inventory, data-flow and dependency map', link:'/tools/output-system-boundary-workbook.xlsx'},
  {number:'02', title:'Regulated information crosses output', signal:'CUI, ePHI, CJI, payment data, client records, intellectual property, or other sensitive information may be received, processed, stored, transmitted, rendered, or retained.', first:'Determine applicability, locate the information, and assign custody decisions.', controls:'OICC-02, OICC-03, OICC-05, OICC-08, OICC-12', evidence:'Information-flow map, access model, release rules, retention and disposition records', link:'/standards.html'},
  {number:'03', title:'Work cannot wait for recovery', signal:'Branches, remote sites, clinical work, production, logistics, public service, or 24-hour operations depend on output continuing through an interruption.', first:'Define the work that must continue and test recovery without assuming normal support.', controls:'OICC-02, OICC-10, OICC-11', evidence:'Recovery objective, authorized local actions, fallback map and exercise results', link:'/pathways.html'},
  {number:'04', title:'Outside support enters the environment', signal:'Remote tools, shared credentials, technicians, suppliers, replacement parts, removed components, or cloud services cross organizational trust and custody boundaries.', first:'Make every access path and dependency visible, authorized, limited, and reviewable.', controls:'OICC-03, OICC-07, OICC-09, OICC-12', evidence:'Supplier requirements, access records, approved sources, parts and media custody', link:'/governance.html'},
  {number:'05', title:'An assessment or investigation is approaching', signal:'The organization must show what is in scope, how controls operate, who owns decisions, and what current evidence supports each conclusion.', first:'Build the evidence plan before collecting documents or assigning a score.', controls:'OICC-01, OICC-04, OICC-08, OICC-10', evidence:'Assessment plan, evidence matrix, test results, findings and risk decisions', link:'/evidence.html'}
]

function Profiles(){
  return <section className="section profiles" id="profiles" data-page="profiles">
    <div className="section-number">14 / START HERE</div>
    <div className="profiles-intro"><h2>Start with the condition<br/>you need to <em>change.</em></h2><div><p>You do not need to read the institute in order or begin with a regulation. Choose the condition that most closely resembles your environment, establish a narrow starting boundary, and make the first decision visible.</p><p>More than one profile may apply. Begin where the operational consequence is greatest or where an unknown prevents a defensible decision.</p></div></div>
    <div className="profile-grid">{startingProfiles.map(profile=><article className="profile-card" key={profile.number}><div className="profile-card-head"><span>{profile.number}</span><h3>{profile.title}</h3></div><p className="profile-signal">{profile.signal}</p><div className="profile-first"><small>BEGIN WITH</small><p>{profile.first}</p></div><dl><div><dt>PRIORITY CONTROLS</dt><dd>{profile.controls}</dd></div><div><dt>FIRST EVIDENCE</dt><dd>{profile.evidence}</dd></div></dl><a className="text-link" href={profile.link}>Open the starting resource <ArrowRight size={15}/></a></article>)}</div>
    <div className="profile-sequence"><div><small>THE FIRST 90 DAYS</small><h3>Make the unknowns governable before making the program large.</h3></div><ol><li><b>FIRST 30</b><span>Name the work, boundary, information, dependencies, owners, and material unknowns.</span></li><li><b>NEXT 30</b><span>Define priority control objectives, approved conditions, evidence expectations, and decision rights.</span></li><li><b>NEXT 30</b><span>Test the highest-consequence claims, record contradictions, assign action, and exercise continuity.</span></li></ol></div>
    <div className="profile-close"><Compass size={34}/><div><small>STARTING PRINCIPLE</small><h3>A starting profile is not a reduced standard.</h3><p>It is a disciplined way to begin. The complete boundary, applicable requirements, and remaining OICC control objectives still require review as the organization moves from discovery to sustained governance.</p><div className="method-links"><a href="/maturity.html">Use the implementation maturity model <ArrowRight size={15}/></a><a href="/tools.html">Open the working tools <ArrowRight size={15}/></a></div></div></div>
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
  const links=[['Start Here','/profiles.html'],['OICC Controls','/controls.html'],['Standards','/standards.html'],['Industries','/industries.html'],['Evidence','/evidence.html'],['Resources','/resources.html'],['Briefings','/briefings.html'],['Tools','/tools.html']]
  const currentPath=window.location.pathname==='/'?'/':window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '')
  return <><a className="skip-link" href="#main-content">Skip to main content</a><header className="site-header">
    <a className="brand" href="/" aria-label="Output Security Institute home"><span className="brand-mark" aria-hidden="true"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></a>
    <nav id="main-navigation" className={open?'nav open':'nav'} aria-label="Main navigation">{links.map(([label,href])=>{const normalized=href.replace(/\.html$/, '');const active=currentPath===normalized;return <a key={href} href={href} aria-current={active?'page':undefined} onClick={()=>setOpen(false)}>{label}</a>})}</nav>
    <button className="menu" type="button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-controls="main-navigation" aria-expanded={open}>{open?<X/>:<Menu/>}</button>
  </header></>
}

function NotFound(){
  return <section className="section not-found" data-page="notfound"><div className="section-number">PAGE NOT FOUND</div><div><h2>The path ends here.<br/><em>The work does not.</em></h2><p>The page may have moved, or the address may be incomplete. Choose a starting point or return to the institute home page.</p><div className="not-found-actions"><a className="button primary" href="/profiles.html">Start with your condition <ArrowRight size={17}/></a><a className="text-link" href="/">Return home <ArrowRight size={17}/></a></div></div></section>
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
  const knownViews=['doctrine','controls','standards','industries','evidence','resources','pathways','briefings','methodology','governance','maturity','profiles','tools','about']
  const view=filename==='index'?'home':knownViews.includes(filename)?filename:'notfound'
  const viewTitles={doctrine:'OSI Doctrine',controls:'Operational Infrastructure Critical Controls',standards:'Standards Crosswalk',industries:'Industry Implementation',evidence:'Evidence Pattern Library',resources:'Authoritative Resource Center',pathways:'Implementation Pathways',briefings:'Operational Briefings',methodology:'Research Methodology and Independence',governance:'Governance and Ownership',maturity:'Implementation Maturity',profiles:'Start with Your Condition',tools:'Implementation Tools',about:'About the Output Security Institute',notfound:'Page Not Found'}
  const pageDescriptions={"home":"Independent, manufacturer-neutral guidance for governing the security, integrity, and continuity of organizational output systems.","doctrine":"The governing principles behind OSI guidance for output-system security, custody, dependency, evidence, and continuity.","controls":"Twelve Operational Infrastructure Critical Controls for governing output-system risk, access, configuration, evidence, service, continuity, and lifecycle.","standards":"Understand how authoritative cybersecurity, privacy, CUI, sector, and procurement sources relate to output-system governance.","industries":"Practical output-security implementation guidance for defense, healthcare, finance, government, education, manufacturing, logistics, and professional services.","evidence":"Recurring output-security evidence patterns showing what to observe, why it matters, and what defensible records to collect.","resources":"Search authoritative standards, regulatory guidance, assessment resources, lifecycle references, and secure-procurement sources.","pathways":"Five guided pathways from an operational condition to scope, controls, evidence, procurement, and continuity decisions.","briefings":"Original OSI decision briefings that expose the assumptions behind recurring output-security and continuity decisions.","methodology":"How OSI selects sources, distinguishes requirements from interpretation, develops guidance, manages corrections, and protects editorial independence.","governance":"Assign accountable ownership, decision rights, evidence, and review triggers across the complete output-system lifecycle.","maturity":"A five-stage model for moving output systems from unmanaged conditions to sustained governance without reducing maturity to a compliance score.","profiles":"Choose a practical starting point based on the operating condition your organization faces.","tools":"Editable assessment, system-boundary, procurement, and evidence tools for practical output-system governance.","about":"The purpose, scope, independence, and manufacturer-neutral role of the Output Security Institute.","notfound":"The requested Output Security Institute page could not be found."}
  useEffect(()=>{
    const origin='https://outputsecurityinstitute.org'
    const route=view==='home'?'':view==='notfound'?window.location.pathname:`/${view}`
    const canonical=`${origin}${route}`
    const title=view==='home'?'Output Security Institute | Security Beyond the Screen':`${viewTitles[view]} | Output Security Institute`
    const description=pageDescriptions[view]
    document.title=title
    const setMeta=(selector,attribute,value)=>{
      let element=document.head.querySelector(selector)
      if(!element){
        element=document.createElement('meta')
        const match=selector.match(/meta\[(name|property)="([^"]+)"\]/)
        if(match) element.setAttribute(match[1],match[2])
        document.head.appendChild(element)
      }
      element.setAttribute(attribute,value)
    }
    let canonicalLink=document.head.querySelector('link[rel="canonical"]')
    if(!canonicalLink){
      canonicalLink=document.createElement('link')
      canonicalLink.rel='canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href=canonical
    setMeta('meta[name="description"]','content',description)
    setMeta('meta[property="og:title"]','content',title)
    setMeta('meta[property="og:description"]','content',description)
    setMeta('meta[property="og:url"]','content',canonical)
    setMeta('meta[property="og:image"]','content','https://outputsecurityinstitute.org/assets/osi-social-share.png')
    setMeta('meta[property="og:image:width"]','content','1200')
    setMeta('meta[property="og:image:height"]','content','630')
    setMeta('meta[property="og:image:alt"]','content','Output Security Institute — Security does not end at the screen.')
    setMeta('meta[name="twitter:card"]','content','summary_large_image')
    setMeta('meta[name="twitter:image"]','content','https://outputsecurityinstitute.org/assets/osi-social-share.png')
    setMeta('meta[name="twitter:image:alt"]','content','Output Security Institute — Security does not end at the screen.')
    setMeta('meta[name="twitter:title"]','content',title)
    setMeta('meta[name="twitter:description"]','content',description)
  },[view])
  return <div id="top"><Header/><main id="main-content" className={view==='home'?'home-view':'page-view'} data-view={view} tabIndex="-1">
  {view!=='home'&&<h1 className="sr-only">{viewTitles[view]}</h1>}
  <NotFound/>
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

  <Methodology/>

  <Governance/>

  <Maturity/>

  <Profiles/>

  <section className="section tools" id="tools" data-page="tools">
    <div className="section-number">15 / IMPLEMENTATION TOOLS</div>
    <div className="tools-intro"><h2>Turn the principle into<br/><em>a governed decision.</em></h2><div><p>These working documents are designed for security, IT, compliance, operations, procurement, records, and service owners to complete together.</p><p>They do not produce a certification or compliance determination. Their purpose is to make scope, ownership, evidence, dependency, and unresolved decisions visible.</p></div></div>
    <div className="tool-grid">{tools.map(t=><article className="tool-card" key={t.title}><div className="tool-number">{t.number}</div><FileText size={28}/><h3>{t.title}</h3><p>{t.purpose}</p><div className="tool-use"><h4>Useful for</h4><ul>{t.use.map(x=><li key={x}>{x}</li>)}</ul></div><a className="button tool-download" href={t.file} download>Download {t.format} <Download size={16}/></a></article>)}</div>
    <div className="tool-method"><div><span>USE THE TOOLS IN SEQUENCE</span><h3>Boundary before controls.<br/>Controls before evidence.<br/>Evidence before conclusions.</h3></div><ol><li><b>Define</b><span>Establish the work, information, components, people, and dependencies in scope.</span></li><li><b>Assess</b><span>Compare each control objective with the implemented condition and accountable owner.</span></li><li><b>Collect</b><span>Examine records, interview responsible people, and test actual behavior.</span></li><li><b>Decide</b><span>Record gaps, accepted risk, required change, responsible owner, and due date.</span></li></ol></div>
  </section>

  <section className="section about" id="about" data-page="about">
    <div className="section-number">16 / ABOUT OSI</div>
    <div className="about-grid"><h2>Independent guidance for a boundary that deserves clearer governance.</h2><div><p>The Output Security Institute develops practical, manufacturer-neutral guidance for the security, integrity, and continuity of systems that create, move, and manage physical information.</p><p>OSI is an independent educational initiative. It does not certify products, organizations, security, or regulatory compliance. References to external frameworks do not imply affiliation or endorsement.</p><p>Our purpose is direct: help security, IT, compliance, operations, and procurement teams ask better questions, establish clearer ownership, reduce unexamined dependency, and strengthen continuity.</p><div className="about-links"><a className="text-link dark-link" href="/methodology.html">Read our methodology and independence policy <ArrowRight size={17}/></a><a className="text-link dark-link" href="/governance.html">Use the governance and ownership model <ArrowRight size={17}/></a><a className="text-link dark-link" href="mailto:info@outputsecurityinstitute.org?subject=Contributing%20to%20OSI">Contribute expertise or request guidance <ArrowRight size={17}/></a></div></div></div>
  </section>
</main>
<footer><div className="brand footer-brand"><span className="brand-mark"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></div><p>Security beyond the screen.</p><div><a href="/profiles.html">Start Here</a><a href="/doctrine.html">Doctrine</a><a href="/controls.html">OICC Framework</a><a href="/standards.html">Standards</a><a href="/evidence.html">Evidence</a><a href="/resources.html">Resources</a><a href="/pathways.html">Pathways</a><a href="/briefings.html">Briefings</a><a href="/methodology.html">Methodology</a><a href="/governance.html">Governance</a><a href="/maturity.html">Maturity</a><a href="/tools.html">Tools</a><a href="/about.html">About</a></div><small>© {new Date().getFullYear()} Output Security Institute. Independent educational guidance. Verify all requirements with the authoritative source.</small></footer></div>}

export default App
