import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

const UploadPictures = () => {
  
  
    const {isAuthenticated, loginWithRedirect, getAccessTokenSilently, user} = useAuth0()
    const domain = process.env.REACT_APP_AUTH0_DOMAIN
    const [userToken, setUserToken] = useState([])


    useEffect(() => {
        const getUserToken = async () => {
      
            try {
              const accessToken = await getAccessTokenSilently({
                audience: `https://${domain}/api/v2/`,
              });
              setUserToken(accessToken)
              
            } catch (e) {
              console.log(e.message)

            }       
          };
           
        getUserToken();
    }, [getAccessTokenSilently, user?.sub]);
  
    
      
    const [profilePicture, setProfilePicture] = useState([])
    const [profileError, setProfileError] = useState("")
    const [profileSuccess, setProfileSuccess] = useState("")
    const [profileBtnDisabled, setProfileBtnDisabled] = useState(true)
    


    const handlePofileChange = async (e) => {
        const file = e.target.files[0]
        const filetype = file.type
        console.log(filetype)
        if(String(file.type) === "image/png" || String(file.type) === "image/jpg" || String(file.type) === "image/jpeg"){
            setProfileError("")
            setProfileSuccess("")
            setProfileBtnDisabled(false)
        }
        else{
            setProfileError("Felaktigt filformat, endast .jpg och .png är tillåtet")
            setProfileSuccess("")
            setProfileBtnDisabled(true)
        }

        setProfilePicture(file)
    }
  


    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        let file = e.target[0].files[0]
        let filename = file.name
        const id = user.sub

        const formData = new FormData()
        formData.append("Userid", id)
        formData.append("ImageName", filename)
        formData.append("ImageFile", file)



        await axios.post(`https://localhost:7287/api/UserImage/post`, 
        formData,
        { headers: {
            "Content-Type": `multipart/form-data`,
            "Authorization": `Bearer ${userToken}`}
        }).then(res => {
            console.log({res});
            console.log(res.data);
            if (res.status === 200) {
                setProfileSuccess("Ny profilbild har laddats upp")
                setProfileError("")

            }
            else {
                setProfileSuccess("")
                setProfileError("Någonting gick fel")
            }
        })



    }





    return (
    <>
        
        {!isAuthenticated &&
          <div className='not-autenticated-container'>
          <h2 className='h2-auth-error'>Logga in för att kunna ladda upp bilder</h2>
          <button className='error-signin-button' onClick={loginWithRedirect}>Logga In</button>
        </div>

        }

        {isAuthenticated && <>
        
            <div className='upload-pictures-container'>
                
                
                <form className="upload-profile-container" onSubmit={handleProfileSubmit}>
                    <div className="picture-container">
                        <p>Välj en profilbild:</p>
                        <input name='profilePic' type="file" accept='.png, .jpg' onChange={handlePofileChange}/>
                    </div>
                    <div className="upload-btn-container">
                        <button disabled={profileBtnDisabled} className='upload-picture-btn'>Ladda upp profilbild</button>
                        <small className='profileError'>{profileError}</small>
                        <small className='profileSuccess'>{profileSuccess}</small>
                    </div>
                </form>

            </div>
        </>
        }




    </>
  )

}

export default UploadPictures