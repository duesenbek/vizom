# Fresh Build Checklist - Vizom

## Problem: Browser Shows Old Version

When `http://localhost:5173/generator.html` shows outdated content, follow this checklist.

---

## 🔧 DEV SERVER (Local Development)

### 1. Kill All Node Processes
```powershell
# Windows
taskkill /F /IM node.exe

# Mac/Linux
pkill -f node
```

### 2. Clear Vite Cache
```powershell
# Remove Vite cache directories
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .vite -ErrorAction SilentlyContinue
```

### 3. Restart Dev Server
```powershell
npm run dev
```

### 4. Verify Server is Running
```powershell
# Check port 5173 is listening
netstat -ano | findstr "5173"
```

---

## 🌐 BROWSER CACHE CLEARING

### Option A: Hard Refresh (Quick)
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

### Option B: DevTools Network (Reliable)
1. Open DevTools: `F12`
2. Go to **Network** tab
3. Check ✅ **Disable cache**
4. Refresh page (keep DevTools open)

### Option C: Incognito Mode (Clean Slate)
- **Chrome**: `Ctrl + Shift + N`
- **Firefox**: `Ctrl + Shift + P`
- **Edge**: `Ctrl + Shift + N`

### Option D: Clear All Cache
1. `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Select "Cookies" (optional)
4. Click "Clear data"

### Option E: Clear Service Worker
1. DevTools (`F12`) → **Application** tab
2. Left sidebar → **Service Workers**
3. Click **Unregister** for all workers
4. **Storage** → **Clear site data**

---

## 🏗️ PRODUCTION BUILD

### 1. Clean Build
```powershell
# Remove old build
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Fresh build
npm run build
```

### 2. Preview Production Build Locally
```powershell
npm run preview
# Opens on http://localhost:4173
```

### 3. Verify Build Contents
```powershell
# Check dist folder exists and has recent files
Get-ChildItem dist -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 10
```

---

## 🚀 NETLIFY DEPLOYMENT

### Verify Correct Deploy
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Check **Deploys** tab for latest deploy time
4. Click deploy → verify commit hash matches your local:
   ```powershell
   git log -1 --oneline
   ```

### Force Redeploy
1. Netlify Dashboard → **Deploys**
2. Click **Trigger deploy** → **Clear cache and deploy site**

### Check Deployed Version
Add this to your HTML to track versions:
```html
<!-- In index.html or generator.html -->
<meta name="build-version" content="2024-11-27-v1">
```

Then check in browser console:
```javascript
document.querySelector('meta[name="build-version"]')?.content
```

---

## 🔍 DEBUGGING: Which Version is Loaded?

### Method 1: Add Build Timestamp
Add to `vite.config.js`:
```javascript
export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
```

Check in console:
```javascript
console.log('Build time:', __BUILD_TIME__);
```

### Method 2: Check File Modification
In DevTools → Network tab → click on `generator.html`:
- Check **Response Headers** → `Last-Modified`
- Check **Response Headers** → `ETag`

### Method 3: Add Visible Version
```html
<!-- Temporary: add to page footer -->
<div style="position:fixed;bottom:0;right:0;background:#000;color:#0f0;padding:4px;font-size:10px;z-index:9999">
  v2024.11.27.1
</div>
```

---

## ✅ COMPLETE FRESH START CHECKLIST

```powershell
# 1. Stop everything
taskkill /F /IM node.exe

# 2. Clear all caches
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# 3. Reinstall dependencies (if needed)
# npm ci

# 4. Start fresh dev server
npm run dev

# 5. Open in incognito browser
# Ctrl + Shift + N → http://localhost:5173/generator.html
```

---

## 🐛 COMMON ISSUES

| Symptom | Cause | Fix |
|---------|-------|-----|
| Old JS code runs | Browser cache | Hard refresh or incognito |
| Old HTML shows | Service worker | Clear service worker |
| Changes not in build | Didn't run `npm run build` | Run build command |
| Netlify shows old | Deploy not triggered | Manual redeploy with cache clear |
| Multiple node processes | Old server still running | Kill all node processes |
| Vite HMR not working | Vite cache corrupted | Delete `.vite` folder |

---

## 📋 QUICK REFERENCE

### Dev Workflow
```
1. Save file
2. Vite auto-reloads (HMR)
3. If not updated → Hard refresh (Ctrl+Shift+R)
4. If still old → Kill node, clear .vite, restart
```

### Deploy Workflow
```
1. git add . && git commit -m "changes"
2. git push origin main
3. Netlify auto-deploys
4. Wait for deploy to complete
5. Hard refresh production URL
```
