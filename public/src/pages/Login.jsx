import '../assets/login.css'
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  })
  useEffect(() => {
    if (localStorage.getItem('authUser')) {
      navigate("/admin");
    }
  }, [])
  
  const toastOptions = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }
  
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const handleValidation = () => {
    const inputemail = document.getElementById('email');
    const inputpassword = document.getElementById('password');
    const inputs = [ inputemail, inputpassword ];
    const {password,email} = values;
    if (password==='' || email==='') {
      inputs.forEach((input) => {
        if (input.value==='') {
          input.style.border = "2px solid red";
        }else{
          input.style.border = "2px solid #cccccc";
        }
      });
      toast.error("Debe completar todos los datos", toastOptions)
      return false;
    }else{
      inputs.forEach((input) => {
        input.style.border = "2px solid #cccccc";
      });
      return true;
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()){
      const { email, password } = values;
      const { data } = await axios.post(loginRoute, {
        email,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      }
      if (data.status === true) {
        delete data.user.password
        localStorage.setItem('authUser', JSON.stringify(data.user))
        navigate("/admin");
      }
    }
  }
  return (
    <>
    <div className="loginContainer">
      <div className="loginBox">
        <h3>Inicie Sesion</h3>
        <form onSubmit={(event) => handleSubmit(event)}>
          <input type="email" placeholder='Correo' name='email' id='email' onChange={(e)=>handleChange(e)}/>
          <input type="password" placeholder='Contraseña' name='password' id='password' onChange={(e)=>handleChange(e)}/>
          <button type="Submit">Iniciar</button>
        </form>
      </div>
    </div>
    <ToastContainer/>
    </>
  )
}
