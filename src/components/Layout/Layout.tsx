import { Outlet } from 'react-router'
import './layout.css'

function Layout () {
  return (<>
    <div className='nav'>
      <a href="/">Chart</a>
      <a href="/aution">Aution</a>
    </div>
    <Outlet />
  </>)
}

export default Layout
