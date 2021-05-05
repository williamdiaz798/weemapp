import React from 'react'
import  crypot from 'crypto';

// servicios
import {ApiLogin} from '../../services/apiLogin'
// librerias
import axios from 'axios'

class Footer extends React.Component{
    constructor(props){
        super(props)
    }
    state = {
        form:{
            'correo': '',
            'clave': ''
        },
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

    manejadorBoton =(res)=>{
        // encriptacion de contraseña
        var passEncrip
        var hash = crypot.createHash('sha256')
        var hash2 = crypot.createHash('sha256')
        var data
        var data2
        var text
        data = hash.update(this.state.form.clave)
        text = data.digest('base64') + 'hola'
        data2 = hash2.update(text)
        passEncrip = data2.digest('base64')
        this.state.form.clave = passEncrip
        // envio de datos a api
        let url = ApiLogin + '/login'
        axios.post(url, this.state.form)
        .then( response =>{
            if(response.data.login == true){
                localStorage.setItem("tocken", response.data.tocken)
                this.props.history.push('/HomeSAdmin')
            }else{
                this.setState({
                    error: true,
                    errorMSG: response.data.login
                })
            }
        }).catch(error =>{
            console.log(error)
            this.setState({
                error: true,
                errorMSG: 'No se puede comunicar con el servidor'
            })
        })
    }

    render(){
        return(
            <footer className="page-footer font-small unique-color-dark pt-4 center" id="login">
                <div className="container ">
                <h1 className="text-center">Cuenta</h1>
                    <div className="row text-center">
                    <div className="col-md-6 align-items-center py-3">
                        <React.Fragment>
                        <form onSubmit={this.manejadorSubmit}>
                            <div className="mb-3">
                                <label className="labelPassword">Correo</label>
                                <input type="email" className="form-control" name="correo" aria-describedby="emailHelp"  onChange={this.manejadorChange}/>
                            </div>
                            <div className="mb-3">
                                <label  className="labelPassword">Clave</label>
                                <input type="password" className="form-control" name="clave"  onChange={this.manejadorChange}/>
                            </div>
                            <button type="submit" className="btn btn-light" id="iniciarSesion" onClick={this.manejadorBoton}>Iniciar sesion</button>
                            <a href="/crearCuenta" className="btn btn-light text-dark">Crear Cuenta</a>
                        </form>
                        {this.state.error === true &&
                            <div className="alert alert-danger" role="alert">
                                {this.state.errorMSG}
                            </div>
                        }
                        
                        </React.Fragment>
                    </div>
                    <div className="col-1 align-self-center">
                            <h1>O</h1>
                        </div>
                    <div className="col-5 align-self-center">
                        <button type="submit" className="btn btn-danger" id="googleSesion">Google</button>
                    </div>
                </div>
                </div>
                <div className="footer-copyright text-center py-3">WEEM
                </div>
            </footer>
        )
    }
}

export default Footer