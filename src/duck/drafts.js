import { List, Map } from 'immutable'
import { queryDrafts, addDraft, putDraft, removeDraft } from '../services/drafts'

const SET_DRAFTS = 'SET_DRAFTS'

export function initDrafts() {
  return async function (dispatch, getState) {
    const drafts = await queryDrafts()
    dispatch(setDrafts(drafts))
  }
}

export function insertDraft(draft) {
  return async function (dispatch, getState) {
    await addDraft(draft)
    const drafts = await queryDrafts()
    dispatch(setDrafts(drafts))
  }
}

export function deleteDraft(hash) {
  return async function (dispatch, getState) {
    await removeDraft(hash)
    const drafts = await queryDrafts()
    dispatch(setDrafts(drafts))
  }
}

export function replaceDraft(hash, draft) {
  return async function (dispatch, getState) {
    await putDraft(hash, draft)
    const drafts = await queryDrafts()
    dispatch(setDrafts(drafts))
  }
}

function setDrafts(drafts) {
  return { type: SET_DRAFTS, drafts }
}

const initialState = Map({
  draftList: List([])
})

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_DRAFTS':
      return state.set('draftList', List(action.drafts))
    default:
    return state
  }
}