function show(type, message) { console.log('[' + type + ']', message) }
export const ElMessage = {
  success(message) { show('success', message) },
  warning(message) { show('warning', message) },
  error(message) { show('error', message) },
  info(message) { show('info', message) },
}
export const ElMessageBox = { confirm(message) { return Promise.resolve(window.confirm(message)) } }
