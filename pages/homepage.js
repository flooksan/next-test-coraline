import cookie from "js-cookie"
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import Script from "next/script";

export default function Homepage(props){
    // console.log(props)
    const {token} = props;
    
    // Token Check 
    

    const[userData, setUserData] = useState([]);
    const[isLoading, setIsLoading] =useState(false);
    

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

        <div className="card text-center">
            <Head>
                <title>Home Page</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></link>
            </Head>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></Script>
            
            <h1 className="text-center text-primary">Home Page</h1>
            <h2>Hello <span className="text-info">{userData.email}</span> you login <span className="text-info">{userData.loginCount}</span> time! </h2>
            <div>

                <Link className=" btn btn-sm btn-danger mt-3  " href="/api/logout">Logout</Link>
            </div>
        
        </div>
    )
}

export async function getServerSideProps({req , res}) {
    const token = req.cookies.token
    if(token) {
        return {
            props: {
                token
            }
        };
    } else {
        //  redirect to login
   
    }

    
}