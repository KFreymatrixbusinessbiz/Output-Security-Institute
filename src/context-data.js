export const contextDomains = {
  governance: { name: 'Governance & Ownership', anchor: 'governance-ownership' },
  identity: { name: 'Identity & Access', anchor: 'identity-access' },
  configuration: { name: 'Secure Configuration', anchor: 'secure-configuration' },
  protection: { name: 'Data Protection', anchor: 'data-protection' },
  evidence: { name: 'Visibility & Evidence', anchor: 'visibility-evidence' },
  service: { name: 'Service & Supply Chain', anchor: 'service-supply-chain' },
  recovery: { name: 'Recovery & Continuity', anchor: 'recovery-continuity' },
  lifecycle: { name: 'Lifecycle Assurance', anchor: 'lifecycle-assurance' }
}

const lifecycle = (created, sent, processed, released, used, retained, destroyed) => ([
  ['Created', created], ['Sent', sent], ['Processed', processed], ['Released', released],
  ['Used', used], ['Retained', retained], ['Destroyed', destroyed]
])

export const operationalContexts = [
  {
    slug: 'healthcare',
    name: 'Healthcare',
    question: 'How does physical release change when documents move between clinical, administrative, and shared work areas?',
    preview: ['Distributed workflows', 'Shared output locations', 'Availability during disruption'],
    context: 'Healthcare environments may combine clinical and administrative work, distributed users, shared devices, urgent output needs, and information that remains sensitive after it becomes physical. The operating question is not simply whether a device is secure, but how information moves through people, systems, locations, and custody.',
    information: ['Clinical and care-related documents', 'Patient-facing forms and instructions', 'Administrative and financial records', 'Scheduling and operational material', 'Scans, faxes, and routed documents'],
    boundary: [
      ['Digital', 'Information may begin in clinical, administrative, scheduling, or document-management systems.'],
      ['Output system', 'Queues, servers, devices, address books, scan routes, and release functions may process or retain it.'],
      ['Physical', 'Output may appear in shared work areas, care settings, administrative offices, or public-facing locations.'],
      ['Custody', 'Staff, patients, caregivers, couriers, and records personnel may each handle the same information at different stages.']
    ],
    conditions: ['Release at shared or distributed devices', 'Unattended output in active work areas', 'Scanning, faxing, and destination selection', 'Storage in devices or supporting servers', 'Service access to systems that process sensitive information', 'Continuity when a normal output path is unavailable', 'Reassignment, return, and disposal of equipment'],
    lifecycle: lifecycle('Who initiates the document, and from which system?', 'Which queues, routes, or destinations carry it?', 'What do the server and device retain while handling it?', 'How is the intended recipient distinguished at a shared location?', 'Who may view, carry, copy, or return the physical document?', 'Where does the document enter an approved record or holding process?', 'How is final disposition performed and evidenced?'),
    domains: ['governance', 'identity', 'protection', 'evidence', 'service', 'recovery', 'lifecycle'],
    questions: ['Who owns the complete print, scan, and fax workflow across clinical and administrative teams?', 'Which identities can change destinations, address books, release settings, or stored-job behavior?', 'What information remains on the device or print-management server after a job completes?', 'How is output release handled when the intended recipient is not at the device?', 'Which service parties can reach systems that process or route healthcare information?', 'What is the documented alternative when an essential output or scanning path is unavailable?', 'How is equipment cleared and verified before reassignment, return, or disposal?'],
    related: []
  },
  {
    slug: 'government-defense',
    name: 'Government & Defense',
    question: 'How are authorization, accountability, and service access maintained across distributed facilities and differing information categories?',
    preview: ['Authorization boundaries', 'Configuration accountability', 'Service and supply dependencies'],
    context: 'Government and defense environments can include distributed facilities, shared infrastructure, formal authorization practices, acquisition constraints, and continuity expectations. Information categories and applicable obligations differ by organization and mission; government information, controlled unclassified information, and classified information are not interchangeable.',
    information: ['Administrative and operational documents', 'Acquisition and contract material', 'Mission-support information', 'Personnel and financial records', 'Information subject to organization-specific handling decisions'],
    boundary: [
      ['Digital', 'Information may originate in systems with different authorization, network, and handling conditions.'],
      ['Output system', 'Devices, servers, credentials, firmware, configurations, and service pathways become part of the examined environment.'],
      ['Physical', 'Output may be produced at headquarters, field offices, shared facilities, remote sites, or mission-support locations.'],
      ['Custody', 'Authorized users, records personnel, facility staff, service personnel, and supply-chain parties may affect control.']
    ],
    conditions: ['Identity and authorization across shared infrastructure', 'Configuration baselines and change accountability', 'Controlled physical release', 'Remote and on-site service pathways', 'Firmware, component, and supply provenance', 'Evidence of administrative and lifecycle events', 'Recovery across distributed or constrained locations'],
    lifecycle: lifecycle('What information category and handling decision applies at creation?', 'Which networks, servers, and transfer paths carry the job?', 'Which device functions, storage, and services participate?', 'How is release limited to the intended authorized user?', 'How does physical handling remain consistent with the organization’s decision?', 'Where and under whose authority is output retained?', 'How is disposition verified across equipment and paper?'),
    domains: ['governance', 'identity', 'configuration', 'protection', 'evidence', 'service', 'recovery', 'lifecycle'],
    questions: ['Who determines which output systems are appropriate for each information category?', 'Which identities can administer devices, print servers, release systems, and service tools?', 'What approved configuration is expected, and what evidence exists when it changes?', 'Can monitoring occur without creating persistent privileged service access?', 'How are firmware, replacement components, and administrative tools obtained and validated?', 'What event records can be exported for organizational review?', 'What operating path remains when normal network or service support is unavailable?'],
    related: ['nist-sp-800-53-rev-5', 'nist-sp-800-53a-rev-5', 'nist-sp-800-171-rev-3', 'zero-trust-maturity-model-v2']
  },
  {
    slug: 'financial-services',
    name: 'Financial Services',
    question: 'How does an organization preserve control when customer and transaction documents move through branches, offices, and service platforms?',
    preview: ['Distributed locations', 'Customer-document custody', 'Transaction workflow continuity'],
    context: 'Financial-service operations may distribute output across branches, offices, operations centers, and customer-facing workflows. The same document can pass through transaction systems, print infrastructure, employees, customers, storage, and destruction processes. Applicable legal and regulatory obligations must be determined separately by the organization.',
    information: ['Customer records and correspondence', 'Statements, reports, and notices', 'Transaction-related documentation', 'Internal financial and operational records', 'Scanned forms and supporting material'],
    boundary: [
      ['Digital', 'Customer, transaction, reporting, and administrative systems may initiate or receive information.'],
      ['Output system', 'Print servers, multifunction devices, release controls, scan routes, and service platforms may process metadata or content.'],
      ['Physical', 'Documents may emerge in employee work areas, customer-facing locations, operations centers, or remote offices.'],
      ['Custody', 'Employees, customers, operations teams, couriers, records staff, and disposal providers may handle physical output.']
    ],
    conditions: ['Release in customer-facing or shared locations', 'Distributed administrative ownership', 'Scan destinations and transaction workflows', 'Access by service providers and monitoring platforms', 'Evidence of configuration or administrative changes', 'Retention and destruction handoffs', 'Continuity of essential customer-document functions'],
    lifecycle: lifecycle('Which system and role initiate the customer or transaction document?', 'Where do print, scan, or delivery instructions travel?', 'What job data, credentials, or content remain in supporting systems?', 'How is the correct recipient confirmed at release?', 'What prevents documents from being mixed, abandoned, or misdirected?', 'Who controls storage and retrieval after use?', 'How is destruction or other final disposition verified?'),
    domains: ['governance', 'identity', 'configuration', 'protection', 'evidence', 'service', 'recovery', 'lifecycle'],
    questions: ['Who owns an output workflow when it crosses branch operations, IT, records, and a service provider?', 'Which roles can view job history, change scan destinations, or administer release settings?', 'What document or user metadata is available through fleet-monitoring and print-management platforms?', 'How is physical release handled in customer-facing locations?', 'What evidence exists when a configuration, destination, or administrator changes?', 'Which third parties can access devices or associated systems, and for what purpose?', 'What is the operating alternative during print-server, network, or device disruption?'],
    related: []
  },
  {
    slug: 'education',
    name: 'Education',
    question: 'How is responsibility maintained across shared devices, varied users, distributed campuses, and decentralized administration?',
    preview: ['Shared user populations', 'Distributed administration', 'Academic and operational workflows'],
    context: 'Education environments may combine public-facing spaces, classrooms, administrative offices, research areas, shared devices, and distributed campuses. Students, faculty, staff, guests, and service personnel may interact with different parts of the output environment. Legal obligations vary by institution and are not determined by this page.',
    information: ['Student and administrative records', 'Testing and examination material', 'Financial and enrollment documents', 'Teaching and research content', 'Public-facing forms and communications'],
    boundary: [
      ['Digital', 'Learning, administrative, research, and records systems may originate or receive information.'],
      ['Output system', 'Shared queues, departmental devices, release systems, scan destinations, and local settings shape access.'],
      ['Physical', 'Output may appear in libraries, labs, classrooms, departments, residence areas, or public service locations.'],
      ['Custody', 'Students, faculty, staff, visitors, records teams, and service providers may encounter physical information.']
    ],
    conditions: ['Open or shared device locations', 'Decentralized ownership and administration', 'High-turnover or changing user populations', 'Testing and examination workflows', 'Research and intellectual-property handling', 'Department-specific scan routes and address books', 'Lifecycle transitions during moves, refreshes, and surplus'],
    lifecycle: lifecycle('Which person, department, or system creates the material?', 'Does it move through central or departmental infrastructure?', 'Which shared services or local devices process and retain it?', 'How is output associated with the correct user in a shared location?', 'What happens when material is left, collected, or redistributed?', 'Which department owns retention after physical use?', 'How is paper and device data handled during disposal or surplus?'),
    domains: ['governance', 'identity', 'configuration', 'protection', 'evidence', 'service', 'recovery', 'lifecycle'],
    questions: ['Who owns shared devices located outside centrally administered areas?', 'Which user populations can print, scan, retrieve, or administer at each location?', 'How are departmental scan destinations and address books reviewed?', 'What conditions protect examination or research material before intended release?', 'What information can local administrators or service providers retrieve?', 'How are devices handled when departments relocate, equipment is surplused, or responsibility changes?', 'What output functions must remain available during registration, testing, or other concentrated operating periods?'],
    related: []
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    question: 'What changes when output infrastructure supports production work, engineering information, and physically distributed operations?',
    preview: ['Production-area devices', 'Engineering-document integrity', 'Operational continuity'],
    context: 'Manufacturing output may support offices, engineering teams, production areas, quality processes, warehousing, and shipping. Some output infrastructure operates near operational technology or supports operational workflows; that proximity does not automatically make every device an OT system. The relationship should be defined from the actual architecture and use.',
    information: ['Engineering drawings and specifications', 'Production instructions and work orders', 'Quality and inspection records', 'Labels and identification material', 'Shipping, receiving, and inventory documents'],
    boundary: [
      ['Digital', 'Engineering, production, quality, enterprise, and logistics systems may initiate information.'],
      ['Output system', 'Printers, label systems, queues, templates, firmware, and integrations may affect content and availability.'],
      ['Physical', 'Output may appear on production floors, at work cells, in quality areas, warehouses, docks, or engineering offices.'],
      ['Custody', 'Operators, engineers, quality personnel, warehouse teams, supervisors, contractors, and service parties may handle it.']
    ],
    conditions: ['Document and label integrity at the point of use', 'Shared devices in production areas', 'Adjacency to segmented or operational environments', 'Template, firmware, and configuration changes', 'Remote or on-site service access', 'Availability during production disruption', 'Replacement-device and supply-chain dependencies'],
    lifecycle: lifecycle('Which approved system or person creates the instruction, drawing, or label?', 'How does information cross enterprise, production, or segmented environments?', 'Which templates, queues, integrations, and devices transform it?', 'How is the correct revision released at the correct location?', 'How is obsolete or damaged output removed from use?', 'Where are completed records or controlled copies retained?', 'How are superseded documents, labels, and device data disposed of?'),
    domains: ['governance', 'identity', 'configuration', 'protection', 'evidence', 'service', 'recovery', 'lifecycle'],
    questions: ['Who owns the integrity of the document or label from source system through physical use?', 'Which systems can alter templates, queues, destinations, or device configuration?', 'Where does output infrastructure cross or connect with segmented production environments?', 'How is the current approved revision distinguished from obsolete physical output?', 'Can a service pathway reach beyond the specific device or function being supported?', 'What evidence exists after a firmware, template, or administrative change?', 'What happens to production when the normal output path, component, or supplier is unavailable?'],
    related: ['zero-trust-operational-technology']
  },
  {
    slug: 'legal-professional',
    name: 'Legal & Professional',
    question: 'How is client and matter information controlled as work moves between offices, remote users, shared output, and physical files?',
    preview: ['Matter-document custody', 'Hybrid work', 'Third-party service access'],
    context: 'Legal and professional-service environments may combine client work, internal administration, shared offices, remote or hybrid workflows, physical files, and outside service relationships. Privilege, professional duties, and retention obligations depend on facts and jurisdiction and are not determined by this page.',
    information: ['Client and matter-related documents', 'Contracts, drafts, and correspondence', 'Financial and billing material', 'Research and work product', 'Scanned records and physical-file material'],
    boundary: [
      ['Digital', 'Matter, document-management, email, financial, and collaboration systems may contain or initiate information.'],
      ['Output system', 'Queues, shared devices, home-office equipment, scan routes, and service tools may process or retain it.'],
      ['Physical', 'Documents may emerge in shared offices, conference areas, records rooms, remote work locations, or client-facing spaces.'],
      ['Custody', 'Professionals, staff, clients, records teams, couriers, remote users, and service providers may handle the information.']
    ],
    conditions: ['Shared output across teams or matters', 'Remote and hybrid print or scan workflows', 'Destination and address-book control', 'Physical file assembly and handoff', 'Administrative and service access', 'Retention and destruction decisions', 'Device return or replacement in remote locations'],
    lifecycle: lifecycle('Which client, matter, or business process creates the document?', 'Which office, remote, cloud, or email path carries it?', 'What do shared devices, local devices, or supporting services retain?', 'How is output associated with the intended person or matter?', 'Where can copies travel after meetings, review, or client delivery?', 'Who determines the appropriate file or record location?', 'How is final disposition verified for paper and device-stored information?'),
    domains: ['governance', 'identity', 'configuration', 'protection', 'evidence', 'service', 'recovery', 'lifecycle'],
    questions: ['Who owns output security when a workflow moves between office and remote locations?', 'How are users, matters, destinations, and shared devices separated where appropriate?', 'What information remains in home-office or shared-device storage and job history?', 'How are scan destinations and address books reviewed for accuracy?', 'Which third parties can administer devices or retrieve diagnostic information?', 'How are physical documents transferred into files, delivered to clients, or returned after use?', 'How are devices and stored information handled when personnel, offices, or service providers change?'],
    related: []
  }
]

export const getOperationalContext = slug => operationalContexts.find(item => item.slug === slug)
