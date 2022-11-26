import React from 'react'
import DOMPurify from 'dompurify'

const BlogPost = ({post}) => {
  
  return (
    <div className='post-container'>
        
        <div className="header-container">
          <h3 className='postHeader' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.MessageHeader, {ALLOWED_TAGS: ['b', 'i']})}}></h3>
          <small>Lades till: {DOMPurify.sanitize(post.Date, {ALLOWED_TAGS: ['b', 'i']})}</small>
        </div>
        <hr />
        <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.Message, {ALLOWED_TAGS: ['b', 'i']})}}></p>
    </div>
  )
  
}

export default BlogPost