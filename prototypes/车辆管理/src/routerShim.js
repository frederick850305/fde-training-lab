let currentRoute = {
  query: {},
  params: {},
  path: '/',
  name: '',
}

let navigator = null

export function installPrototypeRouter(handler) {
  navigator = handler
}

function resolveTarget(target) {
  if (typeof target === 'string') {
    return { path: target, query: {}, params: {}, name: '' }
  }
  return {
    path: target?.path || '',
    name: target?.name || '',
    query: target?.query || {},
    params: target?.params || {},
  }
}

export function useRouter() {
  return {
    push(target) {
      const route = resolveTarget(target)
      currentRoute = route
      if (navigator) navigator(route)
    },
    back() {
      if (navigator) navigator({ path: '__back__' })
    },
    replace(target) {
      const route = resolveTarget(target)
      currentRoute = route
      if (navigator) navigator(route)
    },
  }
}

export function useRoute() {
  return currentRoute
}
