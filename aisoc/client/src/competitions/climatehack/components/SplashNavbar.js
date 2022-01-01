import { Link } from 'react-router-dom';
import './SplashNavbar.scss';

export default function SplashNavbar({ baseUrl }) {
  return <nav className="ch-navbar">
    <Link to={baseUrl} className='ch-navbar-title'>Climate<span>Hack</span></Link>
    {/* <a href={baseUrl} className='ch-navbar-home'>Home</a> */}
    <Link to={`${baseUrl}challenge`}>The Challenge</Link>
    <Link to="#">Our Partners</Link>
    <Link to={`${baseUrl}compete`} className='ch-navbar-active'>Compete on Doxa</Link>
    {/* <button style="padding: 0.8rem 1rem;border-radius: 3px;border: 0;color: #fff;background-color: #09f;">Compete on Doxa</button> */}
  </nav>;
}
