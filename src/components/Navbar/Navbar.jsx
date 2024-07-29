import logo from '../../../public/logo.jpg'
import './navbar.less'

function Navbar () {
    return (
        <div className='navbar-wrapper'>
            <div className='logo'>
                <img src={logo} alt='logo' />
                Shufuny
            </div>
        </div>
    )
}

export default Navbar
