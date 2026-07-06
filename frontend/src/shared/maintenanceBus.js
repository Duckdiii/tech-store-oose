// Lets httpClient (a plain module, outside React) notify MaintenanceContext the
// instant an API call comes back with a 503 maintenance response, instead of
// waiting for the next status poll.
const listeners = new Set();

export const maintenanceBus = {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  notifyMaintenance() {
    listeners.forEach((fn) => fn());
  },
};
