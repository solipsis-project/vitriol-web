import React from 'react'
import ReactQuill from 'react-quill'
import { Link } from 'react-router-dom'
import 'react-quill/dist/quill.bubble.css'
import './Editor.css'

class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.state = { 
      html: this.props.html || '',
      title: this.props.title || '',
      description: this.props.description || ''
    }
  }
  
  handleArticleChange = (html) => {
  	this.setState({ html })
  }

  handleTitleChange = (e) => {
    const title = e.target.value
    this.setState({ title })
  }
  
  handleDescriptionChange = (e) => {
    const description = e.target.value
    this.setState({ description })
  }
  
  render () {
    const { readOnly, onCancel, onSaveDraft, onSave } = this.props
    const { html, title, description } = this.state
    const isDisabled = !(html && title && description)
    
    return (
      <div className="FeedEditor">
      {
        readOnly ?
        <span className="EditorTitle">
          {this.state.title}
        </span>
      :
        <input
          maxLength="80"
          placeholder="Title"
          className="EditorTitle" 
          onChange={this.handleTitleChange} 
          value={this.state.title}/>
      }
      { 
        readOnly ?
        <span className="EditorDescription">
          {this.state.description}
        </span>
      :
        <textarea 
          maxLength="255"
          placeholder="Description"
          className="EditorDescription"
          onChange={this.handleDescriptionChange}
          value={this.state.description}/>
      }
      {
        readOnly && this.props.author ? 
        <span className="EditorAuthor">
          by <Link to={this.props.author.url}>{this.props.author.name}</Link>
        </span>
          :
        null
      }
        <ReactQuill 
          theme='bubble'
          readOnly={readOnly}
          onChange={this.handleArticleChange}
          value={this.state.html}
          modules={Editor.modules}
          formats={Editor.formats}
          bounds={'.app'}
          placeholder={'Write something...'}
         />
      {  
        !readOnly ? 
        ( <div className="EditorCommands">
            <button className="Button Secondary" onClick={onCancel}>CANCEL</button>
            <button disabled={isDisabled} className="Button Secondary" onClick={() => onSaveDraft(this.state)}>DRAFT</button>
            <button disabled={isDisabled} className="Button" onClick={() => onSave(this.state)}>PUBLISH</button>
          </div>
        )
        : 
        null
      }
      </div>
     )
  }
}

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}],
    ['bold', 'italic', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header',
  'bold', 'italic', 'blockquote',
  'list', 'bullet',
  'link', 'image'
]

export default Editor