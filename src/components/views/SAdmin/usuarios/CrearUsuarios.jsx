import React from 'react'

import  crypot from 'crypto';

// servicios
import {ApiLogin} from '../../../services/apiLogin'
// librerias
import axios from 'axios'

import NavSAdmin from '../../../functional/navigation/NavSAdmin'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

class CrearUsuario extends React.Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '1'){
        }else{
            this.props.history.push('/')
        }
    }

    state = {
        form:{
            'nombreUsuario': '',
            'correoUsuario': '',
            'claveUsuario': '',
            'tipoUsuario': '',
            'idtipoSesion': '1',
            'telefonoUsuario': '',
            'tocken': localStorage.getItem('tocken')
        },
        valContraseña:'',
        error:false,
        errorMSG:''
    }


    manejadorSubmit = e =>{
        e.preventDefault()
    }
  
    manejadorChange = async e =>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
        //console.log(this.state.form)
    }

    manejadorChangeVal = async e =>{
        await this.setState({
            valContraseña:{
                ...this.state.valContraseña,
                [e.target.name]: e.target.value
            }
        })
        //console.log(this.state.valContraseña.userPass)
    }

    manejadorBoton = async (res)=>{
        if(this.state.valContraseña.userPass === this.state.form.claveUsuario){
            // encriptacion de contraseña
            var passEncrip
            var hash = crypot.createHash('sha256')
            var hash2 = crypot.createHash('sha256')
            var data
            var data2
            var text
            data = hash.update(this.state.form.claveUsuario)
            text = data.digest('base64') + 'hola'
            data2 = hash2.update(text)
            passEncrip = data2.digest('base64')
            //this.state.form.clave = passEncrip
            await this.setState({
                 form:{
                     ...this.state.form,
                     claveUsuario:passEncrip
                 }
            })

            console.log("Formulario: " + passEncrip)
            console.log(this.state.form)

            //envio de datos a api
            let url = ApiLogin + '/crearUsuario'
            axios.post(url, this.state.form)
            .then( response =>{
                if(response.data.crearUsuario === true){
                    this.props.history.push('/usuarios')
                }else{
                    this.setState({
                        error: true,
                        errorMSG: response.data.crearUsuario
                    })
                }
            }).catch(error =>{
                console.log(error)
                this.setState({
                    error: true,
                    errorMSG: 'No se puede comunicar con el servidor'
                })
            })
        }else{
            this.setState({
                error: true,
                errorMSG: 'Error!!!, contraseñas diferentes'
            })
        }
    }

    render(){
        return(
            <>
                <NavSAdmin />

                <div className="container text-left">
                <h1>Crear Usuario</h1>

                    {this.state.error === true &&
                        <div id="error" className="alert alert-danger ocultar">
                            {this.state.errorMSG}
                        </div>
                    }
                
                    <form onSubmit={this.manejadorSubmit} method="POST" id='formUser'>
                        <div className="mb-3">
                        <label className="labelCorreo">Nombre</label>
                        <input type="text" className="form-control" id="nombreUsuario" name="nombreUsuario" aria-describedby="emailHelp" required  onChange={this.manejadorChange}/>
                        </div>
                        <div className="mb-3">
                            <label className="labelCorreo">Correo</label>
                            <input type="email" className="form-control" id="correoUsuario" name="correoUsuario" aria-describedby="emailHelp" required  onChange={this.manejadorChange}/>
                        </div>
                        <div className="mb-3">
                            <label className="labelClave">Clave</label>
                            <input type="password" className="form-control" id="claveUsuario" name="claveUsuario" required  onChange={this.manejadorChange}/>
                        </div>
                        <div className="mb-3">
                            <label className="lclaveUsuarioConfir">Confirmar clave</label>
                            <input type="password" className="form-control" id="claveUsuarioConfir" name="userPass" required  onChange={this.manejadorChangeVal}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tipo usuario:      </label>
                            <select className="form-select" aria-label="Default select example" name="tipoUsuario" required onChange={this.manejadorChange} defaultValue="">
                                <option value="">Selecione</option>
                                <option value="1">Super Administrador</option>
                                <option value="2">Administrador de eventos</option>
                                <option value="3">Ventanilla</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-light" id="iniciarSesion" onClick={this.manejadorBoton}>Guardar</button>
                    </form>
                </div>

                <FooterSA />
            </> 
        ) 
    }
}

export default CrearUsuario
