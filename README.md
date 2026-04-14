# HK Inspect — Developer Portal

API documentation and playground for the HK Inspect integration.

**Client:** La Regional de Seguros, S.A.  
**Provider:** Henkan CX  
**Version:** v1.0

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173/hk-inspect-portal/`

### 3. Deploy to GitHub Pages

```bash
npm run deploy
```

The portal will be live at:
```
https://<your-github-username>.github.io/hk-inspect-portal/
```

---

## Test credentials

| Email | Password | Role |
|---|---|---|
| `info@henkancx.com` | `henkaninfo` | Admin |
| `dev@hkinspect.com` | `hkinspect2026` | Developer |
| `lrds@hkinspect.com` | `lrds2026` | Integration |

> These are mock credentials for the demo. Replace with Firebase Auth or Auth0 for production.

---

## Project structure

```
hk-inspect-portal/
├── src/
│   ├── App.jsx        # Full portal — auth, docs, playground, token manager
│   └── main.jsx       # React entry point
├── index.html
├── vite.config.js     # GitHub Pages base path configured
├── package.json
└── README.md
```

---

## Deploying to GitHub Pages — step by step

```bash
# 1. Create your repo on GitHub (name: hk-inspect-portal)

# 2. Initialize and push
git init
git add .
git commit -m "Initial commit — HK Inspect Developer Portal v1.0"
git branch -M main
git remote add origin https://github.com/<your-username>/hk-inspect-portal.git
git push -u origin main

# 3. Deploy
npm run deploy
```

After ~2 minutes, GitHub Pages will serve the portal at:
`https://<your-username>.github.io/hk-inspect-portal/`

---

## Roadmap

- [ ] Firebase Auth integration (Google SSO + Microsoft SSO real)
- [ ] Real token issuance from backend
- [ ] Webhooks section in API docs
- [ ] Changelog page

---

Henkan CX · Confidential · 2026
