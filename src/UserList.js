import React from 'react'
import { Link } from 'react-router-dom'
import formatDate from './utilities/formatDate'
import './UserList.css'

export function UserList({users}) {
  return (
    <ul className="UserList">
      {
        users.toArray().map((user, key) => { 
          const lastPost = user.feed ? user.feed.last() : null
          const { metadata } = user
          if (!metadata) return <p key="0" className="EmptyPlaceHolder">There seems to be nothing here.</p>
          return (
            <li key={key} className="Card">
              <h2 className="FeedHeading">Feed name:</h2>
              <Link className="FeedNameLink" to={`/${user.hash}`}>
                <span className="FeedName">{metadata.get('name')}</span>
              </Link>
              <span className="FeedLocation">{`— ${metadata.get('location')}`}</span>
              {
                lastPost ? (
                  <div className="FeedLastPost">
                    <h2 className="FeedHeading">Last post:</h2>
                    <Link className="FeedTitleLink" to={`/${user.hash}/${lastPost.hash}`}>
                        <span className="FeedLastPostTitle">{lastPost.title}</span>
                    </Link>
                    <span className="FeedLastPostDate">{`— ${formatDate(lastPost.createdAt)}`}</span>
                  </div>
                  )
                :
                <span></span>
              }
            </li>
          )
        })
      }
    </ul>
  )
}
