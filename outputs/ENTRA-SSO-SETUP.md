# Bedroc Entra ID SSO Setup

This app is prepared for Microsoft Entra ID SSO when hosted on Azure Static Web Apps or Azure App Service with built-in authentication.

## Recommended Hosting

Use Azure Static Web Apps for the current static application.

The included `staticwebapp.config.json` protects all routes with the built-in `authenticated` role and redirects unauthenticated users to:

`/.auth/login/aad`

## Entra Setup Notes

For a Bedroc-only employee app, configure Microsoft Entra ID so only Bedroc's tenant can authenticate.

For Azure App Service Easy Auth, Microsoft documents the redirect URI pattern as:

`https://<app-name>.azurewebsites.net/.auth/login/aad/callback`

Use the equivalent hostname for your deployed app.

## Runtime Behavior

- Hosted on Azure with auth enabled: users must sign in with Microsoft before the app loads.
- Opened locally as a file: the app runs in local development mode because Azure `/.auth` endpoints do not exist.
- No client secret is stored in this app.
- The app calls `/.auth/me` only to display the signed-in user.

## Future Role Model

The next security step is role-based access:

- Admin: manage runbooks.
- Facilitator: run exercises.
- Auditor: view and export reports.

Azure Static Web Apps supports the built-in `authenticated` role and custom roles through its authorization model.
