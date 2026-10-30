// Onde as tentativas ficam guardadas no aparelho. IndexedDB, e não localStorage: cada tentativa ocupa
// ~500 bytes e o localStorage tem ~5 MB (umas 10 mil tentativas); quando estoura, a gravação falha
// sem aviso, e histórico não gravado não se recupera (decisão 9). A versão em memória serve aos
// testes e a navegadores sem IndexedDB. A sincronização com a conta é da B2.
import type { Attempt, AttemptFeedback } from './attempts';

export interface AttemptLog {
  add(a: Attempt): Promise<void>;
  addFeedback(f: AttemptFeedback): Promise<void>;
  all(): Promise<Attempt[]>;
  feedback(): Promise<AttemptFeedback[]>;
  clear(): Promise<void>;
}

export function memoryLog(): AttemptLog {
  let attempts: Attempt[] = [];
  let fb: AttemptFeedback[] = [];
  return {
    async add(a) { attempts.push(a); },
    async addFeedback(f) { fb.push(f); },
    async all() { return [...attempts].sort((x, y) => x.at - y.at); },
    async feedback() { return [...fb]; },
    async clear() { attempts = []; fb = []; },
  };
}

const DB = 'clave';
const STORES = { attempts: 'attempts', feedback: 'attempt_feedback' } as const;

function ensureStores(db: IDBDatabase) {
  if (!db.objectStoreNames.contains(STORES.attempts)) db.createObjectStore(STORES.attempts, { keyPath: 'id' }).createIndex('at', 'at');
  if (!db.objectStoreNames.contains(STORES.feedback)) db.createObjectStore(STORES.feedback, { keyPath: 'id' });
}

/** Abre o banco na versão que ele já tiver. Se faltar alguma tabela (banco criado vazio por outro
 *  código, ou uma tabela nova numa versão futura), reabre uma versão acima para criá-la. */
function open(version?: number): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = version ? indexedDB.open(DB, version) : indexedDB.open(DB);
    req.onupgradeneeded = () => ensureStores(req.result);
    req.onsuccess = () => {
      const db = req.result;
      if (Object.values(STORES).every(name => db.objectStoreNames.contains(name))) return resolve(db);
      const next = db.version + 1;
      db.close();
      open(next).then(resolve, reject);
    };
    req.onerror = () => reject(req.error);
  });
}
const done = (tx: IDBTransaction) => new Promise<void>((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error);
  tx.onabort = () => reject(tx.error);
});
const result = <T,>(req: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

export function indexedDbLog(): AttemptLog {
  let db: Promise<IDBDatabase> | null = null;
  const get = () => (db ??= open());
  const put = async (store: string, value: unknown) => {
    const tx = (await get()).transaction(store, 'readwrite');
    tx.objectStore(store).put(value);
    await done(tx);
  };
  return {
    add: a => put(STORES.attempts, a),
    addFeedback: f => put(STORES.feedback, f),
    async all() {
      const tx = (await get()).transaction(STORES.attempts, 'readonly');
      return result(tx.objectStore(STORES.attempts).index('at').getAll() as IDBRequest<Attempt[]>);
    },
    async feedback() {
      const tx = (await get()).transaction(STORES.feedback, 'readonly');
      return result(tx.objectStore(STORES.feedback).getAll() as IDBRequest<AttemptFeedback[]>);
    },
    async clear() {
      const tx = (await get()).transaction([STORES.attempts, STORES.feedback], 'readwrite');
      tx.objectStore(STORES.attempts).clear();
      tx.objectStore(STORES.feedback).clear();
      await done(tx);
    },
  };
}

let current: AttemptLog | null = null;
/** O registro em uso: IndexedDB quando o navegador tem, senão memória. */
export function attemptLog(): AttemptLog {
  return (current ??= typeof indexedDB !== 'undefined' ? indexedDbLog() : memoryLog());
}
/** Troca o registro (testes). */
export function setAttemptLog(log: AttemptLog) {
  current = log;
}

/** Grava uma tentativa sem travar a tela. Uma falha aparece no console, mas não interrompe o exercício. */
export function saveAttempt(a: Attempt) {
  attemptLog().add(a).catch(err => console.error('Não deu para gravar a tentativa', err));
}
