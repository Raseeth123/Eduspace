import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
  return (
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover draggable theme="light" style={{ maxWidth: '300px', width: '300px', margin: '20px',color:'black' }}/>
  );
};

export default Toast;