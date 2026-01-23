// This file acts as the bootstrapper for the browser-based Vue environment
declare const Vue: any;
declare const VueRouter: any;

const { loadModule } = (window as any)['vue3-sfc-loader'];

// Helper to check if we are in an iframe/sandboxed environment
const isIframe = window.self !== window.top;

async function initApp() {
  
  // 1. Robust Icon Loading with Fallback
  let lucide: any;
  try {
    lucide = await import('https://esm.sh/lucide-vue-next@0.344.0');
  } catch (e) {
    console.warn("Failed to load icons from CDN. Using fallback mocks.", e);
    // Create a Proxy that returns a dummy component for any icon requested
    lucide = new Proxy({}, {
      get: (target, prop) => {
        return {
          template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide-fallback" style="width:1em;height:1em;"><rect x="2" y="2" width="20" height="20" rx="2"/></svg>`
        }
      }
    });
  }

  // 2. Configure SFC Loader
  const options = {
    moduleCache: {
      vue: Vue, 
      'vue-router': VueRouter,
      'lucide-vue-next': lucide
    },
    
    async getFile(url: string) {
      const res = await fetch(url);
      if ( !res.ok )
        throw Object.assign(new Error(res.statusText + ' ' + url), { res });
      return {
        getContentData: (asBinary: boolean) => asBinary ? res.arrayBuffer() : res.text(),
      }
    },
    
    addStyle(textContent: string) {
      const style = document.createElement('style');
      style.textContent = textContent;
      const ref = document.head.getElementsByTagName('style')[0] || null;
      document.head.insertBefore(style, ref);
    },
    
    handleModule: async function (type: string, getContentData: any, path: string, options: any) {
      switch (type) {
        case '.json':
          return JSON.parse(await getContentData(false));
        case '.ts':
          return options.handleModule('.js', getContentData, path, options);
        default:
          return undefined;
      }
    },
    log(type: string, ...args: any[]) {
      if (type === 'error') console.error(...args);
    }
  }

  try {
    const App = await loadModule('./app.vue', options);
    const HomePage = await loadModule('./pages/index.vue', options);
    
    const routes = [
      { path: '/', component: HomePage }
    ];

    // 3. Security-Safe Router Configuration
    // The "SecurityError: blocked frame" happens because WebHashHistory tries to access history.state 
    // which is restricted in some sandboxed iframes. We force MemoryHistory in these cases.
    let history;
    if (isIframe) {
        console.log("Iframe detected: Using MemoryHistory to prevent security blocks.");
        history = VueRouter.createMemoryHistory();
    } else {
        try {
            history = VueRouter.createWebHashHistory();
        } catch (e) {
            console.warn("Hash history failed, falling back to Memory history.", e);
            history = VueRouter.createMemoryHistory();
        }
    }

    const router = VueRouter.createRouter({
      history,
      routes,
    });

    const app = Vue.createApp(App);
    app.use(router);
    app.mount('#app');
    
  } catch (error: any) {
    console.error("CRITICAL APP ERROR:", error);
    document.body.innerHTML = `<div style="color:white; background:#111; padding:40px; font-family:sans-serif; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
      <h3 style="font-size:24px; color:#C41E1E; margin-bottom:16px;">System Error</h3>
      <p style="color:#ccc; margin-bottom:20px;">${error.message}</p>
      <button onclick="window.location.reload()" style="padding:12px 24px; background:#C41E1E; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Retry</button>
    </div>`;
  }
}

initApp();