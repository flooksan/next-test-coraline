import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import { useState } from "react";
import Swal from "sweetalert2";




export default function Register () {
  const router = useRouter();
  const [username, setUsername] =useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword] =useState('')

  const handleOnClick = async (e) => {
    e.preventDefault()
    
    try {
      const res = await axios.post('/api/register', {username, email, password} )
      

      if(res.status == 201) {
        Swal.fire({
          icon: 'success',
          title: res.data.message,
          timer:2000,
          showConfirmButton: false,
        })
        setTimeout(
          () => { router.push('/') }, 2000
        )
        
        
      } 
      console.log(res)

    } catch (error) {
      console.log(error.response)
      if(error.response.status == 400) {
        Swal.fire({
          title: error.response.data.message,
          icon: 'error',
        }
        )
      }
    }
    
  }


  return (
    <div className="form-signin w-50 m-auto">
    <Head>
        <title>Register</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></link>
    </Head>
    <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></Script>

      <h1 className="register__header"> Registration Page</h1>
      <form className="form-control" onSubmit={handleOnClick}>

      <div className="form-floating">
      <input 
            type="text" name="username" className="form-control" 
            id="floatingInput"  placeholder="name"  
            value={username} onChange={(e) => setUsername(e.target.value)}
      />
        <label htmlFor="floatingInput">Username</label>
     </div>  
        
        <br/>

      <div className="form-floating">
      <input 
            type="email" name="email" className="form-control" 
            id="floatingInput"  placeholder="name@example.com"  
            value={email} onChange={(e) => setEmail(e.target.value)}
      />
        <label htmlFor="floatingInput">Email address</label>
     </div>    
             
        <br/>
        
        <div className="form-floating">
        <input 
            type="password" name="password" className="form-control" 
            id="floatingInput"  placeholder="123456"  
            value={password} onChange={(e) => setPassword(e.target.value)}
      />
            <label htmlFor="floatingPassword">Password</label>
        </div>
        
        <div className="form__container">
            
            <input type="submit" value="Register" className="w-50 btn btn-sm btn-success mt-3"/>
            <Link className="w-50 btn btn-sm btn-primary mt-3  " href="/">homepage</Link>
        </div>
        

      </form>

      
      
    </div>
  )
}