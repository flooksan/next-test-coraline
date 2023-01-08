import { useEffect } from "react"
import connect from "../lib/mongodb"
import cookie from 'js-cookie'



export default function register () {
  
  return (
    <div>
      <h1> Registration </h1>
      <form action="/api/register" method="post">
        <label>
          Email Address : 
        </label>
        <input type="email" name="email" placeholder="Type your email"></input>
        <br/>
        <label>
          Password :
        </label>
        <input type="password" name="password" placeholder="Type your password"></input>
        <input type="submit" value="Register"/>

      </form>

      <h1> Login </h1>
      <form action="/api/login" method="post" >
        <label>
          Email Address :
        </label>
        <input type="email" name="email" placeholder="Type your email"></input>
        <br/>
        <label>
          Password :
        </label>
        <input type="password" name="password" placeholder="Type your password"></input>
        <input type="submit" value="Login"/>

      </form>

    </div>
  )
}