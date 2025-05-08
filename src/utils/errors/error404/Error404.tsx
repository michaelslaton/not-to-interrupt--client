import { useNavigate } from 'react-router-dom';
import './error404.css';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className='error404__container'>
      <div className='error404__wrapper'>
        <div className='error404__title-wrapper'>
          <div className='error404__title'>
            404
          </div>
          <div className='error404__text'>
            Not Found
          </div>
        </div>
        <div className='error404__links-wrapper'>
          <button
            className='error404-link'
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
          <button
            className='error404-link'
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404;
