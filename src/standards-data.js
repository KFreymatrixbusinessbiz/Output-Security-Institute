export const crosswalkRecords = [
  {id:'GV.RR-02',title:'Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced',domain:'Governance & Ownership',relationship:'Direct',rationale:'Output environments require named accountability across devices, servers, workflows, service access, records, and physical custody.',sourceSlug:'nist-cybersecurity-framework-2'},
  {id:'PR.AA-05',title:'Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties',domain:'Identity & Access',relationship:'Direct',rationale:'The same condition applies to users, administrators, applications, release functions, and service identities within an output system.',sourceSlug:'nist-cybersecurity-framework-2'},
  {id:'PR.PS-01',title:'Configuration management practices are established and applied',domain:'Secure Configuration',relationship:'Direct',rationale:'Output endpoints and supporting platforms need approved baselines for firmware, protocols, certificates, storage, logging, and administrative settings.',sourceSlug:'nist-cybersecurity-framework-2'},
  {id:'PR.DS-01',title:'The confidentiality, integrity, and availability of data-at-rest are protected',domain:'Data Protection',relationship:'Direct',rationale:'Print jobs, scans, address books, logs, credentials, and temporary files may persist across output infrastructure and require protection.',sourceSlug:'nist-cybersecurity-framework-2'},
  {id:'DE.CM-09',title:'Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events',domain:'Visibility & Evidence',relationship:'Direct',rationale:'Output systems need inspectable device, server, administrative, job, and service evidence to identify and reconstruct adverse activity.',sourceSlug:'nist-cybersecurity-framework-2'},
  {id:'GV.SC-07',title:'The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored over the course of the relationship',domain:'Service & Supply Chain',relationship:'Direct',rationale:'Manufacturers, dealers, cloud services, firmware sources, remote tools, technicians, and replacement components can materially affect output-system risk.',sourceSlug:'nist-cybersecurity-framework-2'},
  {id:'RC.RP-02',title:'Recovery actions are selected, scoped, prioritized, and performed',domain:'Recovery & Continuity',relationship:'Supporting',rationale:'Recovery planning informs restoration priorities, secure alternatives, known-good configurations, and continuity for essential output functions.',sourceSlug:'nist-cybersecurity-framework-2'},
  {id:'ID.RA-09',title:'The authenticity and integrity of hardware and software are assessed prior to acquisition and use',domain:'Lifecycle Assurance',relationship:'Supporting',rationale:'Lifecycle assurance begins before deployment by examining product integrity, firmware provenance, support expectations, and acquisition risk.',sourceSlug:'nist-cybersecurity-framework-2'}
]

export const crosswalkSource = {
  framework:'NIST Cybersecurity Framework 2.0',
  short:'NIST CSF 2.0',
  sourceUrl:'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf',
  knowledgeUrl:'/knowledge/nist-cybersecurity-framework-2',
  reviewed:'September 3, 2026'
}
