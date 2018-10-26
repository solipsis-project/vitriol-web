import React from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import formatDate from './utilities/formatDate'
import readingTime from './utilities/readingTime'
import './CardList.css'

// No, regexs can't parse html. This is best effort because we don't want to spawn a parser.
const re = /<img\b[^>]+?src\s*=\s*['"]?([^\s'"?#>]+)/

export default class FeedList extends React.Component {
  handleDelete = (e, article) => {
    e.stopPropagation()
    e.preventDefault()
    this.props.onDelete(article)
  }
  
  render() {
    const { linkFormatter, authorFormatter, articleList, onDelete } = this.props
    if (!articleList.size) return null
    
    return (articleList.map((article, i) => {
      const scrapedImage = re.exec(article.text)
      const imageSrc = scrapedImage ? scrapedImage[1] : null
      const createdAt = formatDate(article.createdAt)
      return (
        <Link to={linkFormatter(article)} className="Card" key={i}>
          <div className="articleHeader">
            <div className="articleDate">{createdAt}</div>
            { onDelete ? <FiTrash2 className="articleDelete" onClickCapture={e => this.handleDelete(e, article)} /> : null }
          </div>
          { imageSrc ? <div className="articleImageContainer"><img alt={article.title} className="articleImagePreview" src={imageSrc} /></div> : null }
          <span className="articleTitle">{article.title}</span>
          <div className="articleDescription">{article.description}</div>
          <div className="articleAuthor">By {`${authorFormatter(article)} - ${readingTime(article.text).text}`}</div>
        </Link>
      )
    }
  ))
  }
}