import getOrbit from './orbit'
let draftsDb = null

async function getDraftsDb () {
  const orbit = await getOrbit()
    if (!draftsDb) { 
      draftsDb = await orbit.orbitdb.docs('drafts', { indexBy: 'createdAt' })
      await draftsDb.load()
    }
    return draftsDb
}

export async function addDraft (draft) {
  const db = await getDraftsDb()
  const now = Date.now()
  await db.put({ ...draft, savedAt: now, createdAt: now })
}

export async function putDraft (hash, draft) {
  const db = await getDraftsDb()
  const now = Date.now()
  const [ oldDraft ] = db.get(hash)
  await db.put(Object.assign(oldDraft, draft, { savedAt: now }))
}

export async function removeDraft (draftHash) {
  const db = await getDraftsDb()
  await db.del(draftHash)
}

export async function queryDrafts() {
  const db = await getDraftsDb()
  const drafts = db.query(d => true).sort((a, b) => a.savedAt < b.savedAt)
  return drafts
}