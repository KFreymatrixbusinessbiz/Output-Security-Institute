import { useEffect, useState } from 'react'
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ClipboardCheck, ExternalLink,
  FileKey, Fingerprint, Menu, Network, ScanSearch, Search, ShieldCheck, X,
  Monitor, Printer, FileOutput, Archive, Trash2, Users, CalendarDays, Newspaper
} from 'lucide-react'
import { knowledgeCategories, knowledgeResources } from './knowledge-data.js'
import { crosswalkRecords, crosswalkSource } from './standards-data.js'

const september3Brief = [
  {
    title: 'PaperCut confirms active exploitation of NG/MF servers',
    category: 'Print management / Active exploitation',
    confirmed: 'PaperCut is investigating active exploitation affecting all versions of PaperCut NG and PaperCut MF and has confirmed customer incidents. The company disclosed CVE-2026-82078, a critical unsafe dynamic class-loading vulnerability rated CVSS 9.4, and CVE-2026-81578, a high-severity authentication-bypass vulnerability rated CVSS 8.8. Emergency Patch Release 3, published September 1, supersedes the earlier emergency patches. PaperCut recommends that internet-facing Application Servers install Release 3 immediately and restrict web access to trusted IP addresses.',
    inference: 'The reported compromise centers on the PaperCut Application Server rather than the printer itself. OSI infers that this demonstrates why the output system must include the servers, databases, identity connections, management interfaces, monitoring platforms, and service tools surrounding the physical device.',
    why: 'Observed post-exploitation activity includes domain and user discovery, downloaded executables, missing or truncated logs, and installation of SimpleHelp and AnyDesk remote-access software. A compromised print-management server can become a pathway into the broader information environment even when individual printers were not the initial entry point.',
    implication: 'OSI should publish “The Printer Was Not the Entry Point. The Output System Still Was.” Immediate defensive guidance should include Emergency Patch Release 3, removal of public internet exposure, trusted-address restrictions, review of PaperCut server.log indicators, investigation of missing or truncated logs, endpoint detection coverage for the Application Server, credential rotation when compromise is suspected, and separation of monitoring, administration, and service privileges.',
    source: 'PaperCut urgent security advisory',
    url: 'https://www.papercut.com/kb/Main/security-bulletin-27-aug-2026-urgent-security-advisory/'
  }
]

const august28Brief = [
  {
    title: 'NIST advances fine-grained, data-level access control',
    category: 'NIST / Zero Trust / Data access',
    confirmed: 'On August 27, NIST released final Interagency Report 8611, describing embedded Next Generation Access Control (m-NGAC). The model enforces centrally managed, policy-based permissions at the individual database-column level, independent of the application or query tool used to access the data. This is a finalized NIST research publication—not a new CMMC requirement, regulatory mandate, or product standard.',
    inference: 'NIST IR 8611 does not address printers or print-management systems. OSI infers that its data-level authorization model provides a useful benchmark for systems that aggregate output-device and document-transaction data.',
    why: 'Print-management platforms, fleet-monitoring systems, workflow tools, and service portals may collect device identities, user names, job names, document metadata, scan destinations, departmental information, and service data. Authenticating someone to a platform should not automatically authorize access to every category of data maintained by that platform.',
    implication: 'Add a procurement question for print-management, DCA, and service platforms: Can the system separately authorize access to device telemetry, user identity, document or job metadata, administrative settings, credentials, and service records—or does access to the platform expose the entire dataset? This can become an OSI control titled “Data Collection Does Not Create Data Entitlement.”',
    source: 'NIST IR 8611',
    url: 'https://csrc.nist.gov/pubs/ir/8611/final'
  }
]

const august21Brief = [
  {
    title: 'Federal agencies warn of an active threat to industrial endpoints',
    category: 'Operational endpoints / Zero Trust',
    confirmed: 'On August 19, NSA, CISA, FBI, DOE, and EPA issued a joint advisory describing active targeting of Siemens S7 programmable logic controllers. Threat actors are using internet-scanning services to locate exposed or insufficiently segmented PLCs and AI-generated exploitation scripts that mimic legitimate monitoring tools. The agencies also warn that remote access maintained by third-party service providers or integrators may leave asset owners unaware their systems are exposed.',
    inference: 'The advisory does not concern printers. OSI infers that the same architectural exposure applies when an MFP, print-management server, or monitoring agent retains internet reachability, unnecessary services, weak credentials, or an inadequately governed vendor connection.',
    why: 'The advisory demonstrates that operational devices can be discovered and manipulated through ordinary connectivity, known weaknesses, and tools disguised as legitimate monitoring software.',
    implication: 'OSI should publish “Persistent Visibility Is Not Persistent Privilege,” defining narrowly scoped outbound telemetry, a separate service channel disabled by default, customer authorization, verified identity, session expiration, and exportable logs.',
    source: 'CISA joint federal advisory',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-231a',
    source2: 'Official advisory PDF',
    url2: 'https://www.ic3.gov/CSA/2026/260819.pdf'
  },
  {
    title: 'Medusa ransomware advisory expanded for healthcare',
    category: 'Healthcare / Ransomware',
    confirmed: 'On August 18, CISA, FBI, and HHS updated their Medusa ransomware advisory with investigation findings through April 2026. The update reports more than 500 victims and documents rapid exploitation, lateral movement, credential theft, data exfiltration, and double extortion. Healthcare is identified as a frequent target.',
    inference: 'The agencies do not report MFP exploitation in this campaign. OSI infers architectural relevance because output endpoints connected to clinical or administrative systems may become reachable, useful for reconnaissance, or disruptive during a broader compromise.',
    why: 'Healthcare output environments routinely touch ePHI through print queues, scan destinations, fax workflows, address books, local storage, shared folders, and workflow integrations.',
    implication: 'Matrix Business Systems should use a Healthcare Output Ransomware Readiness checklist covering segmentation, removal of unused services, firmware ownership, protected scan destinations and service credentials, print-server and device logging, and recovery procedures during network isolation.',
    source: 'CISA Medusa advisory',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a',
    source2: 'Official FBI/CISA/HHS PDF',
    url2: 'https://www.ic3.gov/CSA/2026/260818.pdf'
  }
]

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
  const links = [['Why It Matters', '/#why'], ['OICC Framework', '/oicc'], ['Standards', '/standards'], ['Knowledge', '/knowledge'], ['Briefings', '/briefings'], ['About', '/about']]
  return <header className="site-header">
    <a className="brand" href="/" aria-label="Output Security Institute home">
      <span className="brand-initials" aria-hidden="true">OSI</span>
      <span className="brand-name"><strong>Output Security</strong><em>Institute</em></span>
    </a>
    <nav id="primary-navigation" className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
      {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-action" href="mailto:info@outputsecurityinstitute.org?subject=Question for OSI" onClick={() => setOpen(false)}>Ask OSI <ArrowRight size={15}/></a>
    </nav>
    <button className="menu" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X/> : <Menu/>}</button>
  </header>
}

function KnowledgeCenterPage(){
  const [query,setQuery]=useState('')
  const [filters,setFilters]=useState({category:'All',authority:'All',domain:'All',industry:'All'})
  const slug=window.location.pathname.split('/').filter(Boolean)[1]
  const selected=slug?knowledgeResources.find(item=>item.slug===slug):null
  useEffect(()=>{
    document.title=selected?`${selected.title} | OSI Knowledge Center`:'Knowledge Center | Output Security Institute'
    const meta=document.querySelector('meta[name="description"]')
    if(meta) meta.setAttribute('content',selected?`Source record and OSI relevance for ${selected.title}.`:'Authoritative sources, evidence, and practical guidance for output security, organized by provenance and OICC domain.')
  },[selected])
  if(slug) return selected?<KnowledgeResourceDetail item={selected}/>:<KnowledgeNotFound/>
  const options={
    category:knowledgeCategories,
    authority:[...new Set(knowledgeResources.map(x=>x.authority))],
    domain:[...new Set(knowledgeResources.flatMap(x=>x.domains))],
    industry:[...new Set(knowledgeResources.map(x=>x.industry))]
  }
  const search=query.trim().toLowerCase()
  const visible=knowledgeResources.filter(item=>
    Object.entries(filters).every(([key,value])=>value==='All'||(key==='domain'?item.domains.includes(value):item[key]===value))&&
    (!search||[item.title,item.source,item.category,item.authority,item.type,item.summary,item.relevance,item.industry,item.jurisdiction,...item.domains].filter(Boolean).join(' ').toLowerCase().includes(search))
  )
  const clear=()=>{setQuery('');setFilters({category:'All',authority:'All',domain:'All',industry:'All'})}
  const active=query||Object.values(filters).some(value=>value!=='All')
  return <div className="kc-page"><Header/><main>
    <section className="kc-hero"><a href="/" className="kc-back"><ArrowLeft size={15}/> Output Security Institute</a><div className="kc-kicker">OSI Knowledge Center</div><h1>Evidence, guidance, and authoritative sources for output security.</h1><div className="kc-hero-copy"><p>OSI organizes standards, regulatory material, security advisories, research, and independent guidance relevant to systems that create, move, and manage physical information.</p><strong>Source authority matters.</strong><p>A government requirement, security advisory, research paper, manufacturer notice, and OSI interpretation should not be presented as though they are equivalent.</p></div></section>

    <section className="kc-authority" aria-labelledby="authority-heading"><div><span>Provenance before interpretation</span><h2 id="authority-heading">Understand what a source is before deciding how to use it.</h2><p>These classifications clarify provenance and context. They are not presented as a universal legal hierarchy.</p></div><ol>{[
      ['Primary authority','Official standards, requirements, regulations, and government source material.'],
      ['Authoritative guidance','Official government, framework, or sector guidance.'],
      ['Security / technical source','Official advisories and primary technical notices.'],
      ['Research / evidence','Technical research, analysis, reports, and documented evidence.'],
      ['OSI interpretation','Independent OSI material that explains or applies information to output security.']
    ].map(([name,text],i)=><li key={name}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{name}</strong><p>{text}</p></div></li>)}</ol></section>

    <section className="kc-library" aria-labelledby="library-heading"><div className="kc-library-head"><div><span>Resource index</span><h2 id="library-heading">The currently verified library.</h2></div><p>External source language and OSI interpretation are identified separately. Each OICC relationship is an OSI relevance judgment—not an endorsement by the issuing organization.</p></div>
      <div className="kc-toolbar">
        <label className="kc-search"><span>Search resources</span><div><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Title, source, subject, or domain"/></div></label>
        <div className="kc-filter-grid">{[
          ['category','Category'],['authority','Authority / source type'],['domain','OICC domain'],['industry','Operational context']
        ].map(([key,label])=><label key={key}><span>{label}</span><select value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})}><option value="All">All</option>{options[key].map(value=><option key={value} value={value}>{value}</option>)}</select></label>)}</div>
      </div>
      <div className="kc-count"><span>{String(visible.length).padStart(2,'0')} indexed resources</span>{active&&<button type="button" onClick={clear}>Clear search and filters</button>}</div>
      {visible.length?<div className="kc-results">{visible.map((item,i)=><article key={item.slug}>
        <div className="kc-meta"><span>{String(i+1).padStart(2,'0')}</span><b>{item.authority}</b><span>{item.category}</span></div>
        <div className="kc-body"><small>Source / {item.source}</small><h3><a href={`/knowledge/${item.slug}`}>{item.title}</a></h3><p>{item.summary}</p><div className="kc-relevance"><strong>OSI relevance</strong><p>{item.relevance}</p></div></div>
        <div className="kc-record"><span><b>Published</b>{item.date}</span>{item.updated&&<span><b>Updated</b>{item.updated}</span>}<span><b>OSI last reviewed</b>{item.reviewed}</span><span><b>Related OICC domains</b>{item.domains.join(' · ')}</span><a href={item.url} target="_blank" rel="noreferrer" aria-label={`View original source for ${item.title} (opens in a new tab)`}>View original source <ExternalLink size={15}/></a></div>
      </article>)}</div>:<div className="kc-empty"><strong>No indexed resources match these filters.</strong><p>This means no resources in the current OSI index match—not that no authoritative resources exist.</p><button type="button" onClick={clear}>Clear search and filters</button></div>}
      <aside className="kc-disclosure"><ShieldCheck size={25}/><div><strong>Source and interpretation standard</strong><p>OSI links to the original publisher whenever possible. “OSI relevance” and “Related OICC domains” are OSI interpretation, not source language or endorsement. Inclusion does not establish compliance.</p></div></aside>
    </section>
  </main><SiteFooter/></div>
}

function KnowledgeResourceDetail({item}){
  const domainAnchors={
    'Governance & Ownership':'governance-ownership',
    'Identity & Access':'identity-access',
    'Data Protection':'data-protection',
    'Secure Configuration':'secure-configuration',
    'Visibility & Evidence':'visibility-evidence',
    'Network & Integration':'network-integration',
    'Service & Supply Chain':'service-supply-chain',
    'Recovery & Continuity':'recovery-continuity',
    'Lifecycle Assurance':'lifecycle-assurance'
  }
  return <div className="kc-page"><Header/><main className="kc-detail"><section className="kc-detail-hero"><a href="/knowledge" className="kc-back"><ArrowLeft size={15}/> Knowledge Center index</a><div className="kc-kicker">{item.authority}</div><h1>{item.title}</h1><p>{item.source}</p></section><section className="kc-detail-record"><aside><h2>Source record</h2><dl><div><dt>Issuing source</dt><dd>{item.source}</dd></div><div><dt>Authority type</dt><dd>{item.authority}</dd></div><div><dt>Resource type</dt><dd>{item.type}</dd></div><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>Published</dt><dd>{item.date}</dd></div>{item.updated&&<div><dt>Updated</dt><dd>{item.updated}</dd></div>}<div><dt>OSI last reviewed</dt><dd>{item.reviewed}</dd></div>{item.status&&<div><dt>Status</dt><dd>{item.status}</dd></div>}{item.jurisdiction&&<div><dt>Jurisdiction</dt><dd>{item.jurisdiction}</dd></div>}<div><dt>Operational context</dt><dd>{item.industry}</dd></div></dl><a href={item.url} target="_blank" rel="noreferrer" aria-label={`View original source for ${item.title} (opens in a new tab)`}>View original source <ExternalLink size={16}/></a></aside><article><section><span>Source</span><h2>What the resource addresses</h2><p>{item.summary}</p></section><section className="kc-detail-relevance"><span>OSI relevance</span><h2>Why OSI indexed this</h2><p>{item.relevance}</p></section><section><span>OSI mapping</span><h2>Related OICC domains</h2><ul>{item.domains.map(domain=><li key={domain}><a href={`/oicc#${domainAnchors[domain]}`}>{domain}</a></li>)}</ul><p className="kc-note">This relationship is assigned by OSI. It does not indicate that the issuing organization references or endorses OICC.</p></section></article></section></main><SiteFooter/></div>
}

function KnowledgeNotFound(){return <div className="kc-page"><Header/><main><section className="kc-not-found"><span>Knowledge Center</span><h1>Resource not found.</h1><p>This record is not part of the currently verified OSI index.</p><a href="/knowledge">Return to the resource index <ArrowRight size={17}/></a></section></main><SiteFooter/></div>}

function BriefingsPage(){
  return <div className="brief-page"><Header/><main>
    <section className="brief-hero">
      <a href="/" className="kc-back"><ArrowLeft size={15}/> Output Security Institute</a>
      <div className="eyebrow"><span></span> Primary-source developments for output environments</div>
      <h1>OSI Security<br/><em>Brief.</em></h1>
      <div className="brief-hero-meta"><span><CalendarDays size={17}/> September 3, 2026</span><span>Security update</span><span>1 urgent development</span></div>
      <p>OSI identifies developments that deserve attention, explains why they matter to output systems and physical information, and distinguishes confirmed facts from OSI interpretation.</p>
    </section>

    <section className="brief-editorial">
      <strong>Editorial standard</strong>
      <p>OSI prioritizes authoritative primary sources, excludes routine promotion and recycled commentary, and states when a conclusion is an inference rather than source language. Inclusion does not establish endorsement or compliance.</p>
    </section>

    <section className="brief-list">
      {september3Brief.map((item,i)=><article className="brief-item" key={item.title}>
        <div className="brief-index"><span>{String(i+1).padStart(2,'0')}</span><small>{item.category}</small></div>
        <div className="brief-content"><h2>{item.title}</h2>
          <div className="brief-fact"><strong>Confirmed</strong><p>{item.confirmed}</p></div>
          {item.inference&&<div className="brief-inference"><strong>OSI inference</strong><p>{item.inference}</p></div>}
          <div className="brief-why"><strong>Why it matters</strong><p>{item.why}</p></div>
          <div className="brief-implication"><strong>Specific OSI / Matrix application</strong><p>{item.implication}</p></div>
        </div>
        <div className="brief-sources"><a href={item.url} target="_blank" rel="noreferrer">{item.source} <ExternalLink size={14}/></a>{item.url2&&<a href={item.url2} target="_blank" rel="noreferrer">{item.source2} <ExternalLink size={14}/></a>}</div>
      </article>)}
    </section>

    <section className="brief-none section">
      <div className="section-number">SEPTEMBER 3 SECURITY UPDATE</div>
      <h2>Immediate action takes <em>priority.</em></h2>
      <p>This update is limited to the actively exploited PaperCut vulnerability and the vendor's current mitigation guidance. Other monitored categories will be addressed in the next scheduled weekly brief.</p>
    </section>

    <section className="brief-none section">
      <div className="section-number">AUGUST 28 EDITION — PRESERVED</div>
      <h2>Previous material development.</h2>
    </section>

    <section className="brief-list">
      {august28Brief.map((item,i)=><article className="brief-item" key={item.title}>
        <div className="brief-index"><span>{String(i+1).padStart(2,'0')}</span><small>{item.category}</small></div>
        <div className="brief-content"><h2>{item.title}</h2>
          <div className="brief-fact"><strong>Confirmed</strong><p>{item.confirmed}</p></div>
          {item.inference&&<div className="brief-inference"><strong>OSI inference</strong><p>{item.inference}</p></div>}
          <div className="brief-why"><strong>Why it matters</strong><p>{item.why}</p></div>
          <div className="brief-implication"><strong>Specific OSI / Matrix application</strong><p>{item.implication}</p></div>
        </div>
        <div className="brief-sources"><a href={item.url} target="_blank" rel="noreferrer">{item.source} <ExternalLink size={14}/></a>{item.url2&&<a href={item.url2} target="_blank" rel="noreferrer">{item.source2} <ExternalLink size={14}/></a>}</div>
      </article>)}
    </section>

    <section className="brief-none section">
      <div className="section-number">AUGUST 21 EDITION — PRESERVED</div>
      <h2>Previous material developments.</h2>
    </section>

    <section className="brief-list">
      {august21Brief.map((item,i)=><article className="brief-item" key={item.title}>
        <div className="brief-index"><span>{String(i+1).padStart(2,'0')}</span><small>{item.category}</small></div>
        <div className="brief-content"><h2>{item.title}</h2>
          <div className="brief-fact"><strong>Confirmed</strong><p>{item.confirmed}</p></div>
          {item.inference&&<div className="brief-inference"><strong>OSI inference</strong><p>{item.inference}</p></div>}
          <div className="brief-why"><strong>Why it matters</strong><p>{item.why}</p></div>
          <div className="brief-implication"><strong>Specific OSI / Matrix application</strong><p>{item.implication}</p></div>
        </div>
        <div className="brief-sources"><a href={item.url} target="_blank" rel="noreferrer">{item.source} <ExternalLink size={14}/></a>{item.url2&&<a href={item.url2} target="_blank" rel="noreferrer">{item.source2} <ExternalLink size={14}/></a>}</div>
      </article>)}
    </section>

    <section className="brief-none section">
      <div className="section-number">AUGUST 14 BASELINE — PRESERVED</div>
      <h2>Previous material developments.</h2>
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
      <div className="section-number">BASELINE FOR FUTURE REPORTING</div>
      <h2>The August 14 brief remains the <em>starting point.</em></h2>
      <p>The inaugural August 14 edition is preserved above as the baseline for future weekly reporting.</p>
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

const oiccDomains = [
  {
    n:'01', title:'Governance & Ownership', id:'governance-ownership',
    purpose:'Assign accountability for output systems, their data, configurations, service access, and lifecycle decisions.',
    questions:['Who owns security decisions for the complete output environment?','Are device, print-server, workflow, records, and physical-custody responsibilities documented?','Who accepts risk when an approved baseline cannot be met?'],
    evidence:['Named system and data owners','Current inventory with business purpose and location','Approved policies, risk decisions, and review records'],
    lifecycle:'Applies across the full journey. Ownership should remain clear when responsibility passes between technology, operations, service providers, records teams, and document users.'
  },
  {
    n:'02', title:'Identity & Access', id:'identity-access',
    purpose:'Control who can administer, use, release, retrieve, and service output systems and the information they handle.',
    questions:['Are user, administrator, application, and service identities distinct?','Does access reflect role, device, information sensitivity, and business need?','Can privileged and remote sessions be approved, limited, expired, and reviewed?'],
    evidence:['Role and privilege assignments','Authentication and secure-release settings','Remote-access approvals and session records'],
    lifecycle:'Most visible when information is sent, processed, and released, but it also governs who can create, retain, retrieve, administer, or destroy it.'
  },
  {
    n:'03', title:'Secure Configuration', id:'secure-configuration',
    purpose:'Establish approved baselines for protocols, ports, certificates, firmware, storage, logging, and administrative settings.',
    questions:['Is there an approved configuration baseline for each device and supporting platform?','Are unnecessary services disabled and management paths restricted?','Are firmware, certificates, protocols, and security settings reviewed after change or service?'],
    evidence:['Approved baseline and configuration exports','Firmware and certificate inventories','Change, exception, and remediation records'],
    lifecycle:'Shapes how information is sent and processed and whether residual data, exposed services, or weakened settings persist through maintenance and reassignment.'
  },
  {
    n:'04', title:'Data Protection', id:'data-protection',
    purpose:'Protect information while it is transmitted, processed, stored, printed, scanned, released, and disposed of.',
    questions:['What information can the output system receive, retain, reproduce, route, or expose?','Are transmission, local storage, release, retention, and disposal protections appropriate to sensitivity?','Can data deletion and media sanitization be verified?'],
    evidence:['Data-flow and retention documentation','Encryption, release, overwrite, and sanitization settings','Disposition certificates or verified removal records'],
    lifecycle:'Directly follows the document from creation through destruction, including temporary files, job metadata, scans, address books, logs, and physical copies.'
  },
  {
    n:'05', title:'Visibility & Evidence', id:'visibility-evidence',
    purpose:'Maintain the logs, inventories, ownership records, and event evidence needed to understand what happened and when.',
    questions:['Which security, administrative, job, and service events are recorded?','Can evidence be exported, protected, retained, correlated, and reviewed?','Would missing or truncated logs trigger investigation?'],
    evidence:['Central and device event logs','Review, alert, and incident records','Evidence-retention and time-synchronization settings'],
    lifecycle:'Provides accountability at every stage and helps reconstruct movement, access, release, service activity, retention, and final disposition.'
  },
  {
    n:'06', title:'Service & Supply Chain', id:'service-supply-chain',
    purpose:'Govern external access, replacement components, firmware sources, credentials, remote tools, and third-party dependencies.',
    questions:['Which providers, tools, components, and cloud services can affect the output environment?','Is service access customer-authorized, least-privileged, time-limited, and logged?','Are firmware provenance, vulnerability response, support life, and subcontractor responsibilities defined?'],
    evidence:['Vendor and dependency inventory','Service-access logs and approval records','Contracts, security notices, firmware sources, and support commitments'],
    lifecycle:'Affects processing, availability, stored data, and custody whenever external parties maintain, monitor, replace, return, or dispose of equipment.'
  },
  {
    n:'07', title:'Recovery & Continuity', id:'recovery-continuity',
    purpose:'Design for safe recovery, documented escalation, operational availability, and continuity when normal support is unavailable.',
    questions:['Which output functions are essential, and how long can they be unavailable?','Can secure printing, scanning, faxing, or release continue during isolation or service disruption?','Are restoration priorities, clean configurations, escalation paths, and manual alternatives tested?'],
    evidence:['Recovery and continuity procedures','Test results and corrective actions','Known-good configurations, dependencies, and escalation contacts'],
    lifecycle:'Protects authorized creation, release, and access during disruption while preventing hurried workarounds from weakening custody or data protection.'
  },
  {
    n:'08', title:'Lifecycle Assurance', id:'lifecycle-assurance',
    purpose:'Evaluate acquisition, deployment, maintenance, reassignment, decommissioning, and verified data removal as one control system.',
    questions:['Do acquisition decisions include security capabilities, support period, evidence access, and end-of-life requirements?','Are controls revalidated after deployment, repair, reassignment, or major update?','Can the organization prove secure return, reuse, sanitization, and disposal?'],
    evidence:['Security requirements and procurement evaluations','Deployment, maintenance, reassignment, and acceptance records','End-of-life inventory and verified sanitization evidence'],
    lifecycle:'Extends beyond one document to the life of the system that handles it—from selection and deployment through maintenance, reassignment, return, and disposal.'
  }
]

function SiteFooter(){
  return <footer><div className="brand footer-brand"><span className="brand-mark"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></div><p>Security beyond the screen.</p><div><a href="/briefings">Security Briefs</a><a href="/oicc">OICC Framework</a><a href="/knowledge">Knowledge Center</a><a href="/about">Transparency</a></div><small>© {new Date().getFullYear()} Output Security Institute. Educational guidance only.</small></footer>
}

function AboutPage(){
  useEffect(()=>{
    document.title='About OSI | Output Security Institute'
    const meta=document.querySelector('meta[name="description"]')
    if(meta) meta.setAttribute('content','About the Output Security Institute, an independent educational initiative developing manufacturer-neutral output-security guidance, OICC, and transparent research methods.')
  },[])
  const model=[['Explain','Make output-security conditions understandable.'],['Organize','Structure security responsibilities through OICC.'],['Connect','Relate output-security concerns to established security principles.'],['Curate','Index authoritative sources and evidence.'],['Interpret','Explain why verified external material may matter to output environments.']]
  const method=[['Identify','Locate relevant authoritative or evidentiary material.'],['Verify','Confirm provenance, issuing organization, source location, and available metadata.'],['Classify','Identify the type and authority or context of the source.'],['Interpret','Explain its relevance to output security.'],['Connect','Where defensible, relate it to OICC or other OSI concepts.'],['Review','Maintain awareness of source changes, corrections, or superseding material.']]
  return <div className="about-page"><Header/><main>
    <section className="about-hero"><a href="/" className="kc-back"><ArrowLeft size={15}/> Output Security Institute</a><div className="about-kicker">About the Output Security Institute</div><h1>Independent guidance for the digital-to-physical information boundary.</h1><div className="about-opening"><p>The Output Security Institute develops practical, manufacturer-neutral guidance for the security, integrity, and continuity of systems that create, move, and manage physical information.</p><div><strong>OSI is an independent educational initiative.</strong><p>It is not affiliated with or endorsed by NIST. OSI does not certify products, organizations, or regulatory compliance.</p></div></div></section>
    <section className="about-independence about-section" aria-labelledby="independence-heading"><div className="about-label">Independence</div><div className="about-two"><h2 id="independence-heading">Neutrality is an analytical discipline.</h2><div><p>OSI develops guidance without favoring a particular printer, scanner, output-system manufacturer, software vendor, service provider, or commercial security product.</p><p>Independence here describes manufacturer neutrality and the separation of OSI analysis from external source authority. It is not a claim about unverified funding, governance, or commercial relationships.</p></div></div></section>
    <section className="about-scope about-section" aria-labelledby="scope-heading"><div className="about-label">Institutional scope</div><div className="about-two"><div><h2 id="scope-heading">What OSI does.</h2><p>OSI makes the output-security boundary easier to examine through five connected functions.</p></div><ol>{model.map(([name,text],i)=><li key={name}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{name}</strong><p>{text}</p></div></li>)}</ol></div></section>
    <section className="about-boundaries about-section" aria-labelledby="boundaries-heading"><div className="about-label">Institutional boundaries</div><div className="about-two"><h2 id="boundaries-heading">What OSI does not do.</h2><div><p>Clear boundaries protect the authority of original sources and the responsibility of each organization.</p><ul><li>Create regulatory requirements or replace authoritative standards.</li><li>Certify compliance, products, or organizations.</li><li>Represent OSI mappings as mappings produced or approved by NIST, CISA, or another external authority.</li><li>Treat OSI interpretation as official source language.</li></ul><p className="about-nist"><strong>Specific NIST statement</strong> OSI is not affiliated with or endorsed by NIST.</p></div></div></section>
    <section className="about-method about-section" aria-labelledby="method-heading"><div className="about-label">Research and source methodology</div><h2 id="method-heading">Provenance before interpretation.</h2><ol className="about-process">{method.map(([name,text],i)=><li key={name}><span>{String(i+1).padStart(2,'0')}</span><strong>{name}</strong><p>{text}</p></li>)}</ol></section>
    <section className="about-authority about-section" aria-labelledby="authority-about-heading"><div className="about-label">Authority classifications</div><div className="about-two"><div><h2 id="authority-about-heading">Context begins with what a source is.</h2><p>OSI uses five classifications to help readers understand provenance and context. They are not a universal legal hierarchy.</p><a className="text-link dark-link" href="/knowledge">Explore the Knowledge Center <ArrowRight size={17}/></a></div><ol>{['Primary Authority','Authoritative Guidance','Security / Technical Source','Research / Evidence','OSI Interpretation'].map((name,i)=><li key={name}><span>{String(i+1).padStart(2,'0')}</span>{name}</li>)}</ol></div><p className="about-emphasis">OSI Interpretation is never presented as primary authority.</p></section>
    <section className="about-distinction about-section" aria-labelledby="distinction-heading"><div className="about-label">Source versus interpretation</div><h2 id="distinction-heading">Three layers. Three different meanings.</h2><div className="about-layers"><article><span>01 / Source</span><h3>What the issuing organization says.</h3></article><article><span>02 / OSI interpretation</span><h3>Why OSI believes it matters to output security.</h3></article><article><span>03 / OSI mapping</span><h3>How OSI relates that material to its own framework.</h3></article></div></section>
    <section className="about-mapping about-section" aria-labelledby="mapping-heading"><div className="about-label">Standards-mapping methodology</div><div className="about-two"><div><h2 id="mapping-heading">Mapping is interpretation, not endorsement.</h2><p>OSI begins with authoritative external material, identifies a related security condition, examines its relevance to an OICC domain, classifies the relationship, and preserves access to the original source.</p><a className="text-link dark-link" href="/standards">Review the Standards Crosswalk <ArrowRight size={17}/></a></div><div className="about-relationships"><p><strong>Direct</strong>A clear relationship to the OICC condition.</p><p><strong>Supporting</strong>Material that helps implement or understand the condition.</p><p><strong>Contextual</strong>Related background that informs the condition.</p><small>These relationship classifications are OSI interpretations. They are not created or approved by the external issuing organization.</small></div></div></section>
    <section className="about-oicc about-section" aria-labelledby="oicc-status-heading"><div className="about-label">OICC status and governance</div><div className="about-two"><div><span className="about-status">OICC v1.0 / Foundational Draft</span><h2 id="oicc-status-heading">OSI-developed guidance.</h2></div><div><p>OICC organizes output-security responsibilities into eight connected control domains. It is not presented as an industry, consensus, government, regulatory, or certification framework.</p><p>Its content may evolve as OSI analysis, evidence, and authoritative external material develop.</p><a className="text-link dark-link" href="/oicc">Examine the OICC framework <ArrowRight size={17}/></a></div></div></section>
    <section className="about-revisions about-section" aria-labelledby="revisions-heading"><div className="about-label">Corrections and revisions</div><div className="about-two"><div><h2 id="revisions-heading">Material changes should become traceable.</h2><p>OSI intends to correct material when a factual error is identified, a source changes materially or is superseded, a mapping requires revision, or an OSI interpretation is materially clarified.</p></div><div><div className="about-version-pattern"><span>Version</span><span>Status</span><span>Publication date</span><span>Last reviewed</span><span>Revision history</span><span>Correction notice</span></div><p>Where practical, substantive changes to versioned OSI resources should be recorded through this publication pattern. No historical correction log is implied.</p></div></div></section>
    <section className="about-limitations about-section" aria-labelledby="limitations-heading"><div className="about-label">Limitations</div><div className="about-two"><h2 id="limitations-heading">Authoritative material remains primary.</h2><div><p>Output-security conditions vary by organization and environment. OSI guidance is educational, and OSI analysis may evolve.</p><p>Organizations remain responsible for determining the legal, regulatory, contractual, and security requirements that apply to them.</p></div></div></section>
    <section className="about-contact about-section" aria-labelledby="contact-heading"><div><div className="about-label">Corrections and contribution</div><h2 id="contact-heading">Question the interpretation.<br/><em>Strengthen the record.</em></h2></div><div><p>Report a factual error, question an OSI interpretation, identify a source update, or suggest relevant authoritative material.</p><div className="about-actions"><a className="button primary" href="mailto:info@outputsecurityinstitute.org?subject=OSI correction or source update">Report a correction or source update <ArrowRight size={18}/></a><a className="text-link" href="mailto:info@outputsecurityinstitute.org?subject=Contribute to the OSI discussion">Contribute to the discussion <ArrowRight size={17}/></a></div></div></section>
  </main><SiteFooter/></div>
}

function OiccPage(){
  useEffect(()=>{
    document.title='OICC Framework | Output Security Institute'
    const meta=document.querySelector('meta[name="description"]')
    if(meta) meta.setAttribute('content','OICC is a practical, manufacturer-neutral control framework for governing output systems, physical information, service access, evidence, and lifecycle risk.')
  },[])
  return <div className="oicc-page" id="top"><Header/><main>
    <section className="oicc-hero">
      <div className="oicc-kicker">Operational Infrastructure Critical Controls</div>
      <div className="oicc-hero-grid"><div><h1>OICC</h1><p className="oicc-lede">A practical control framework for output security.</p></div><div className="oicc-version"><span>OICC v1.0</span><strong>Foundational draft</strong><p>Independent, manufacturer-neutral guidance for examining output systems as connected infrastructure and as a physical information boundary.</p></div></div>
    </section>

    <nav className="oicc-anchor-nav" aria-label="OICC page sections"><a href="#logic">Control logic</a><a href="#framework-index">Eight domains</a><a href="#standards-relationship">Standards relationship</a><a href="#evidence">Evidence</a><a href="#version">Version</a></nav>

    <section className="oicc-logic oicc-section" id="logic">
      <div className="oicc-section-label">How to use OICC</div>
      <div className="oicc-logic-line" aria-label="Understand, assign, control, evidence"><span><b>01</b>Understand</span><i aria-hidden="true">→</i><span><b>02</b>Assign</span><i aria-hidden="true">→</i><span><b>03</b>Control</span><i aria-hidden="true">→</i><span><b>04</b>Evidence</span></div>
      <p className="oicc-logic-copy">Understand the information, systems, pathways, and consequences. Assign accountable owners. Apply controls suited to the environment. Preserve evidence that the controls exist and operate.</p>
    </section>

    <section className="oicc-bridge oicc-section">
      <div><div className="oicc-section-label">One continuous responsibility</div><h2>The lifecycle describes the journey.<br/><em>OICC organizes the controls.</em></h2></div>
      <ol aria-label="Document lifecycle">{['Created','Sent','Processed','Released','Used','Retained','Destroyed'].map((stage,i)=><li key={stage}><span>{String(i+1).padStart(2,'0')}</span>{stage}</li>)}</ol>
    </section>

    <section className="oicc-index oicc-section" id="framework-index">
      <div className="oicc-section-label">Framework index</div><div className="oicc-index-head"><h2>Eight domains.<br/><em>One control system.</em></h2><p>The domains are designed to be examined together. Each section states a purpose, practical assessment questions, examples of evidence, and its relevance to the information lifecycle.</p></div>
      <div className="oicc-index-list">{oiccDomains.map(d=><a key={d.n} href={`#${d.id}`}><span>{d.n}</span><strong>{d.title}</strong><ArrowRight size={18}/></a>)}</div>
    </section>

    <section className="oicc-domains" aria-label="OICC control domains">
      {oiccDomains.map(d=><article className="oicc-domain oicc-section" id={d.id} key={d.n}>
        <header><span>{d.n}</span><div><p>Control domain</p><h2>{d.title}</h2></div><a href="#framework-index">Index ↑</a></header>
        <p className="oicc-purpose"><strong>Purpose</strong>{d.purpose}</p>
        <div className="oicc-domain-grid"><section><h3>Assessment questions</h3><ol>{d.questions.map((q,i)=><li key={q}><span>{String(i+1).padStart(2,'0')}</span><p>{q}</p></li>)}</ol></section><section><h3>Evidence examples</h3><ul>{d.evidence.map(e=><li key={e}>{e}</li>)}</ul></section></div>
        <aside><strong>Lifecycle relevance</strong><p>{d.lifecycle}</p></aside>
      </article>)}
    </section>

    <section className="oicc-standards oicc-section" id="standards-relationship">
      <div className="oicc-section-label">Standards relationship</div><div className="oicc-standards-grid"><div><h2>Built to support interpretation—not replace authority.</h2><p>OICC helps teams apply established security principles to output devices, print infrastructure, document workflows, service pathways, and physical information.</p><strong>OSI does not create regulatory requirements or certify compliance.</strong></div><div>{mappings.map(([name,text],i)=><article key={name}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{name}</h3><p>{text}</p></div></article>)}</div></div>
    </section>

    <section className="oicc-evidence oicc-section" id="evidence"><div className="oicc-section-label">Evidence philosophy</div><div><h2>A control statement is a beginning.<br/><em>Evidence makes it examinable.</em></h2><p>OICC emphasizes evidence an organization can inspect: ownership records, approved configurations, access decisions, inventories, event logs, service records, tests, exceptions, and verified disposition. The appropriate evidence depends on the environment, risk, and applicable authority.</p></div></section>

    <section className="oicc-versioning oicc-section" id="version"><div><div className="oicc-section-label">Version architecture</div><h2>Foundational draft</h2></div><div><p>OICC v1.0 establishes the framework’s eight-domain structure. Future revisions can clarify language, add implementation guidance, and document change without silently altering the framework’s meaning.</p><p>The framework is manufacturer-neutral. Technology examples may inform assessment, but no domain depends on one manufacturer, product, or service model.</p><a className="button primary" href="mailto:info@outputsecurityinstitute.org?subject=OICC foundational draft feedback">Contribute informed feedback <ArrowRight size={18}/></a></div></section>
  </main><SiteFooter/></div>
}

function StandardsPage(){
  const domainAnchors={
    'Governance & Ownership':'governance-ownership','Identity & Access':'identity-access','Secure Configuration':'secure-configuration','Data Protection':'data-protection','Visibility & Evidence':'visibility-evidence','Service & Supply Chain':'service-supply-chain','Recovery & Continuity':'recovery-continuity','Lifecycle Assurance':'lifecycle-assurance'
  }
  const [query,setQuery]=useState('')
  const [domain,setDomain]=useState('All')
  const [relationship,setRelationship]=useState('All')
  useEffect(()=>{
    document.title='Standards Crosswalk | Output Security Institute'
    const meta=document.querySelector('meta[name="description"]')
    if(meta) meta.setAttribute('content','The OSI Standards Crosswalk connects verified NIST CSF 2.0 cybersecurity outcomes to relevant OICC output-security domains without implying endorsement or compliance equivalence.')
  },[])
  const domains=[...new Set(crosswalkRecords.map(x=>x.domain))]
  const relationships=[...new Set(crosswalkRecords.map(x=>x.relationship))]
  const search=query.trim().toLowerCase()
  const visible=crosswalkRecords.filter(x=>(domain==='All'||x.domain===domain)&&(relationship==='All'||x.relationship===relationship)&&(!search||[x.id,x.title,x.domain,x.relationship,x.rationale,crosswalkSource.framework].join(' ').toLowerCase().includes(search)))
  const active=query||domain!=='All'||relationship!=='All'
  const clear=()=>{setQuery('');setDomain('All');setRelationship('All')}
  return <div className="standards-page"><Header/><main>
    <section className="sp-hero"><a href="/" className="kc-back"><ArrowLeft size={15}/> Output Security Institute</a><div className="sp-kicker">OSI Standards Crosswalk</div><h1>Connecting output security to established security principles.</h1><div className="sp-hero-grid"><p>This crosswalk helps organizations examine OICC alongside established security frameworks and authoritative guidance. It asks which established principles inform each OICC domain and why the relationship matters to output systems.</p><div><strong>Mapping is interpretation, not endorsement.</strong><p>OSI mappings identify relationships that OSI considers relevant to output security. They do not indicate that an issuing organization references, approves, or endorses OICC. OSI does not create regulatory requirements or certify compliance.</p></div></div></section>
    <section className="sp-method"><div className="sp-label">Crosswalk methodology</div><h2>Authority first. Interpretation made inspectable.</h2><div className="sp-flow">{[
      ['Source','Start with authoritative framework language.'],['Condition','Identify the security condition addressed.'],['OICC relevance','Locate the related output-security concern.'],['Relationship','Classify it as Direct, Supporting, or Contextual.'],['Evidence','Retain the authoritative source reference.']
    ].map(([title,text],i)=><div key={title}><span>{String(i+1).padStart(2,'0')}</span><strong>{title}</strong><p>{text}</p></div>)}</div></section>
    <section className="sp-index"><div className="sp-index-head"><div><div className="sp-label">Verified mapping index</div><h2>A small crosswalk with a defensible source basis.</h2></div><p>The initial release uses only exact NIST CSF 2.0 outcomes verified against the authoritative publication. Detailed mappings for additional frameworks are deferred until their source language is examined to the same standard.</p></div>
      <div className="sp-toolbar"><label className="sp-search"><span>Search mappings</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Identifier, concept, domain, or rationale"/></label><div className="sp-filters"><label><span>OICC domain</span><select value={domain} onChange={e=>setDomain(e.target.value)}><option>All</option>{domains.map(x=><option key={x}>{x}</option>)}</select></label><label><span>Relationship</span><select value={relationship} onChange={e=>setRelationship(e.target.value)}><option>All</option>{relationships.map(x=><option key={x}>{x}</option>)}</select></label></div></div>
      <div className="sp-count"><span>{String(visible.length).padStart(2,'0')} verified mappings</span>{active&&<button type="button" onClick={clear}>Clear search and filters</button>}</div>
      {visible.length?<div className="sp-records">{visible.map(x=><article className="sp-record" key={x.id}><div className="sp-source"><span>External source</span><b>{crosswalkSource.short}</b><span>{x.id}</span></div><div className="sp-concept"><span>External concept</span><h3>{x.title}</h3><div className="sp-rationale"><strong>OSI rationale</strong><p>{x.rationale}</p></div></div><div className="sp-map"><span>{x.relationship} relationship</span><a href={`/oicc#${domainAnchors[x.domain]}`}>{x.domain}</a><a href={crosswalkSource.knowledgeUrl}>View in Knowledge Center</a><a href={crosswalkSource.sourceUrl} target="_blank" rel="noreferrer" aria-label={`View original NIST source for ${x.id} (opens in a new tab)`}>View original source <ExternalLink size={15}/></a><small>Relationship classification and rationale are OSI interpretation. Direct does not mean equivalent or compliant.</small></div></article>)}</div>:<div className="sp-empty"><h3>No verified mappings match.</h3><p>No result in this index does not mean no relationship exists.</p><button type="button" onClick={clear}>Clear search and filters</button></div>}
    </section>
    <section className="sp-note"><div><div className="sp-label">Research transparency</div><h2>Source language remains primary.</h2></div><div><p>Mappings are developed by OSI and may change when external frameworks are revised or OSI analysis is updated. Users should consult the authoritative source for requirements and official guidance.</p><p>NIST SP 800-53 Rev. 5, NIST SP 800-171 Rev. 3, NIST SP 800-53A Rev. 5, and CISA Zero Trust mappings are not included in this initial set because detailed identifiers and relationships have not yet been verified to the same record-level standard.</p></div></section>
  </main><SiteFooter/></div>
}

function App() {
  if(window.location.pathname.startsWith('/about')) return <AboutPage/>
  if(window.location.pathname.startsWith('/standards')) return <StandardsPage/>
  if(window.location.pathname.startsWith('/oicc')) return <OiccPage/>
  if(window.location.pathname.startsWith('/knowledge')) return <KnowledgeCenterPage/>
  if(window.location.pathname.startsWith('/briefings')) return <BriefingsPage/>
  return <div id="top">
    <Header />
    <main>
      <section className="hero">
        <a className="latest-brief-link" href="/briefings"><span>Latest Security Brief</span><span aria-hidden="true">/</span><span>September 3, 2026</span></a>
        <div className="hero-layout">
          <div className="hero-editorial">
            <div className="eyebrow"><span></span> Output security / the digital–physical boundary</div>
            <h1>Security doesn't end at the screen.</h1>
            <p className="hero-principle"><span>The central idea</span><strong>The information does not become less sensitive when it leaves the screen.</strong></p>
            <p className="hero-copy">OSI provides independent, manufacturer-neutral guidance for systems that create, move, and manage physical information.</p>
            <div className="hero-actions">
              <a className="button primary" href="#why">Understand the risk</a>
              <a className="text-link" href="/oicc">Explore OICC <ArrowRight size={18}/></a>
            </div>
            <p className="trust-line">Independent <span aria-hidden="true">•</span> Manufacturer-neutral <span aria-hidden="true">•</span> Standards-informed</p>
          </div>
          <figure className="boundary-diagram" aria-labelledby="boundary-title">
            <figcaption id="boundary-title">The OSI digital-to-physical boundary</figcaption>
            <div className="boundary-stage boundary-digital"><strong>Digital</strong><small>Technical environment</small></div>
            <span className="boundary-arrow" aria-hidden="true">↓</span>
            <div className="boundary-stage boundary-system"><strong>Output system</strong><small>The transition boundary</small></div>
            <span className="boundary-arrow" aria-hidden="true">↓</span>
            <div className="boundary-stage boundary-physical"><strong>Physical</strong><small>Information in tangible form</small></div>
            <span className="boundary-arrow" aria-hidden="true">↓</span>
            <div className="boundary-stage boundary-custody"><strong>Custody</strong><small>Human and organizational control</small></div>
          </figure>
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
        <div className="change-sequence" aria-label="Then, now, and still">
          <article><span>THEN</span><div><h3>A largely mechanical device</h3><p>Its visible purpose was straightforward: receive a document and place it on paper.</p></div></article>
          <article><span>NOW</span><div><h3>A connected endpoint</h3><p>It exchanges information with users, systems, networks, applications, administrators, and support providers.</p></div></article>
          <article><span>STILL</span><div><h3>A physical information boundary</h3><p>Digital controls meet human custody when information becomes paper or is scanned into another destination.</p></div></article>
        </div>
      </section>

      <section className="lifecycle section" id="lifecycle">
        <div className="section-number">02 / FOLLOW ONE DOCUMENT</div>
        <div className="lifecycle-intro"><h2>One ordinary action creates a <em>complete lifecycle.</em></h2><p>Consider a customer record, medical document, financial report, student file, legal matter, or piece of intellectual property. Its sensitivity continues through every step.</p></div>
        <div className="lifecycle-model">
          <div className="lifecycle-zones" aria-hidden="true">
            <span>Digital environment</span><span>Transition</span><span>Physical custody</span>
          </div>
          <ol className="journey" aria-label="The lifecycle of a printed document">
            {[
              ['Created','Who created it, and what information does it contain?'],
              ['Sent','Where does it travel, and which systems can reach it?'],
              ['Processed','Does the device store, log, route, or reproduce it?'],
              ['Released','Who is permitted to retrieve the physical output?'],
              ['Used','Who sees, carries, copies, or shares the document?'],
              ['Retained','Where is it stored, and how long should it remain?'],
              ['Destroyed','Can the organization verify its final disposition?']
            ].map(([title,text],i)=><li key={title} className={`lifecycle-stage lifecycle-stage-${i+1}`}><article><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article></li>)}
          </ol>
          <div className="lifecycle-boundary" aria-hidden="true"><span>Digital → physical boundary</span></div>
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
          <a className="path act" href="/oicc"><small>ACT</small><ShieldCheck/><h3>What should we put in place?</h3><p>Explore the OICC controls, authoritative standards, implementation guidance, and evidence expectations.</p><span>Use the controls <ArrowRight size={16}/></span></a>
        </div>
        <aside className="ask-osi"><div><strong>Not sure where to begin?</strong><p>Describe the condition you are trying to understand. You do not need to know the terminology.</p></div><a href="mailto:info@outputsecurityinstitute.org?subject=Help me begin with output security">Ask OSI a question <ArrowRight size={17}/></a></aside>
      </section>

      <section className="weekly-brief section" id="weekly-brief">
        <div className="section-number">05 / WEEKLY SECURITY BRIEF</div>
        <div className="weekly-grid">
          <div className="weekly-copy"><div className="weekly-date"><CalendarDays size={17}/> September 3, 2026</div><h2>What changed.<br/><em>Why it matters.</em></h2><p>OSI reviews authoritative sources for developments affecting output systems, physical information, security, compliance, and continuity. Each brief separates confirmed facts from OSI interpretation and records when no material development was found.</p><a className="button primary" href="/briefings">Read the September 3 update <ArrowRight size={18}/></a></div>
          <div className="weekly-list"><span>LATEST BRIEF / 1 URGENT DEVELOPMENT</span>{september3Brief.map((item,i)=><a href="/briefings" key={item.title}><b>{String(i+1).padStart(2,'0')}</b><p>{item.title}</p><ArrowRight size={16}/></a>)}</div>
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
            return <article key={c.n} className="control-card"><span>{c.n}</span><ControlIcon size={25}/><h3>{c.title}</h3><p>{c.text}</p><a href={`/oicc#${oiccDomains[i].id}`} aria-label={`Learn about ${c.title}`}>View control objective <ArrowRight size={15}/></a></article>
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
        <div className="about-grid"><h2>An independent initiative for a boundary that deserves clearer governance.</h2><div><p>The Output Security Institute develops practical, manufacturer-neutral guidance for the security, integrity, and continuity of systems that create, move, and manage physical information.</p><p>OSI is an independent educational initiative. It is not affiliated with or endorsed by NIST, and it does not certify products, organizations, or regulatory compliance.</p><a className="text-link dark-link" href="/about">About OSI and its methodology <ArrowRight size={17}/></a></div></div>
      </section>
    </main>
    <footer><div className="brand footer-brand"><span className="brand-mark"><span>O</span><span>S</span><span>I</span></span><span><strong>Output Security</strong><em>Institute</em></span></div><p>Security beyond the screen.</p><div><a href="/oicc">OICC Framework</a><a href="/standards">Standards</a><a href="/about">Transparency</a></div><small>© {new Date().getFullYear()} Output Security Institute. Educational guidance only.</small></footer>
  </div>
}

export default App
