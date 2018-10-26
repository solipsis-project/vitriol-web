import getOrbit from './orbit'
let knownFeedsDb = null

const AUTO_GARBAGE_COLLECT = false

if (AUTO_GARBAGE_COLLECT) removeUnpinnedFeeds()

async function getKnownFeeds () {
  const orbit = await getOrbit()
  let db
  if (!knownFeedsDb) { 
    db = await orbit.orbitdb.docs('knownFeeds')
    await db.load()
    knownFeedsDb = db
  }
  return knownFeedsDb
}

async function removeUnpinnedFeeds () {
  // This will drop the visited but unpinned feeds - acting as an automatic garbage collector.
  const orbit = await getOrbit()
  const db = await getKnownFeeds()

  const unpinned = db.query((doc) => !doc.pinned)
  for (const dbAddr of unpinned) {
    let unpinnedDb
    unpinnedDb = await orbit.orbitdb.open(dbAddr.userAddress)
    unpinnedDb.drop()
    unpinnedDb = await orbit.orbitdb.open(dbAddr.metaAddress)
    unpinnedDb.drop()
    unpinnedDb = await orbit.orbitdb.open(dbAddr.feedAddress)
    unpinnedDb.drop()
    db.del(dbAddr._id)
  }
}

export async function saveKnownFeed({userHash, userAddress, metaAddress, feedAddress}) {
  const db = await getKnownFeeds()  
  const newEntry = { userAddress, metaAddress, feedAddress }
  const dbEntry = db.get(userHash)
  const oldEntry = dbEntry ? dbEntry[0] : {}
  const updatedEntry = Object.assign({}, oldEntry, newEntry)
  await db.put({ _id: userHash, ...updatedEntry })
}

export async function getPinnedFeeds() {
  const db = await getKnownFeeds()
  return db.query(d => d.pinned).map(f => f._id)
}

export async function pinFeed(hash, pinned) {
  const db = await getKnownFeeds()
  const entry = db.get(hash)[0]
  await db.put(Object.assign({}, entry, { pinned }))
}