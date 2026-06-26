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

## Azure SSO

The app includes `outputs/staticwebapp.config.json`, which requires authenticated users when deployed to Azure Static Web Apps.

See `outputs/ENTRA-SSO-SETUP.md` for Microsoft Entra ID setup notes.

## Build Version

The app reads build details from `outputs/build-info.js`. Local file mode uses the checked-in fallback version. During GitHub Actions deployment, the workflow overwrites that file so deployed builds use an auto-incrementing version in the format `1.0.<GitHub run number>`.
