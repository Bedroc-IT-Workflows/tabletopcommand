# Tabletop Command

Bedroc Incident Tabletop is a browser-based tabletop exercise workspace for SOC 2 incident response testing. It supports ransomware runbooks, facilitator-led scenario events, evidence capture, remediation tracking, JSON save/load, runbook administration, and Microsoft Entra ID SSO readiness for Azure hosting.

## App Location

The deployable static app is in:

`outputs/`

For Azure Static Web Apps, use these build settings:

- App location: `outputs`
- API location: leave blank
- Output location: leave blank

## Local Use

Open `outputs/index.html` in a browser.

Local file mode bypasses hosted SSO so the app can be tested without Azure.

## Actions

Use **Edit action** to change an action's description, owner, or related scenario event, then **Save action** or **Cancel edit**. Open/closed status remains controlled by **Mark closed** / **Reopen**. Editing preserves the original recorded time.

Actions no longer require or display due dates. Older scenario JSON files continue to load; legacy `due` fields are preserved when saved again but omitted from the action list and generated reports. Previously saved or manually edited report text remains as saved until you regenerate the report. New actions contain no due date. Scenario prompts mentioning due dates can be treated as optional follow-up guidance.

Run regression checks with `node --test tests/*.test.cjs`.

## Pause and Resume

After starting an exercise, use **Pause exercise** beside the elapsed timer on the Scenario Events tab when the team needs a break. The timer freezes and event reveals and completion are blocked until you select **Resume exercise**. Participants, revealed events, notes, and actions are preserved, and notes can still be edited during a break.

Pauses survive page refreshes and JSON save/load. Elapsed times in the timeline and reports exclude breaks, and pause/resume actions are recorded in the evidence log.

Run the pause/resume regression checks with `node --test tests/pause-resume.test.cjs`.

## Bedroc 45-Minute Security Tabletop

Select **Bedroc Microsoft 365 Account Compromise (45 minutes, revised)** from the runbook selector. The built-in scenario is also available in Runbook Administration for customization and export. It assumes Microsoft 365 and uses a fictional customer, Northstar Manufacturing; adapt roles and tools to your environment. Existing users receive the revised edition as a separate template; previously saved originals, customizations, and active session snapshots remain intact. Select the revised edition for a new exercise.

Start the exercise clock and reveal each round manually at its scheduled time. The times are discussion timeboxes, not simulated incident timestamps. Finish the debrief at minute 45; the app does not automatically advance or end the exercise. Pauses extend wall-clock time without consuming discussion time.

| Exercise minutes | Round |
| --- | --- |
| 0-5 | Assign decision owners and backups; locate response documents |
| 5-12 | Classify the incident and set severity and executive/counsel escalation triggers |
| 12-20 | Decide containment under presentation/deadline pressure; assess MFA recovery |
| 20-25 | Resolve uncertain download evidence and delegated OAuth persistence |
| 25-28 | Expand scope after suspicious shared-mailbox access |
| 28-30 | Decide whether a fictional 72-hour notification clause is triggered |
| 30-35 | Respond to a customer phishing click and approve communications/assistance |
| 35-40 | Set recovery gates, residual-risk ownership, monitoring, and insurance actions |
| 40-45 | Measure decision delays, document references, and assign three improvements |

End each round with a decision, rationale, owner, and reassessment time. Simulated 15-minute and 30-minute deadlines add decision pressure without extending discussion windows. The 72-hour clause is a fictional MSA input, not a representation of Bedroc's contracts or a legal deadline; participants identify who interprets actual agreements and insurance requirements.

Required facilitator closeout: record the policies, procedures, tools, and controls actually referenced, their version/location and usability, or a gap when unavailable. Examples include the Incident Response Policy, Access Control Policy, M365 Account Recovery Procedure, Conditional Access Standard, and Customer Notification Procedure; these names are examples, not an assertion that Bedroc has documents with those titles. Record three improvements with owners, due dates, and completion evidence. These requirements are facilitator prompts rather than new application validation rules. All incident actions are simulated; exercise completion does not imply incident resolution.

## Bedroc Business Operations Continuity

Select **Bedroc Business Operations Continuity (45 minutes)** for a fictional prolonged Microsoft 365 outage affecting internal email, collaboration, shared records, approvals, and coordination. Bedroc does not host customer-facing systems; customer impact in this exercise is delayed professional-service delivery or business communications. Other SaaS applications are not assumed unavailable just because their supporting records or approvals are blocked.

The scenario references the supplied BC/DR plan dated May 8, 2026. Personal emergency contact details are not embedded; participants locate and verify authorized contact sources. The revised template has a new ID so existing users receive it without overwriting saved originals, customizations, or active exercise snapshots. Choose it for a new exercise.

| Exercise minutes | Decision and evidence |
| --- | --- |
| 0-5 | Assign roles and backups; locate an available plan copy and decision log |
| 5-10 | Prioritize business processes and document deadlines, dependencies, and owners |
| 10-16 | Record an authorized activation decision and reconcile activation thresholds |
| 16-22 | Approve staff instructions and track acknowledgments without Teams/email |
| 22-28 | Approve controlled workarounds, record staffing gaps and backup confidence |
| 28-34 | Evaluate plan/MSA obligations with counsel and approve factual updates |
| 34-40 | Obtain department recovery evidence, reconcile work, and authorize resumption |
| 40-45 | Assemble evidence and assign three plan improvements |

Reveal events manually. Exercise time and simulated outage time are separate; the scenario advances from Monday morning to Tuesday recovery. Pauses do not consume discussion time. The exercise does not automatically end at minute 45.

Facilitators should require decisions, rationale, approvers, owners, deadlines, reassessment triggers, and references to documents actually used. The plan's two-business-day activation triggers, estimated-recovery triggers, 48-hour Tier 1 RTO, less-than-24-hour Tier 1 RPO, and four-hour critical-data target are explicitly discussed as differing provisions requiring a documented interpretation and plan-owner follow-up. The four-hour partner and conditional eight-hour agency notification provisions are supplied-plan requirements to evaluate with counsel, not assertions of universally applicable law. This change does not amend the plan or invent regulatory/contractual obligations.

Closeout evidence includes the impact assessment, activation record, ownership/handoffs, approved messages, workaround/exception approvals, vendor and backup evidence, department sign-offs, document-reference inventory, and three improvements with owners, due dates, and completion evidence. These are facilitator requirements, not new application completion gates. All response actions are simulated.

## Azure SSO

The app includes `outputs/staticwebapp.config.json`, which requires authenticated users when deployed to Azure Static Web Apps.

See `outputs/ENTRA-SSO-SETUP.md` for Microsoft Entra ID setup notes.

## Build Version

The app reads build details from `outputs/build-info.js`. Local file mode uses the checked-in fallback version. During GitHub Actions deployment, the workflow overwrites that file so deployed builds use an auto-incrementing version in the format `1.0.<GitHub run number>`.
