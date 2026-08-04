# Output Security Evidence Collection Matrix

Output Security Institute | Working document

Evidence should establish more than policy intent. Use examination, interview, and testing together to determine whether the implemented system behaves as expected.

## Collection information

- Organization:
- System or environment:
- Evidence period:
- Collector:
- Custodian:
- Storage location:
- Protection and access requirements:

## Evidence matrix

| Control area | Examine | Interview | Test | Owner | Frequency | Result or location |
|---|---|---|---|---|---|---|
| OICC-01 Governance | Policy scope, ownership records, risk decisions | System owner, information owner, risk authority | Trace an exception from request through approval | | | |
| OICC-02 Inventory | Asset inventory, diagrams, classification | Asset owner, network owner, operations | Reconcile a sample of deployed systems to inventory | | | |
| OICC-03 Access | Accounts, roles, access reviews | Identity owner, administrators, service owner | Attempt authorized and unauthorized administrative paths | | | |
| OICC-04 Configuration | Baseline, exports, change records | Configuration owner, change authority | Compare deployed settings with approved baseline | | | |
| OICC-05 Data and custody | Data flows, release settings, sanitization records | Privacy, records, operations | Test release, retention, deletion, and physical custody | | | |
| OICC-06 Interfaces | Network diagram, rules, enabled services | Network and security owners | Validate ports, protocols, segmentation, and outbound paths | | | |
| OICC-07 Vulnerabilities | Version list, advisories, update records | Vulnerability and change owners | Verify a sample version and update decision | | | |
| OICC-08 Logging | Event configuration, sample logs, retention | Monitoring and investigation owners | Generate events and confirm attribution, time, export, and alerting | | | |
| OICC-09 Third parties | Contracts, access records, approved sources | Procurement, security, service owner | Trace an external support event and supplied component | | | |
| OICC-10 Incident response | Playbook, cases, exercises | Incident lead, IT, operations | Exercise containment and evidence preservation | | | |
| OICC-11 Continuity | Recovery plan, fallback map, test records | Operations, local owner, service owner | Perform a recovery scenario without the normal support path | | | |
| OICC-12 Lifecycle | Acquisition, transfer, return, disposition records | Procurement, asset, records owners | Trace one component from acquisition through current state or disposition | | | |

## Evidence quality check

For each item, determine whether it is:

- Relevant to the control objective
- Current for the assessment period
- Complete enough to support the conclusion
- Protected against unauthorized change
- Attributable to a person, system, action, and time
- Reproducible or independently verifiable
- Retained according to an approved requirement

## Reconciliation questions

- What does policy require?
- What do responsible people believe happens?
- What does the technology actually do?
- What evidence is retained?
- Where do those four answers disagree?
- Who owns the resulting decision?

© Output Security Institute. Manufacturer-neutral educational guidance.
