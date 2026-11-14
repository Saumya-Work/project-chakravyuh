# PROJECT CHAKRAVYUH (प्रोजेक्ट चक्रव्यूह) — SIMULATED FEATURES VS. FUTURE AUTHORISED INTEGRATIONS & PRODUCTION ROADMAP

> **Document Purpose:** Defines the exact boundary between what is simulated in the Project Chakravyuh v1.0 Demonstration Environment and what is required for a future authorised law-enforcement production deployment.

---

## 1. Features Simulated vs. Future Authorised Integrations

| Capability Domain | What is Simulated in v1.0 Demo | Future Authorised Production Integration |
| :--- | :--- | :--- |
| **Case & FIR Intake** | Interactive synthetic intake form (`CASE-SNT-2026-0042`) with local state persistence. | Read-only statutory integration with CCTNS / ICJS via state-approved secure API gateway. |
| **Telecom & Cell-Sector Analysis** | Pre-seeded synthetic records (`DEV-001` to `DEV-030`) with approximate sector footprints (`450m–800m`). | Authorised Nodal Officer intake portal requiring digitally signed statutory orders (e.g., Section 94 BNSS / lawful interception). |
| **CCTV Discovery & Requests** | 20 fictional Bengaluru corridor cameras (`CAM-001` to `CAM-020`) with simulated custodian status updates. | Municipal SafeCity GIS registry integration + encrypted custodian upload link with automatic retention alerts. |
| **Video Footage Review** | Synthetic illustrative SVG/Canvas video feeds with non-biometric object bounding boxes. | Hardware-accelerated frame-accurate player operating on bit-verified working proxies in a sovereign cloud / FSL storage cluster. |
| **Digital Evidence Hashing** | Real-time browser WebCrypto `SHA-256` hashing (`crypto.subtle.digest`) and simulated vault URIs. | HSM-signed intake timestamps (RFC 3161), WORM (Write-Once-Read-Many) object storage, and Section 63 BSA electronic evidence certificate generation. |
| **AI Investigation Engine** | Transparent, deterministic rule & scenario correlation engine over synthetic data. | On-premise, air-gapped analytical models governed by human-in-the-loop review, explainability logs, and zero guilt-scoring enforcement. |
| **Role-Based Access & Audit** | Instant 4-role switcher (`Investigator`, `Senior Officer`, `Forensic Officer`, `System Administrator`) and session audit log. | Hardware PKI / Smart-Card MFA, strict case-level ABAC permissions, and cryptographic hash-chained immutable audit logs. |

---

## 2. Known Limitations of the Demonstration Environment

1. **Synthetic Data Only:** All entities, coordinates, registration numbers (`KA-00-SYN-...`), and timestamps are fictional.
2. **In-Memory Session State:** Demo actions persist during the browser session and can be reset at any time via `Reset Demo`. Production deployment requires PostgreSQL with encrypted storage volumes.
3. **Illustrative Video Streams:** Video feeds in Stage 5 are synthetic vector animations illustrating corridor observations rather than real private CCTV recordings.
4. **Demonstration Security Controls:** Role switching is intentionally frictionless for live executive demonstrations and is not production-certified authentication.

---

## 3. Recommended Production Roadmap & Mandatory Safeguards

1. **Legal & Statutory Authorisation Gateways:** Enforce mandatory judicial/supervisory order validation before any external record ingestion.
2. **Data Protection & Privacy Impact Assessment (DPIA):** Implement automated purging of unassociated background tower-dump records upon case closure or retention expiry.
3. **Sovereign Infrastructure & Encryption:** Deploy within STQC / MeitY-empanelled State Data Centres with TLS 1.3 and AES-256-GCM encryption.
4. **Independent Security Auditing:** Complete CERT-In / STQC vulnerability assessment, penetration testing (VAPT), and forensic chain-of-custody certification.
5. **AI Governance Charter:** Codify technical blocks against automated suspect scoring, predictive policing probabilities, or unreviewed automated classifications.

