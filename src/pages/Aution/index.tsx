import { useEffect, useState } from "react"

import Login from '../Login'

const API_URL = import.meta.env.VITE_API_URL

function Aution() {
  const [userStorage, setUserStorage] = useState<string>('noloaded')
  const [loginReload, setLoginReload] = useState<number>(0)
  const [autionInfo, setAutionInfo] = useState<any>(null)
  const [amount, setAmount] = useState<string>('')

  useEffect(() => {
    const userStored = localStorage.getItem('user')
    setUserStorage(userStored || '')
  }, [loginReload])

  useEffect(() => {
    if (!userStorage || userStorage === 'noloaded') {
      return () => {}
    }

    const handleInterval = async () => {
      const res = await fetch(`${API_URL}/aution`)
      const data = await res.json()

      if (data.status !== 200) {
        setAutionInfo(null)
        return
      }

      setAutionInfo(data.data)
    }

    const interval = setInterval(handleInterval, 3000)
    handleInterval()

    return () => {
      clearInterval(interval)
    }
  }, [userStorage])

  if (userStorage === 'noloaded') {
    return (<>
      <h2>Aution</h2>
    </>)
  }

  const user = userStorage && JSON.parse(userStorage)

  const handleNewAution = async (e: React.MouseEvent) => {
    if (!user) {
      return
    }

    fetch(`${API_URL}/aution/create`, {
      method: 'POST',
      headers: {
        token: user.token,
        "Accept":"application/json", 
        "Content-Type": "application/json",
      },
      mode: 'cors',
    })
  }

  const handleAution = async (e: React.MouseEvent) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/aution`, {
      method: 'POST',
      headers: {
        token: user.token,
        "Accept":"application/json", 
        "Content-Type": "application/json",
      },
      mode: 'cors',
      body: JSON.stringify({ amount: parseInt(amount) })
    })

    const data = await res.json()

    if (data.status !== 200) {
      alert(data.message)
      return
    }

    alert('aution success')
  }

  if (!user) {
    return <Login onloginReload={() => setLoginReload(loginReload + 1)} />
  }

  return (<>
    <h2>Aution</h2>
    <div>User: {user.email}</div>
    <div>
      <button onClick={handleNewAution}>new aution</button>
    </div>
    <div>
      {autionInfo && <>
        <h3>Aution: {autionInfo.name}</h3>

        <table width={350}>
          <tbody>
            <tr>
              <td>current price</td>
              <td>{autionInfo.current_price}</td>
            </tr>
            <tr>
              <td>current email</td>
              <td>{autionInfo.current_email || 'null'}</td>
            </tr>
            <tr>
              <td>end time</td>
              <td>{new Date(autionInfo.end_time).toLocaleTimeString()}</td>
            </tr>
          </tbody>
        </table>

        <br />

        <form>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={autionInfo.current_price + autionInfo.price_step}
          />
          <button type="submit" onClick={(e) => handleAution(e)}>aution</button>
        </form>
      </>}
    </div>
  </>)
}

export default Aution
