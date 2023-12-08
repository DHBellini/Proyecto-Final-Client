import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import validate from './validate';
import LabelAndInput from '../labelAndInput/LabelAndInput';
import s from './create.module.css';

const URL = 'https://quirkz.up.railway.app';
// const URL = "http://localhost:3001"


const CreateUserForm = () => {
  const [input, setInput] = useState({
    username: '',
    password: '',
    passwordRep: '',
    email: '',
    profile_picture: 'https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg',
    member: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    passwordRep: '',
    email: '',
  });

  const mostrarAlerta = (iconType, msjText) => {
    Swal.fire({
      icon: iconType,
      title: '',
      text: msjText,
    });
  };

  const formHandler = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
    setErrors(
      validate({
        ...input,
        [event.target.name]: event.target.value,
      })
    );
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const long = Object.values(errors);
      if (long.length === 0) {
        await axios.post(`${URL}/user`, input);
        mostrarAlerta('success', 'El usuario se creó de manera exitosa');
        setInput({
          username: '',
          password: '',
          passwordRep: '',
          email: '',
          profile_picture: '',
          member: '',
        });
      } else mostrarAlerta('error', 'Debe llenar todos los campos sin errores');
    } catch (error) {
      console.log(error);
      mostrarAlerta('error', error.response.data);
    }
  };

  return (
    <div className={s.form__container}>
      <form className={`${s.form} ${s['s-form']}`} onSubmit={submitHandler}>
        <fieldset>
          <legend>Crear Usuario</legend>

          <LabelAndInput
            label="Email*"
            type="text"
            name="email"
            value={input.email}
            handler={formHandler}
          />
          {errors.email && <p>{errors.email}</p>}

          <LabelAndInput
            label="Contraseña*"
            type="password"
            name="password"
            value={input.password}
            handler={formHandler}
          />
          {errors.password && <p>{errors.password}</p>}
          <LabelAndInput
            label="Confirmación Contraseña*"
            type="password"
            name="passwordRep"
            value={input.passwordRep}
            handler={formHandler}
          />
          {errors.passwordRep && <p>{errors.passwordRep}</p>}
          <span>*Obligatorios</span>
          <button type="submit">Crear</button>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateUserForm;