// 江味齋 POS：先回快取（開頁快、沒網路也能用），背景再抓新版，下次開啟生效。
const CACHE='jwpos-v8';
const SHELL=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','img/real-b1.webp','img/real-b2.webp','img/real-b4.webp','img/real-b5.webp','img/real-a7.webp','img/congyoubing.webp','img/milktea.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin||url.pathname.endsWith('/sw.js'))return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const hit=await cache.match(req,{ignoreSearch:true});
    const net=fetch(req,{cache:'no-store'}).then(res=>{if(res&&res.ok)cache.put(req,res.clone());return res;}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit;}
    return (await net)||new Response('離線中，且尚未快取此檔案 Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  })());
});
