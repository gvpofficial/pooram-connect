type RouteHandler = (params: Record<string, string>) => void;

interface Route {
  path: string;
  regex: RegExp;
  keys: string[];
  handler: RouteHandler;
}

const routes: Route[] = [];

export function addRoute(path: string, handler: RouteHandler) {
  const keys: string[] = [];
  const pattern = path
    .replace(/\/:([^\/]+)/g, (_, name) => {
      keys.push(name);
      return '/([^/]+)';
    })
    .replace(/\*/g, '.*');
  const regex = new RegExp(`^${pattern}$`);
  routes.push({ path, regex, keys, handler });
}

export let virtualPath = '/';

export function navigate(path: string, pushState = true) {
  const isFile = window.location.protocol === 'file:';
  const baseUrl = (import.meta.env && import.meta.env.BASE_URL) || '/';
  
  if (isFile) {
    // Under file://, use virtual memory routing to bypass CORS history pushState blockages
    let resolvedPath = path;
    if (path.startsWith('.')) {
      resolvedPath = path.replace(/^\.+/, ''); // clean relative dots e.g. ./login -> /login
    }
    if (!resolvedPath.startsWith('/')) {
      resolvedPath = '/' + resolvedPath;
    }
    
    // Strip query/hash for route matching
    let pathname = resolvedPath;
    const queryIndex = pathname.indexOf('?');
    if (queryIndex !== -1) pathname = pathname.substring(0, queryIndex);
    const hashIndex = pathname.indexOf('#');
    if (hashIndex !== -1) pathname = pathname.substring(0, hashIndex);

    virtualPath = pathname;

    for (const route of routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params: Record<string, string> = {};
        route.keys.forEach((key, index) => {
          params[key] = match[index + 1];
        });
        
        // Parse search params if query string exists
        if (queryIndex !== -1) {
          const searchStr = resolvedPath.substring(queryIndex + 1);
          const searchParams = new URLSearchParams(searchStr);
          searchParams.forEach((value, name) => {
            params[name] = value;
          });
        }
        
        route.handler(params);
        window.scrollTo(0, 0);
        return;
      }
    }
    
    console.warn(`No route match found for ${pathname}`);
    if (pathname !== '/') {
      navigate('/', false);
    }
    return;
  }

  // --- STANDARD HTTP ROUTING (For Web Servers / dev preview) ---
  // Format the path to ensure it has the base path for pushState
  let resolvedPath = path;
  if (path.startsWith('/')) {
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    if (cleanBaseUrl && !path.startsWith(cleanBaseUrl + '/')) {
      resolvedPath = cleanBaseUrl + path;
    }
  }

  if (pushState) {
    try {
      window.history.pushState({}, '', resolvedPath);
    } catch (e) {
      console.error("pushState failed:", e);
    }
  }
  
  const url = new URL(resolvedPath, window.location.origin);
  let pathname = url.pathname;
  
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  if (cleanBaseUrl !== '/') {
    const baseWithoutTrailing = cleanBaseUrl.slice(0, -1);
    if (pathname === baseWithoutTrailing) {
      pathname = '/';
    } else if (pathname.startsWith(cleanBaseUrl)) {
      pathname = '/' + pathname.substring(cleanBaseUrl.length);
    }
  }
  
  for (const route of routes) {
    const match = pathname.match(route.regex);
    if (match) {
      const params: Record<string, string> = {};
      route.keys.forEach((key, index) => {
        params[key] = match[index + 1];
      });
      
      // Parse search params (query strings)
      url.searchParams.forEach((value, name) => {
        params[name] = value;
      });
      
      route.handler(params);
      window.scrollTo(0, 0);
      return;
    }
  }
  
  console.warn(`No route match found for ${pathname}, redirecting to /`);
  navigate('/', false);
}

export function initRouter() {
  window.addEventListener('popstate', () => {
    const isFile = window.location.protocol === 'file:';
    if (!isFile) {
      navigate(window.location.pathname + window.location.search, false);
    }
  });
  
  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      // Only intercept internal links
      const isFile = window.location.protocol === 'file:';
      const isInternal = href && (href.startsWith('/') || (isFile && (href.startsWith('./') || href.startsWith('assets/'))));
      if (isInternal && !anchor.hasAttribute('download') && anchor.getAttribute('target') !== '_blank') {
        e.preventDefault();
        navigate(href);
      }
    }
  });
}
