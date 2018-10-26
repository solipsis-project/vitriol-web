import { Map, List, Record } from 'immutable'
import createFeedInstance from '../services/feed.js'
import { getPinnedFeeds, pinFeed } from '../services/knownFeeds.js'
import { addNotification } from './notifications.js'
import { setUnrecoverableError } from './error.js'

const CREATE_USER = 'CREATE_USER'
const SET_USERDB_ADDR = 'SET_USERDB_ADDR'
const SET_USER_FEED = 'SET_USER_FEED'
const SET_USER_METADATA = 'SET_USER_METADATA'
const SET_USERDB_INSTANCE = 'SET_USERDB_INSTANCE'
const SET_USER_MASTER = 'SET_USER_MASTER'
const SET_USER_HASH = 'SET_USER_HASH'
const ADD_ARTICLE = 'ADD_ARTICLE'
const SET_USER_PINNED = 'SET_USER_PINNED'
const SET_REPLICATION = 'SET_REPLICATION'
const ADD_USER_FEED = 'ADD_USER_FEED'

const UserRecord = Record({
  dbInstance: null,
  metadata: null,
  feed: null,
  articles: Map({}),
  dbAddress: null,
  hash: null,
  replication: Map({
    meta: false,
    feed: false,
    metaProgress: Map({total: 0, current: 0}),
    feedProgress: Map({total: 0, current: 0}),
  }),
  pinned: false,
  isMaster: false
})

const initialUsers = Map()

export function init() {
  return async function(dispatch) {
    const pinned = await getPinnedFeeds()
    // Load and replicate the pinned ones
    // Please note that the unpinned, but already-replicated ones are still in the db.
    // They won't be replicated but they will be *not* garbage collected
    // One possibility is waiting for garbage collection
    // Another is make the user manually garbage collect them.
    // For now, we just ignore them.
    for (const hash of pinned) {
      dispatch(loadPinned(hash))
    }
  }
}

export function advanceFeedPage(hash) {
  return async function(dispatch, getState) {
    const user = (getState().users.get(hash))
    const lastPost = user.feed.first().hash
    const newPage = user.dbInstance.getFeedPage(lastPost)
    dispatch(addUserFeedPage(hash, newPage))
  }
}

export function pin(hash, pinned) {
  return async function(dispatch) {
    pinFeed(hash, pinned)
    dispatch(setUserPinned(hash, pinned))
  }
}

export function load(hash, pinned) {
  return async function(dispatch, getState) {
    if (getState().users.get(hash)) return console.info(`hash ${hash} requested, but it was already loaded (probably because it was pinned)`)
    dispatch(createUser(hash))
    const userAddress = `/orbitdb/${hash}/user`
    const dbInstance = await createFeedInstance((...args) => handleDbMessage(...args, hash, dispatch, getState), userAddress, hash)
    dispatch(setUserDbInstance(hash, dbInstance))
    dispatch(setUserHash(hash))
    if (pinned) dispatch(setUserPinned(hash, true))
    dbInstance.load()
  }
}

function loadPinned(hash) {
  return async function(dispatch, getState) {
    if (getState().users.get(hash)) dispatch(setUserPinned(hash, true))
    else dispatch(load(hash, true))
  }
}

export function loadMaster() {
  let dbInstance = null
  let hash = null
  return async function(dispatch, getState) {
    dbInstance = await createFeedInstance((err, status, arg) => {
      if (err) return (handleDbMessage(err, status, arg, hash, dispatch, getState))
      if (status === 'userAddress') {
        const address = arg
        hash = address.split('/')[2]
        dispatch(createUser(hash))
        dispatch(setUserMaster(hash, true))
        dispatch(setUserHash(hash))
        dispatch(setUserDbAddr(hash, address))
        dispatch(setUserDbInstance(hash, dbInstance))
      }
      else {
        if (!hash) console.error('RACE CONDITION!!!')
        handleDbMessage(err, status, arg, hash, dispatch, getState)
      }
    })
    dbInstance.load()
  }
}

function handleDbMessage (err, status, arg, hash, dispatch, getState) {
  if (err) return dispatch(setUnrecoverableError(err))
  switch(status) {
    case 'userAddress':
      dispatch(setUserDbAddr(hash, arg))
      break
    case 'userMeta':
      dispatch(setUserMetadata(hash, arg))
      break
    case 'userFeed':
      dispatch(setUserDbFeed(hash, arg))
      break
    case 'replicate':
      dispatch(setReplication(hash, arg, true))
      break
    case 'replicated':
      const user = getState().users.get(hash)
      const message = (user.metadata && user.metadata.has('name')) ? `${user.metadata.get('name')}'s feed was just updated` : 'A feed was just updated'
      console.log('notification', message)
      dispatch(addNotification({ feedLink: hash, message }))
      dispatch(setReplication(hash, arg, false))
      break
    default:
      break
  }
}

export function getArticle(userHash, articleHash) {
  return function(dispatch, getState) {
    const dbInstance = getState().users.get(userHash).dbInstance
    const articleData = dbInstance.getUserArticle(articleHash)
    if (articleData && articleData.hash === articleHash) dispatch(addArticle(userHash, articleHash, articleData.payload.value))
    // There are two cases here. If articleData is undefined, we don't have anything for this feed (yet)
    // If articleData.hash !== articleHash, we have this feed stored, but the article is not found, so the first one is returned
  }
}


export function setMasterMetadata(info) {
  return function(dispatch, getState) {
    const masterUserInstance = getState().users.find(u => u.isMaster).dbInstance
    masterUserInstance.setUserMeta(info)
  }
}

export function addMasterArticle({title, description, text}) {
  return function(dispatch, getState) {
    const masterUserInstance = getState().users.find(u => u.isMaster).dbInstance
    masterUserInstance.addToFeed({title, description, text})
  }
}

export function deleteMasterArticle(hash) {
  return function(dispatch, getState) {
    const masterUserInstance = getState().users.find(u => u.isMaster).dbInstance
    masterUserInstance.deleteFromFeed(hash)
  }
}

function addUserFeedPage(hash, feed) {
  return { type: ADD_USER_FEED, feed, hash }
}

function createUser(hash) {
  return { type: CREATE_USER, hash }
}

function setUserPinned(hash, pinned) {
  return { type: SET_USER_PINNED, hash, pinned }
}

function setUserDbInstance(hash, dbInstance) {
  return { type: SET_USERDB_INSTANCE, dbInstance, hash }
}

function setUserDbAddr(hash, address) {
  return { type: SET_USERDB_ADDR, hash, address }
}

function setUserDbFeed(hash, feed) {
  return { type: SET_USER_FEED, feed, hash }
}

function setUserMetadata(hash, metadata) {
  return { type: SET_USER_METADATA, metadata, hash }
}

function setUserMaster(hash, isMaster) {
  return { type: SET_USER_MASTER, isMaster, hash }
}

function setUserHash(hash) {
  return { type: SET_USER_HASH, hash }
}

function addArticle(userHash, articleHash, article) {
  return { type: ADD_ARTICLE, userHash, articleHash, article }
}

function setReplication(userHash, dataType, value) {
  return { type: SET_REPLICATION, userHash, dataType, value }
}

export default function reducer(state = initialUsers, action) {
  switch (action.type) {
    case CREATE_USER:
      return state.get(action.hash) ? state : state.set(action.hash, new UserRecord())
    case SET_USERDB_INSTANCE:
      return state.setIn([action.hash, 'dbInstance'], action.dbInstance)
    case SET_USERDB_ADDR:
      return state.setIn([action.hash, 'dbAddress'], action.address)
    case ADD_USER_FEED:
      return state.updateIn([action.hash, 'feed'], oldFeed => oldFeed.unshift(...action.feed))
    case SET_USER_FEED:
      return state.setIn([action.hash, 'feed'], List(action.feed))
    case SET_USER_METADATA:
      return state.setIn([action.hash, 'metadata'], Map(action.metadata))
    case SET_USER_MASTER:
      return state.setIn([action.hash, 'isMaster'], action.isMaster)
    case SET_USER_HASH:
      return state.setIn([action.hash, 'hash'], action.hash)
    case SET_USER_PINNED:
      return state.setIn([action.hash, 'pinned'], action.pinned)
    case ADD_ARTICLE:
      return state.setIn([action.userHash, 'articles', action.articleHash], action.article)
    case SET_REPLICATION:
      return state.setIn([action.userHash, 'replication', action.dataType], action.value)
    default:
      return state
  }
}
