import { Component } from "react";

import NavSAdmin from '../../functional/navigation/NavSAdmin'
import NavAdminEvent from '../../functional/navigation/navAdminEvent/NavAdminEvent'
import NavValEntradas from '../../functional/navigation/navValEntradas/NavValidadorEntradas'
import NavClient from '../../functional/navigation/navCliente/NavCliente'
import FooterSA from '../SAdmin/footerSAdmin/FooterSAdmin'

import  crypot from 'crypto';
import {ApiLogin} from '../../services/apiLogin'
import axios from 'axios'

class MiPerfilSAdmin extends Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0){
        }else{
            this.props.history.push('/')
        }
    }
    state = {
        usuarioPorCorreo:{
            'nombre_usuario': '',
            'correo_usuario': '',
            'clave_usuario': '',
            'tipo_usuario': '',
            'idtipoSesion':1,
            'telefonoUsuario': ''
        },

        form:[
            {'clave_usuario': '',}
        ],
        valContraseña:''
    }

    manejadorSubmit = e =>{
        e.preventDefault()
    }
  
    manejadorChange = async e =>{
        await this.setState({
            usuarioPorCorreo:{
                ...this.state.usuarioPorCorreo,
                [e.target.name]: e.target.value
            }
        })
    }

    manejadorChangeVal = async e =>{
        await this.setState({
            valContraseña:e.target.value
        })
    }

    manejadorBotonEditar = async (res)=>{
        var validarClave = false

        // para guardar los datos 

        if(this.state.form.clave_usuario !== this.state.usuarioPorCorreo.clave_usuario){
            validarClave = true
        }

        if(this.state.valContraseña === this.state.usuarioPorCorreo.clave_usuario){

            if(validarClave){
                // encriptacion de contraseña
                var passEncrip
                var hash = crypot.createHash('sha256')
                var hash2 = crypot.createHash('sha256')
                var data
                var data2
                var text
                data = hash.update(this.state.usuarioPorCorreo.clave_usuario)
                text = data.digest('base64') + 'hola'
                data2 = hash2.update(text)
                passEncrip = data2.digest('base64')

                //this.state.usuarioPorCorreo.clave_usuario = passEncrip
                await this.setState({
                    usuarioPorCorreo:{
                        ...this.state.usuarioPorCorreo,
                        clave_usuario: passEncrip
                    }
                })
            }
            // envio de datos a api
            let url = ApiLogin + '/editarUsuario'
            const dataUser = {
                'nombreUsuario': this.state.usuarioPorCorreo.nombre_usuario,
                'correoUsuario': this.state.usuarioPorCorreo.correo_usuario,
                'claveUsuario': this.state.usuarioPorCorreo.clave_usuario,
                'tipoUsuario': localStorage.getItem('tipoUsuario'),
                'telefonoUsuario': this.state.usuarioPorCorreo.telefono_usuario
            }
            axios.post(url, dataUser)
            .then( response =>{
                if(response.data.editarUsuario === true){
                    //this.abrirCerrarModalInsertar()
                    this.setState({
                        success: true,
                        error: false,
                        errorMSG: 'Datos guardados correctamente'
                    })
                    this.componentDidMount()
                    console.log('Datos guardados correctamente')
                }else{
                    this.setState({
                        error: true,
                        success: false,
                        errorMSG: response.data.editarUsuario
                    })
                }
            }).catch(error =>{
                console.log(error)
                this.setState({
                    error: true,
                    success: false,
                    errorMSG: 'No se puede comunicar con el servidor'
                })
            })
        }else{
            this.setState({
                error: true,
                success: false,
                errorMSG: 'Error!!!, contraseñas diferentes'
            })
        }
    }

    componentDidMount(){
        let url = ApiLogin + '/usuarioPorCorreo'
        const data = {
            correoUsuario: localStorage.getItem('correoUsuario')
        }
        axios.post(url, data)
        .then( response =>{
            if(response.data){
                this.setState({
                    usuarioPorCorreo: response.data[0],
                    valContraseña: response.data[0].clave_usuario,
                    form:{
                        clave_usuario:response.data[0].clave_usuario
                    }
                })
                console.log(this.state.usuarioPorCorreo)
            }
        }).catch(error =>{
            console.log(error)
            this.setState({
                errorCarga: true,
                errorMSGCarga: 'No se puede comunicar con el servidor'
            })
        })
    }

    render(){
        return(
            <>
                {localStorage.getItem('tipoUsuario') === '1' &&
                    <NavSAdmin/>
                }
                {localStorage.getItem('tipoUsuario') === '2' &&
                    <NavAdminEvent/>
                }
                {localStorage.getItem('tipoUsuario') === '3' &&
                    <NavValEntradas/>
                }
                {localStorage.getItem('tipoUsuario') === '4' &&
                    <NavClient/>
                }
                <div className="container" style = {{minHeight:'700px'}}>
                {this.state.error === true &&
                        <div id="error" className="alert alert-danger ocultar">
                            {this.state.errorMSG}
                        </div>
                }
                {this.state.success === true &&
                    <div id="error" className="alert alert-success ocultar">
                        {this.state.errorMSG}
                    </div>
                }
                    <h1 className="pt-5"><b>Mi perfil</b> </h1>
                    <br/>
                    {localStorage.getItem('tipoSesion') !== '2' &&
                        <form onSubmit={this.manejadorSubmit} method="POST" id='formUser'>
                        <div className="mb-3">
                        <label className="labelCorreo">Nombre</label>
                        <input type="text" className="form-control" id="nombreUsuario" name="nombre_usuario" aria-describedby="emailHelp" required  onChange={this.manejadorChange} defaultValue={this.state.usuarioPorCorreo.nombre_usuario}/>
                        </div>
                        <div className="mb-3">
                            <label className="labelCorreo">Correo</label>
                            <input type="email" className="form-control" id="correoUsuario" name="correo_usuario" aria-describedby="emailHelp" required  onChange={this.manejadorChange} value={this.state.usuarioPorCorreo.correo_usuario} disabled/>
                        </div>
                        <div className="mb-3">
                            <label className="labelClave">Clave</label>
                            <input type="password" className="form-control" id="claveUsuario" name="clave_usuario" required  onChange={this.manejadorChange} defaultValue={this.state.usuarioPorCorreo.clave_usuario}/>
                        </div>
                        <div className="mb-3">
                            <label className="lclaveUsuarioConfir">Confirmar clave</label>
                            <input type="password" className="form-control" id="claveUsuarioConfir" name="userPass" required  onChange={this.manejadorChangeVal} defaultValue={this.state.valContraseña}/>
                        </div>
                        {localStorage.getItem('tipoUsuario') === '4' &&
                            <div className="mb-3">
                                <label  className="labelPassword">Numero de telefono (El número debera ir sin guiones y sin codigo de área)</label>
                                <input type="tel" className="form-control" name="telefonoUsuario"  onChange={this.manejadorChangeCrear} pattern="+503[0-9]{4}[0-9]{4}" defaultValue={this.state.usuarioPorCorreo.telefono_usuario}/>
                            </div>
                        }
                        <button type="submit" className="btn btn-light" id="iniciarSesion" onClick={this.manejadorBotonEditar}>Guardar</button>

                    </form>
                    }
                    {localStorage.getItem('tipoSesion') === '2' &&
                        <div>
                            <h2>No puede cambiar los datos de perfil desde esta aplicación debe hacerlo desde <a href="https://accounts.google.com/ServiceLogin?service=accountsettings&continue=https://myaccount.google.com%3Futm_source%3Daccount-marketing-page%26utm_medium%3Dgo-to-account-button" target="_blank" rel="noreferrer">Google</a> </h2>
                            <br/>
                        </div>
                    }
                </div>
                <FooterSA/>
            </>
        )
    }
}

export default MiPerfilSAdmin