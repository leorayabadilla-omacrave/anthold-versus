# builds the installable phone app in app/ from versus.html: python build-app.py
# app/ is a static site: host it anywhere over https, open it on a phone, "Add to Home Screen"
import json, time, pathlib
root = pathlib.Path(__file__).parent
app = root / "app"
src = (root / "versus.html").read_text(encoding="utf-8")
head = ('<!doctype html><html class="app" lang="en">\n'  # .app hides online play, which only works on claude.ai
        '<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-180.png">\n'
        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n')
tail = '\n<script>if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script>\n'
(app / "index.html").write_text(head + src + tail, encoding="utf-8")
(app / "manifest.webmanifest").write_text(json.dumps({
    "name": "ANTHOLD Versus", "short_name": "Anthold", "start_url": "./", "scope": "./",
    "display": "fullscreen", "orientation": "landscape",
    "background_color": "#ebe2c0", "theme_color": "#ebe2c0",
    "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
              {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]}, indent=1))
# offline: keep a copy of every file the game loads (fonts included); a new build changes the cache name so phones update
(app / "sw.js").write_text(f'''const C="anthold-{int(time.time())}";
self.oninstall=e=>{{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"])));}};
self.onactivate=e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
self.onfetch=e=>{{if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{{ignoreSearch:true}}).then(r=>r||fetch(e.request).then(res=>{{if(res.ok||res.type==="opaque"){{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));}}return res;}})));}};
''', encoding="utf-8")
print("built app/ :", ", ".join(sorted(p.name for p in app.iterdir())))
