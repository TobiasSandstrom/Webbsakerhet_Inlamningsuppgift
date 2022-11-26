import {React, useEffect, useState} from 'react'
import axios from 'axios'
import BlogPost from '../components/BlogPost'
import { useAuth0 } from '@auth0/auth0-react'
import LoadingSpin from '../components/LoadingSpin'

const Blog = () => {
  
  const [siteLoading, setSiteLoading] = useState(true)
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0()
  const [posts, setPosts] = useState([])

  
  
  useEffect(() => {
    
    
    async function getData() {
      let token = await getAccessTokenSilently()
      const response = await axios.get("https://localhost:7287/api/Messages/getMessages", { headers: {
        Authorization: `Bearer ${token}`
      } })
      setPosts(response.data)
      setSiteLoading(false)
    }

    if(isAuthenticated){
    getData()
    }
  }, [])




  return (
    <>
      {!isAuthenticated &&
        <div className='not-autenticated-container'>
          <h2 className='h2-auth-error'>Logga in för att kunna se blogginläggen</h2>
          <button className='error-signin-button' onClick={loginWithRedirect}>Logga In</button>
        </div>
      }
        

        
        
        {isAuthenticated && <>
          
          {siteLoading && <> <LoadingSpin /> </> }

          <div className='blog-container'>
            <h1>Blogginlägg</h1>

            {posts.map(post => (
              <BlogPost key={post.id} post={post} />))
            }

        </div>
      </>
        }

    </>
  )
}

export default Blog