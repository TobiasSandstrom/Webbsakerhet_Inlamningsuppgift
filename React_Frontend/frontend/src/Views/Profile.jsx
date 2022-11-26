import {useState, useEffect} from 'react'
import img from "../images/placeholder.jpg"
import banner from "../images/banner-placeholder.jpg"
import { useAuth0 } from '@auth0/auth0-react'
import { NavLink } from 'react-router-dom'
import LoadingSpin from '../components/LoadingSpin'
import axios from 'axios'


const Profile = () => {

    const {isAuthenticated, loginWithRedirect, getAccessTokenSilently, user} = useAuth0()
    const [profilePic, setProfilePic] = useState([])
    const [token, setToken] = useState("")

    const [hasPicture, setHasPicture] = useState(false)
    const [siteLoading, setSiteLoading] = useState(true)
    let _name = user.name
    let _email = user.email
    const domain = process.env.REACT_APP_AUTH0_DOMAIN


    useEffect(() => {
        const getUserProfilePicture = async () => {
            try {

                const accessToken = await getAccessTokenSilently({
                audience: `https://${domain}/api/v2/`,
                });
                setToken(accessToken)
                let id = user.sub


                await axios.get(`https://localhost:7287/api/UserImage/get/${id}`,
                { headers: {
                    "Content-Type": `application/json`,
                    "Authorization": `Bearer ${accessToken}`}
                }).then(res => {
                    
                    if(res.status === 200){

                        setProfilePic(res.data.imageSource)
                        setHasPicture(true)
                        
                    }
                    else{
                        setHasPicture(false)
                    }
                    
                })
                setSiteLoading(false)
            }
            


            catch(err){

                setSiteLoading(false)
            }
        };
        getUserProfilePicture()
    },[]);
  


    const deleteProfilePicture = async () => {

        try{
            setSiteLoading(true)
            let id = user.sub
            await axios.delete(`https://localhost:7287/api/UserImage/delete/${id}`,
            { headers: {
                "Content-Type": `application/json`,
                "Authorization": `Bearer ${token}`}
            }).then(res => {
                
                if(res.status === 200){
                    
                    setHasPicture(false)
                    
                }
                else{
                    console.log("404")
                }
                setSiteLoading(false)
            })

        }
        catch(err)
        {

        }

    }

    return (
    <div className='profile-container'>

        
        
        {!isAuthenticated && 
            <div className='not-autenticated-container'>
                <h2 className='h2-auth-error'>Logga in för att kunna se din profil</h2>
                <button className='error-signin-button' onClick={loginWithRedirect}>Logga In</button>
            </div>
        }
        

        {siteLoading && <> <LoadingSpin /> </> }
        
        {isAuthenticated && <>


            <div className="profile-banner">
                <img className='profile-banner-img' src={banner} alt="" />
            </div>
            
            
            
            <div className="profile-info">
                
                <div className="profile-img-container">

                {!hasPicture && <>
                    <img className='profile-img' src={img} alt="aa" />
                    <small><NavLink className="profile-link" to="/upload-pictures">Välj Profilbild</NavLink></small>
                    
                    </>
                }
                {hasPicture && <>
                    <img className='profile-img' src={profilePic} alt="bb" />
                    <small><NavLink className="profile-link" to="/upload-pictures">Välj ny Profilbild</NavLink></small>
                    <small><NavLink className="profile-link" onClick={deleteProfilePicture}>Ta bort Profilbild</NavLink></small>
                    </>
                }


                </div>
                
                <div className="profile-text">

                    <p>{_name}</p>
                    <p>{_email}</p>

                </div>

            </div>

            </>
        }

    </div>
  )
}

export default Profile