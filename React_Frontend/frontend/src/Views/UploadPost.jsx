import { useState, useEffect } from 'react'
import axios from 'axios'
import DOMPurify from 'dompurify'
import { useAuth0 } from '@auth0/auth0-react'
import LoadingSpin from '../components/LoadingSpin'


const UploadPost = () => {

    const {isAuthenticated, loginWithRedirect, getAccessTokenSilently, user} = useAuth0()

    const domain = process.env.REACT_APP_AUTH0_DOMAIN
    const [userToken, setUserToken] = useState([])
    const [siteLoading, setSiteLoading] = useState(true)


    useEffect(() => {
        const getUserToken = async () => {
      
            try {
              const accessToken = await getAccessTokenSilently({
                audience: `https://${domain}/api/v2/`,
              });
              setUserToken(accessToken)
              setSiteLoading(false)

            } catch (e) {
              console.log(e.message)
              setSiteLoading(false)

            }
          };
    
        getUserToken();
    }, [getAccessTokenSilently, user?.sub]);






    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        blogHeader: '',
        blogMessage: ''
    })


    const handleChange = (e) => {
        setFormData(data => (
            {
            ...data,
            [e.target.name]: e.target.value
            }
        ))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuccess("")
        if(!formData.blogHeader && !formData.blogMessage) {
          setError('Du måste ange alla fälten')
          return
        }
        if(!formData.blogHeader) {
            setError('Du måste ange en titel')
            return
        }
        if(!formData.blogMessage) {
            setError('Du måste ange ett meddelande')
            return
        }
        setError('')


        const blogPost= {
            header: DOMPurify.sanitize(formData.blogHeader, {ALLOWED_TAGS: ['b', 'i']}),
            message: DOMPurify.sanitize(formData.blogMessage, {ALLOWED_TAGS: ['b', 'i']})
        }

        try {

            setSiteLoading(true)
            axios.post(`https://localhost:7287/api/Messages/postMessage`, JSON.stringify(blogPost),{ headers: {
                "Content-Type": `application/json`,
                "Authorization": `Bearer ${userToken}`}}).then(res => {
                console.log(res);
                console.log(res.data);
                if (res.status === 200) {
                    setSuccess("Inlägg postades utan problem")
                    setError("")
                    setSiteLoading(false)   
                    e.target.blogHeader.value = null
                    e.target.blogMessage.value = null
                    formData.blogHeader = null
                    formData.blogMessage = null

                }
                else {
                    setSuccess("")
                    setError("Någonting gick fel")
                    setSiteLoading(false)   

                }
            })
        }

        catch(err){
            setError(`Något gick fel ${err}`)
            setSiteLoading(false)   

        }
    
    }



    
    return (

        <div className='upload-post-container'>
            
            {!isAuthenticated &&
          <div className='not-autenticated-container'>
          <h2 className='h2-auth-error'>Logga in för att kunna skriva blogginlägg</h2>
          <button className='error-signin-button' onClick={loginWithRedirect}>Logga In</button>
        </div>

            }
            
        {siteLoading && <> <LoadingSpin /> </> }
            
            
            {isAuthenticated && <>

                <h1>Skriv blogginlägg</h1>
                <form className="blog-form" onSubmit={handleSubmit}>

                <div className='input-group'>
                    <label htmlFor="blogHeader">Titel</label>
                    <input name='blogHeader' type="text" id='blogHeader' onChange={handleChange} />
                </div>
                <div className='input-group'>
                    <label htmlFor="blogMessage">Meddelande</label>
                    <textarea name="blogMessage" id="blogMessage" cols="30" rows="10" onChange={handleChange}></textarea>
                </div>
                <p className='error-message'>{error}</p>
                <p className='success-message'>{success}</p>

                <button>Posta inlägg</button>

                </form>

                </>
            }
        </div>
    )
}
  
  export default UploadPost