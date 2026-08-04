# Procurement Security Questionnaire for Output Systems

Output Security Institute | Working document

Use these questions during requirements development, RFI or RFP review, demonstrations, architecture review, contracting, and acceptance testing. Require evidence where the answer affects risk or continuity.

## Architecture and data

1. What information can the system receive, process, store, transmit, render, cache, or retain?
2. Identify every embedded operating system, application, management service, cloud service, and external integration.
3. Provide a data-flow diagram for printing, scanning, faxing, administration, monitoring, updates, and support.
4. Identify all persistent and removable storage and explain how stored information is protected.
5. Which functions continue when external networks or cloud services are unavailable?

## Identity and access

6. Which user, administrator, application, and service identities are supported?
7. Can default and shared administrative credentials be removed or disabled?
8. Describe role-based access, directory integration, multifactor authentication, certificates, and session controls.
9. Can administrative access be restricted by network, source, time, role, and approved management path?
10. How are dormant accounts, credential changes, and privileged-access reviews handled?

## Network and interfaces

11. List every protocol, port, interface, discovery service, outbound connection, and remote-management path.
12. Which unnecessary or legacy services can be disabled?
13. Describe supported encryption protocols, certificate management, and validation behavior.
14. Can the system operate across segmented, restricted, dual-network, or disconnected environments?
15. What information leaves the organization, where does it go, and under whose authority?

## Logging and evidence

16. Which security, administrative, user, workflow, update, and service events are logged?
17. Can logs establish who acted, what occurred, when, where, and through which path?
18. How are time, log integrity, export, retention, and monitoring integration handled?
19. Provide sample logs and event documentation before selection.
20. Which important actions cannot be logged or attributed?

## Software, firmware, and vulnerabilities

21. How are software and firmware provenance established?
22. Describe vulnerability disclosure, notification, remediation, and customer communication.
23. How are updates tested, approved, distributed, verified, and rolled back?
24. Can updates be performed without direct vendor or technician access?
25. State the support period, end-of-support policy, and available compensating controls.

## Service and supply chain

26. Identify every party that may access the system, its data, its credentials, or its management tools.
27. Describe remote support, telemetry, diagnostic collection, and technician access.
28. Can external interaction be disabled, approved per event, identity-bound, time-limited, and audited?
29. How are parts, supplies, software, firmware, subcontractors, and replacement devices validated?
30. Which operational dependencies does the proposed model introduce, retain, or eliminate?

## Continuity and recovery

31. Which failures can users or authorized local personnel safely resolve?
32. What work can continue when the device, network, cloud service, supplier, or support provider is unavailable?
33. Describe fallback, replacement, configuration restoration, and recovery-time expectations.
34. What knowledge, parts, supplies, credentials, and authority must be available locally?
35. Demonstrate the recovery paths during acceptance testing.

## Lifecycle and disposition

36. How is the approved configuration established, recorded, restored, and monitored for change?
37. What must be revalidated after relocation, reassignment, repair, replacement, or ownership change?
38. Describe sanitization for stored jobs, logs, caches, address books, credentials, removable media, and embedded storage.
39. How is sanitization verified and documented before return, resale, or disposal?
40. Who retains chain-of-custody and disposition records?

## Evaluation record

- Requirement owner:
- Vendor response owner:
- Evidence received:
- Demonstration completed:
- Exception or limitation:
- Compensating control:
- Dependency accepted by:
- Contract language required:
- Final decision:

© Output Security Institute. Manufacturer-neutral educational guidance.
