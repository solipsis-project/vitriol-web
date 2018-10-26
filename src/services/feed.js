import getOrbit from './orbit'
import { saveKnownFeed } from './knownFeeds'

export default async function createFeedInstance(callback, userAddress, userHash) {
  
  let ipfs
  let userMetaDb
  let feedDb
  let userDb
  let orbitdb
  let access
    
  async function loadSelf() {
    userDb = await orbitdb.log('user', access) // Create it; this is the current user
    await userDb.load()

    callback(null, 'userAddress', userDb.address.toString())

    const [metaAddress, feedAddress] = userDb.iterator({ limit: -1 }) // We want to get the first two and ignore the rest. This might not be ok TODO
      .collect()
      .map((e) => e.payload.value)
    
    if (!metaAddress) {
      // The current user has logged in for the first time; let's create the metadata
      userMetaDb = await orbitdb.keyvalue('userMeta', access)
      userDb.add(userMetaDb.address.toString())
    }
    else userMetaDb = await orbitdb.keyvalue(metaAddress)

    if (!feedAddress) {
      // The current user has logged in for the first time; let's create the new feed
      feedDb = await orbitdb.feed('userFeed', access)
      userDb.add(feedDb.address.toString())
    }
    else feedDb = await orbitdb.feed(feedAddress)

    // Set listeners to the user metadata
    await userMetaDb.load()
    callback(null, 'userMeta', getUserMeta())
    userMetaDb.events.on('write', () => callback(null, 'userMeta', getUserMeta()))

    // Set listeners to the user feed
    await feedDb.load()
    callback(null, 'userFeed', getUserFeed())
    feedDb.events.on('write', () => callback(null, 'userFeed', getUserFeed()))
  }
  
  async function loadRemote() {
    userDb = await orbitdb.log(userAddress, { sync: true, replicate: true, create: true })
    
    userDb.events.on('replicated', replicateData)
    userDb.events.on('replicate.progress', (address, hash, entry, progress, have) => console.log('REPLICATE progress', address, hash, entry, progress, have) )
    
    callback(null, 'userAddress', userDb.address.toString())
    
    async function replicateData() {
      if (userMetaDb && feedDb) return
      
      const [metaAddress, feedAddress] = userDb.iterator({ limit: -1 }) // TODO this
      .collect()
      .map((e) => e.payload.value)

      if (!metaAddress || !feedAddress) return
      
      // Replicate feed and meta
      userMetaDb = await orbitdb.keyvalue(metaAddress)
      feedDb = await orbitdb.feed(feedAddress)
      
      saveKnownFeed({ userHash, userAddress, metaAddress, feedAddress })

      userMetaDb.events.on('replicated', () => {
        console.log('meta REPLICATED!')
        renderMeta()
        callback(null, 'replicated', 'meta')
      })
      
      userMetaDb.events.on('replicate', () => {
        console.log('meta REPLICATE!')
        callback(null, 'replicate', 'meta')
      })
      
      userMetaDb.events.on('meta ready', (address) => { console.log('READY', address, userDb)})
      userMetaDb.events.on('meta replicate.progress', (address, hash, entry, progress, have) => console.log('REPLICATE progress', address, hash, entry, progress, have) )

      feedDb.events.on('replicated', () => {
        console.log('feedDb REPLICATED!')
        renderFeed()
        callback(null, 'replicated', 'feed')
      })
      
      feedDb.events.on('replicate', () => {
        console.log('feedDb REPLICATE!')
        callback(null, 'replicate', 'feed')
      })
      
      feedDb.events.on('feedDb ready', (address) => { console.log('READY', address, userDb)})
      feedDb.events.on('feedDb replicate', (address) => console.log('REPLICATE', address) )
      feedDb.events.on('feedDb replicate.progress', (address, hash, entry, progress, have) => console.log('REPLICATE progress', address, hash, entry, progress, have) )
      
      await userMetaDb.load()
      await feedDb.load()
      
      renderMeta()
      renderFeed()
    }
    
    async function renderMeta() {
      if (!userMetaDb) return
      callback(null, 'userMeta', getUserMeta())
    }
    
    async function renderFeed() {
      if (!feedDb) return
      callback(null, 'userFeed', getUserFeed())
    }
    
    await userDb.load()
    replicateData()
  }

  function setUserMeta(userMeta) {
    // Write on the user meta db; this is only for the current user
    if (!userMetaDb) return callback('NO_USER_META')
    if (userAddress) return callback('INVALID_OPERATION_SET_META')
    userMetaDb.set('value', userMeta)
  }

  async function addToFeed({title, description, text}) {
    // Write on the user feed db; this is only for the current user
    if (!feedDb) return callback('NO_USER_FEED')
    // Not creating another keyvalue here; this has the advantage of making deeplinking easier but the disdvantage of having - possibly - a lot of stuff to download
    // Also, articles can be edited only by deleting them and re-publishing them. Order can't be chosen.
    feedDb.add({ createdAt: Date.now(), text, title, description })
  }
  
  async function deleteFromFeed(hash) {
    // Delete on the user feed db; this is only for the current user
    if (!feedDb) return callback('NO_USER_FEED')
    feedDb.remove(hash)
  }

  function getUserMeta() {
    if (!userMetaDb) return callback('NO_USER_META')
    return userMetaDb.get('value')
  }

  function getUserFeed(limit = 10) {
    if (!feedDb) return callback('NO_USER_FEED')
    const feedLen = Object.keys(feedDb._index._index).length
    return feedDb.iterator({ limit })
        .collect()
        .map(e => ({ ...e.payload.value, hash: e.hash, next: e.next.length, feedLen }))
  }
  
  function getFeedPage(lt, limit = 10) {
    if (!feedDb) return callback('NO_USER_FEED')
    return feedDb.iterator({ limit, lt })
        .collect()
        .map(e => ({ ...e.payload.value, hash: e.hash, next: e.next.length  }))
  }
  
  function getUserArticle(hash) {
    if (!feedDb) return callback('NO_USER_FEED')
    return feedDb.get(hash)
  }
  
  async function broadcastPeers() {
    if (!ipfs || !userDb || !feedDb || !userMetaDb ) return
    const networkPeers = await ipfs.swarm.peers()
    const userDbPeers = await ipfs.pubsub.peers(userDb.address.toString())
    const feedDbPeers = await ipfs.pubsub.peers(feedDb.address.toString())
    const userMetaDbPeers = await ipfs.pubsub.peers(userMetaDb.address.toString())
    callback(null, 'peers', {networkPeers, userDbPeers, feedDbPeers, userMetaDbPeers}) // TODO connect it to something :)
  }
  
  let orbit
  try {
    orbit = await getOrbit()
  }
  catch (e) {
    callback('ERROR_INITIALIZING_IPFS')
    return
  }
  
  ipfs = orbit.ipfs
  orbitdb = orbit.orbitdb
  access = orbit.access
  
  setInterval(broadcastPeers, 10000)
  
  return userAddress ? 
    { load: loadRemote, getUserArticle, getFeedPage } 
  : { load: loadSelf, setUserMeta, addToFeed, deleteFromFeed, getUserArticle, getFeedPage }
}
