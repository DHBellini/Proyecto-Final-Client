import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { gapi } from 'gapi-script';
import { Link, useNavigate } from 'react-router-dom';
import style from './login.module.css';
import FB from '../../assets/facebook.png';
import GL from '../../assets/google.png';
import GL2 from '../../assets/google2.png';
import INS from '../../assets/instagram.png';
import EML from '../../assets/email.png';
import pss from '../../assets/cerrar-con-llave.png';
import SocialLogin from '../SocialLogin/SocialLogin'

const URL="https://quirkz.up.railway.app"
const Login = ({ setLogin, login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const darkMode = useSelector((state) => state.darkMode);
  const [seHizoClicEnBotonGoogle, setSeHizoClicEnBotonGoogle] = useState(false);
  const [isGoogleButtonHovered, setIsGoogleButtonHovered] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  const validateField = (name, value) => {
    let fieldError = '';

    if (name === 'email') {
      if (!isEmailValid.test(value)) {
        fieldError = 'Por favor, ingrese un correo electrónico válido.';
      }
      setEmailError(fieldError);
    } else if (name === 'password') {
      if (!isPasswordValid.test(value)) {
        fieldError =
          'La contraseña debe contener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número.';
      }
      setPasswordError(fieldError);
    }
    return fieldError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo '${name}' cambió a: ${value}`);
    validateField(name, value);

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailFieldError = validateField('email', email);
    const passwordFieldError = validateField('password', password);

    if (emailFieldError || passwordFieldError) {
      return;
    }

    try {
      const response = await axios(
        `${URL}/user/login/?email=${usuario}&password=${contraseña}`
      );

      setLogin(response.data);
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setLoginError('Credenciales incorrectas');
    }
  };

  const onSuccessGoogle = async (response) => {
    const userObject = {
      access: true,
      email: response.profileObj.email,
      photo: response.profileObj.imageUrl,
      username: response.profileObj.name,
    };
    try {
      const { data } = await axios.get(
        `${URL}/user/${userObject.email}`
      );

      if (data) {
        console.log('Ya existe');
        setLogin({
          access: true,
          email: data.email,
          photo: data.profile_picture,
        });
      } else {
        const respuesta = await axios.post(`${URL}/user`, {
          email: userObject.email,
          profile_picture: userObject.photo,
          password: 123456,
          username: userObject.username,
        });

        setLogin({
          access: true,
          email: respuesta.data.email,
          photo: respuesta.data.profile_picture,
        });
      }
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
    }
  };

  const onFailureGoogle = (response) => {
    console.log(response);
  };

  const responseFacebook = async (response) => {
    const { data } = await axios.get(
      `${URL}/user/${response.email}`
    );

    if (data) {
      setLogin({
        access: true,
        email: data.email,
        photo: data.profile_picture,
      });

    }else {
      const respuesta = await axios.post(`${URL}/user`, {

        email: response.email,
        profile_picture: response.picture.data.url,
        password: 123456,
        username: response.name,
      });

      setLogin({
        access: true,
        email: respuesta.data.email,
        photo: respuesta.data.profile_picture,
      });
    }

    const userObject = {
      access: true,
      email: response.email,
      photo: response.picture.data.url,
    };
    setLogin(userObject);
  };

  useEffect(() => {
    const start = () => {
      gapi.auth2.init({
        clientId: clientIdGoogle,
      });
    };

    console.log('Login object:', login);

    if (login && login.access) navigate('/');

    gapi.load('client:auth2', start);
  }, [login, navigate]);

  return (
    
    <div className={`${style.container_from} ${darkMode ? style.darkMode : style.lightMode}`}>
      
      <div className={`${style.information} ${darkMode ? style.darkMode : style.lightMode}`}>
        <div className={style.info_childs}>
          <h2 className={darkMode ? style.darkMode : style.lightMode}>Bienvenido</h2>
          <p>
            ¡Bienvenido a nuestra tienda en línea! 🛍️ Descubre una experiencia de compra única y exclusiva. Regístrate
            ahora para acceder a ofertas especiales, descuentos personalizados y recibir las últimas novedades antes que
            nadie. ¡No te pierdas la oportunidad de ser parte de nuestra comunidad de compradores felices! Regístrate hoy
            y deja que la moda y la conveniencia lleguen directamente a tu puerta. ¡Únete a nosotros y haz que cada
            compra sea una experiencia inolvidable! 💻📦
          </p>
          <Link to={`/createuser`}>
            {' '}
            <input type="button" value="registrate" />
          </Link>
        </div>
      </div>
      
      <div className={style.from_information}>
        <div className={style.infor_childs}>
          <h2>Inicia Sesión</h2>
          <div className={style.icons}>
            
            <i className={style.bx}>
            
            </i>
          </div>
          <p>o usa tu email para iniciar sesión</p>
          <form className={`${style.form} ${darkMode ? style.darkMode : style.lightMode}`} onSubmit={handleSubmit}>
            <div className={style.tamaño}>
              <label>
                <i className={style.bx}>
                  <img className={style.bx_email} src={EML} alt="Email" />
                </i>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </label>
            </div>
            {emailError && <p className={style.error}>{emailError}</p>}
            <div className={style.tamaño}>
              <label>
                <i className={style.bx}>
                  <img className={style.bx_contra} src={pss} alt="contraseña" />
                </i>
                <input
                  type="password"
                  placeholder="Contraseña"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </label>
            </div>
            {passwordError && <p className={style.error}>{passwordError}</p>}
            <div className={style.olvidar}>
              <Link to={``}>
                <p>¿olvidaste tu contraseña?</p>
              </Link>
            </div>
            <input type="submit" value="Iniciar sesión" />
            {loginError && <p className={style.error}>{loginError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
