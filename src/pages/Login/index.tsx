import { useState } from "react";

interface Props {
  onloginReload?: () => any;
}

const API_URL = import.meta.env.VITE_API_URL

function Login({ onloginReload }: Props) {
  const [loginEmail, setLoginEmail] = useState<string>('')
  const [loginPassword, setLoginPassword] = useState<string>('')
  const [registerEmail, setRegisterEmail] = useState<string>('')
  const [registerPassword, setRegisterPassword] = useState<string>('')

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        "Accept":"application/json", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
      mode: 'cors',
    })

    const data = await res.json()
    console.log(data, 'ddd')

    if (data.status !== 200) {
      alert(data.message)
      return
    }

    alert('login success')
    localStorage.setItem('user', JSON.stringify(data.data))

    onloginReload && onloginReload()
  }

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        "Accept":"application/json", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
      }),
      mode: 'cors',
    })

    const data = await res.json()
    console.log(data, 'ddd')

    if (data.status !== 200) {
      alert(data.message)
      return
    }

    alert(`resister success`)
  }

  return (<>
    <h2>Login</h2>
    <form>
      <input
        type="email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        placeholder="your@email.com"
      />
      <input
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="password"
      />
      <button type="submit" onClick={(e) => handleLogin(e)}>Login</button>
    </form>

    <h2>Register</h2>
    <form>
      <input
        type="email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
        placeholder="your@email.com"
      />
      <input
        type="password"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
        placeholder="password"
      />
      <button type="submit" onClick={(e) => handleRegister(e)}>Register</button>
    </form>
  </>)
}

export default Login
