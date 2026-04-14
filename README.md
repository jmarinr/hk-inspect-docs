# HK Inspect — Developer Portal

API documentation and playground for the HK Inspect integration.

**Client:** La Regional de Seguros, S.A.  
**Provider:** Henkan CX  
**Version:** v1.0  
**Live URL:** https://jmarinr.github.io/hk-inspect-docs/

---

## Deploy (GitHub Actions — auto build on push)

```bash
# 1. Clone or initialize your repo
git clone https://github.com/jmarinr/hk-inspect-docs.git
cd hk-inspect-docs

# 2. Copy all these files into the repo root
# (overwrite everything)

# 3. Push to main — GitHub Actions builds and deploys automatically
git add .
git commit -m "HK Inspect Developer Portal v1.0"
git push origin main
```

GitHub Actions will:
1. Install Node 20 + dependencies
2. Run `npm run build`
3. Deploy the `dist/` folder to GitHub Pages

**Build time:** ~2 minutes after each push.

### One-time GitHub Pages setup (only needed once)

Go to your repo → **Settings → Pages** → Source: **GitHub Actions**

---

## Test credentials

| Email | Password | Role |
|---|---|---|
| `info@henkancx.com` | `henkaninfo` | Admin |
| `dev@hkinspect.com` | `hkinspect2026` | Developer |
| `lrds@hkinspect.com` | `lrds2026` | Integration |

---

## Local development

```bash
npm install
npm run dev
# Opens at http://localhost:5173/hk-inspect-docs/
```

---

## Project structure

```
hk-inspect-docs/
├── .github/
│   └── workflows/
│       └── deploy.yml     ← Auto-build + deploy on push to main
├── src/
│   ├── App.jsx            ← Full portal (auth, docs, playground, tokens)
│   └── main.jsx           ← React entry point
├── index.html
├── vite.config.js         ← base: '/hk-inspect-docs/'
├── package.json
└── README.md
```

---

Henkan CX · Confidential · 2026
