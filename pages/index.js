import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
 


export default function Login () {
  const router = useRouter();
  const [email, setEmail]= useState('')
  const [password, setPassword] =useState('')
  


  
  const handleOnClick = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/login', {email, password} )
      

      if(res.status == 200) {
        Swal.fire({
          icon: 'success',
          title: 'Login success!!',
          timer:2000,
          showConfirmButton: false,
        })
        setTimeout(
          () => { router.push('/homepage') }, 2000
        )
        
        
      } 
      console.log(res)

    } catch (error) {
      console.log(error.response)
      if(error.response.status == 401) {
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
        <title>Login</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></link>
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></Script>

      <h1 className="index__header"> Login Page </h1>
      
      <form  className="form-control" onSubmit={handleOnClick}>


        <div className="form-floating">
          <input 
            type="email" name="email" className="form-control" 
            id="floatingInput"  placeholder="name@example.com"  
            value={email} onChange={(e) => setEmail(e.target.value)}
            />
          <label htmlFor="floatingInput">Email address</label>
        </div>



        <br />

        <div className="form-floating">
          <input 
            type="password" name="password" className="form-control" 
            id="floatingPassword" placeholder="123456" 
            value={password} onChange={(e) => setPassword(e.target.value)}
            />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="text-center">

          <Link className="w-50  m-1 text-center" href="/register">new user? create new account </Link>
        </div>
        <div>
          <input type="submit" value="Login"  className="w-100 btn btn-sm btn-primary mt-3" />
        </div>



      </form>



    </div>

    
  )
}