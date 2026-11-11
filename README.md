# PROJECT SENTINEL
### AI-Powered Crime Investigation & Digital Evidence Intelligence Platform
**Tagline:** *Connect Evidence. Discover Relationships. Accelerate Investigations.*

> **IMPORTANT DISCLAIMER:** `DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA ONLY`
> All cases, individuals (`Person A`), devices (`DEV-001` to `DEV-030`), CCTV cameras (`CAM-001` to `CAM-020`), vehicles (`VEH-001` to `VEH-008`), locations, and evidence items (`EVD-001` to `EVD-012`) are 100% fictional and synthetic. No real police, telecom, CCTV, or government systems are connected.

---

## 1. Quick Start & Setup Instructions

### Prerequisites
- **Node.js** v18.18+ (tested on Node v24.16.0)
- **npm** v9+

### Install & Launch
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start the development server on http://localhost:3050
npm run dev

# Or on Windows, double-click "run sentinel demo.bat" to start the server
# and open the demo page in your browser.

# Or build and run in production mode:
npm run build
npm start
```

Open **[http://localhost:3050](http://localhost:3050)** in any modern desktop, laptop, or tablet browser.

---

## 2. How to Run the 8-Stage Guided Presentation (5–7 Minutes)

1. Click **`START INVESTIGATION DEMO`** on the Command Centre hero banner, OR click **`START GUIDED INVESTIGATION`** in the top navigation bar at any time.
2. The interactive **Guided Walkthrough Controller** appears at the top of the screen with:
   - **Play / Pause / Resume / Previous / Next / Restart / Skip Animation** buttons.
   - **8-Stage Interactive Progress Bar** (click any stage to jump directly to it).
   - **Official Stage Narration** and **Key Stage Demonstrations**.
   - **`5–7 Min Script` Button**: Opens the built-in presenter script drawer with exact talking points for each stage.
   - **`Full-Screen Mode` / `Presentation Mode` Button**: Expands the workspace to full screen and hides secondary navigation for large meeting-room displays.

---

## 3. Demo User Profiles & Role Switching (No Password Required)

Presenters can switch roles instantaneously using the **Role Selector** in the top navigation bar or inside the **Agency Collaboration** / **Administration & Audit** modules:

| Role | Demo Officer Name | Badge ID | Primary Demonstration Capabilities |
| :--- | :--- | :--- | :--- |
| **Investigator** | `Officer Demo-01` | `INV-BLR-01` | Primary case lead for `CASE-SNT-2026-0042`; evidence review, CCTV requests, lead verification |
| **Senior Officer** | `ACP Demo-Supervisor-04` | `SUP-BLR-04` | Supervisory progress review, priority lead sign-off, CCTV preservation order approvals |
| **Forensic Officer** | `Specialist Demo-F02` | `DFIR-BLR-02` | Digital evidence intake, real-time SHA-256 checksum verification, chain of custody |
| **System Administrator** | `SysAdmin Demo-Root-01` | `ADM-SNT-01` | Platform governance, tamper-evident audit logs, system health, demo scenario reset |

---

## 4. How to Reset Demo Data

Click **`Reset Demo`** in the top-right navigation bar (or inside **Administration & Audit**) and confirm. All synthetic cases, CCTV requests, extracted video observations, vehicle comparisons, and AI investigative lead statuses are immediately restored to the clean baseline state for `CASE-SNT-2026-0042`.

---

## 5. Complete Module Architecture (13 Functional Modules)

1. **Command Centre:** Executive KPIs, 6 analytical charts, and one-click Guided Demo launch.
2. **Cases (Stage 1):** Case registry (`CASE-SNT-2026-0042`, `0039`, `0040`, `0041`) + 6-step animated Incident Registration sequence and custom case creation.
3. **Investigation Workspace (Stage 2):** Animated 7-stream Multi-Source Evidence Ingestion Engine with provenance validation and timeline normalisation.
4. **Mobile Intelligence (Stage 3):** 30 synthetic device records (`DEV-001` to `DEV-030`), horizontal correlation timeline, approximate cell-sector footprints (`450m–800m`), exculpatory contradiction (`DEV-007`), and shared fleet filtering (`DEV-012`).
5. **Location Intelligence (Stage 4 & Part 6):** Interactive Leaflet map of fictional Bengaluru corridor, 20 CCTV cameras (`CAM-001` to `CAM-020`) with directional FOV cones, radius search boundary, **`PLAY INVESTIGATION TIMELINE ON MAP`**, and batch CCTV Preservation Request generation.
6. **CCTV Intelligence (Stage 5):** Synthetic illustrative video player (`CAM-014` at `19:02`, `CAM-019` at `19:18`, `CAM-006` at `19:25`), SHA-256 container metadata, and interactive observation extraction to the timeline.
7. **Vehicle Intelligence (Stage 6):** 8 corridor vehicles (`VEH-001` to `VEH-008`), corridor comparison schematic showing the 16-minute interval without inventing movement, fleet cab exclusion (`VEH-003`), and manual investigator classification controls.
8. **AI Investigation Engine (Stage 7):** 7-step correlation sequence + 6 explainable candidate leads (`LEAD-001` to `LEAD-006`) displaying supporting evidence, contradictory evidence, plausible alternative explanations, limitations, and human review actions (Verify, Reject with mandatory reason, Annotate). Zero guilt scoring.
9. **Relationship Explorer (Part 7):** Interactive draggable node-edge graph differentiating Verified Relationships, Observed Associations, AI-Suggested Leads, and Rejected/Contradicted Links.
10. **Digital Evidence (Part 8):** 12 sealed evidence containers (`EVD-001` to `EVD-012`), live browser WebCrypto `SHA-256` file hashing on upload, original vs. working copy separation, and chain-of-custody logs.
11. **Investigation Reports (Stage 8):** Unified Investigation Timeline with 5 filters + 15-section structured Investigation Dossier with real **PDF Export (`jsPDF`)**, Print, and Download.
12. **Agency Collaboration (Part 9):** Role capability matrix and interactive inter-unit approval workflow queue.
13. **Administration & Audit (Part 12 & 16):** Live session audit log, Simulated vs. Future Authorised Integrations matrix, and Sovereign Production Roadmap.
