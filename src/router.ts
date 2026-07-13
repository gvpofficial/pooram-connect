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

export function navigate(path: string, pushState = true) {
  if (pushState) {
    window.history.pushState({}, '', path);
  }
  
  const url = new URL(path, window.location.origin);
  const pathname = url.pathname;
  
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
    navigate(window.location.pathname + window.location.search, false);
  });
  
  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      // Only intercept internal links
      if (href && href.startsWith('/') && !anchor.hasAttribute('download') && anchor.getAttribute('target') !== '_blank') {
        e.preventDefault();
        navigate(href);
      }
    }
  });
}
