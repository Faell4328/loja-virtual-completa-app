import { Link } from 'react-router';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout(){
    return(
        <>
            <ToastContainer autoClose={3000} />
            <Link to='/'>Ir para home</Link>
            <hr />
            <Outlet />
        </>
    )
};