export const api = {
  login: async () => { throw new Error('Brak bazy danych'); },
  projects: {
    list: async () => [],
    add: async () => {},
    update: async () => {},
    remove: async () => {},
  },
  clients: {
    list: async () => [],
    add: async () => {},
    remove: async () => {},
  },
  content: {
    get: async () => ({}),
    save: async () => {},
  },
};
