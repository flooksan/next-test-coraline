import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

export default function Register () {
  
  return (
    <div className="form-signin w-50 m-auto">
    <Head>
        <title>Register</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></link>
    </Head>
    <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></Script>

      <h1 className="text-center text-primary"> Registration Page</h1>
      <form action="/api/register" method="post" className="form-control">

      <div class="form-floating">
        <input type="email" name="email" class="form-control" id="floatingInput" placeholder="name@example.com"/>
        <label htmlFor="floatingInput">Email address</label>
     </div>
        
        
        
        <br/>

        <div class="form-floating">
        <input type="password" name="password" class="form-control" id="floatingPassword" placeholder="name@example.com"/>
        <label htmlFor="floatingPassword">Password</label>
     </div>
        
        <div>
            <input type="submit" value="Register" className="w-50 btn btn-sm btn-primary mt-3"/>
            <Link className="w-50 btn btn-sm btn-danger mt-3  " href="/">Cancle</Link>
        </div>
        
        

      </form>

      
      
    </div>
  )
}