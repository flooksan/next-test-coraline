import cookie from "js-cookie"
import axios from "axios";
import { useEffect, useState } from "react";

export default function Homepage(props){
    // console.log(props)
    const {token} = props;

    const[userData, setUserData] = useState([]);
    const[isLoading, setIsLoading] =useState(false);

    console.log("Data : ", userData);

    useEffect(()=> {
        setIsLoading(true)
        axios.get("/api/userdata" , { params: {token} })
        .then((res) =>{

            if(res) {
                setUserData(res.data)
                setIsLoading(false)
                console.log("Success!")
            }
                
        }).catch((err) => {
            // throw new Error(err)
            console.log(err)
            
        })
    },[])

    if(isLoading || userData.length === 0) {
        return <p>Loading...</p>
    }

    
    return(
        <>

            <h1>Home Page</h1>
            <h2>Hello {userData.email} you login {userData.loginCount} time! </h2>
            
        
        </>
    )
}

export async function getServerSideProps({req , res}) {
    
    return {
        props: {
            token: req.cookies.token
        }
    };
}