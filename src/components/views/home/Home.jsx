import React from 'react'
import {Modal} from '@material-ui/core'
import  crypot from 'crypto';

// servicios
import {ApiLogin} from '../../services/apiLogin'
import GoogleLogin from 'react-google-login';
// librerias
import axios from 'axios'

import Navigation from '../../functional/navigation/Navigation' 
import Banner from '../../functional/banner/Banner'
import Benefits from '../../functional/benefits/Benefits'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const mobalStyle = {
    marginTop: '20vh' 
}

class Home extends React.Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '1'){
            this.props.history.push('/HomeSAdmin')
        }else if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '2'){
            this.props.history.push('/HomeAdmin')
        }else if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '3'){
            this.props.history.push('/HomeValidador')
        }else if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '4'){
            this.props.history.push('/Home')
        }else{
            this.props.history.push('/')
        }
    }
    state = {
        form:{
            'correo': '',
            'claveUsuario': ''
        },
        error:false,
        errorCrear: false,
        errorMSG:'',
        modalCrearCuenta: false,
        user:{
            'nombreUsuario': '',
            'correoUsuario': '',
            'claveUsuario': '',
            'tipoUsuario': 4,
            'idtipoSesion': 1,
            'telefonoUsuario': ''
        },
        valContraseña: ''
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

    manejadorChangeCrear = async e =>{
        await this.setState({
            user:{
                ...this.state.user,
                [e.target.name]: e.target.value
            }
        })
    }

    manejadorChangeClaveConfir = async e =>{
        await this.setState({
            valContraseña:e.target.value
        })
    }

    manejadorBoton =async (res)=>{
        if(this.state.form.clave !== "" && this.state.form.correo !== ""){
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
        //this.state.form.clave = passEncrip
        await this.setState({
            form:{
                ...this.state.form,
                clave: passEncrip
            }
        })
        // envio de datos a api
        let url = ApiLogin + '/login?code=eYVp6AwSjsNzmqgxVdjoSaW0t8UapijmfxJvv6IyPLtw4bFH4bmVmw=='
        //console.log(this.state.form.claveUsuario)
        console.log(this.state.form)
        axios.post(url, this.state.form)
        .then( response =>{
            if(response.data.login === true){
                if(response.data.idtipoSesion === 1){
                    localStorage.setItem("tocken", response.data.tocken)
                    localStorage.setItem("tipoUsuario", response.data.tipoUsuario)
                    localStorage.setItem("nombreUsuario", response.data.nombreUsuario)
                    localStorage.setItem("correoUsuario", response.data.correoUsuario)
                    if(response.data.tipoUsuario === 1){
                        this.props.history.push('/HomeSAdmin')
                    }else if(response.data.tipoUsuario === 2){
                        this.props.history.push('/HomeAdmin')
                    }else if(response.data.tipoUsuario === 3){
                        this.props.history.push('/HomeValidador')
                    }else if(response.data.tipoUsuario === 4){
                        localStorage.setItem("telefonoUsuario", response.data.telefonoUsuario)
                        this.props.history.push('/Home')
                    }
                }else{
                    localStorage.setItem("tocken", response.data.tocken)
                    localStorage.setItem("tipoUsuario", response.data.tipoUsuario)
                    localStorage.setItem("nombreUsuario", response.data.nombreUsuario)
                    localStorage.setItem("correoUsuario", response.data.correoUsuario)
                    if(response.data.tipoUsuario === 4){
                        this.props.history.push('/Home')
                    }
                }
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
        }else{
            this.setState({
                error: true,
                errorMSG: 'Por favor ingresar credenciales'
            })
        }
    }

    manejadorBotonCrearCuenta = async () =>{
        if(this.state.valContraseña === this.state.user.claveUsuario){
            var passEncrip
            var hash = crypot.createHash('sha256')
            var hash2 = crypot.createHash('sha256')
            var data
            var data2
            var text
            data = hash.update(this.state.user.claveUsuario)
            text = data.digest('base64') + 'hola'
            data2 = hash2.update(text)
            passEncrip = data2.digest('base64')
            //this.state.user.clave = passEncrip
            //this.state.user.idtipoSesion = 1
            await this.setState({
                user:{
                    ...this.state.user,
                    idtipoSesion:'1',
                    claveUsuario:passEncrip
                },
            })
            //envio de datos a api
            let url = ApiLogin + '/crearUsuario'
            axios.post(url, this.state.user)
            .then( response =>{
                if(response.data.crearUsuario === true){
                    localStorage.setItem("tocken", response.data.tocken)
                    localStorage.setItem("tipoUsuario", this.state.user.tipoUsuario)
                    localStorage.setItem("nombreUsuario", this.state.user.nombreUsuario)
                    localStorage.setItem("correoUsuario", this.state.user.correoUsuario)
                    localStorage.setItem("telefonoUsuario", this.state.user.telefonoUsuario)
                    this.props.history.push('/Home')
                }else{
                    this.setState({
                        errorCrear: true,
                        errorMSG: response.data.crearUsuario
                    })
                }
            }).catch(error =>{
                console.log(error)
                this.setState({
                    errorCrear: true,
                    errorMSG: 'No se puede comunicar con el servidor'
                })
            })
            this.setState({
                errorCrear: false
            })
        }else{
            this.setState({
                errorCrear: true,
                errorMSG: 'Claves diferentes'
            })
        }
    }

    abrirCerrarCrearCuenta=()=>{
        this.setState({
            modalCrearCuenta: !this.state.modalCrearCuenta
        })
    }



    mostrarAlerta = (mensaje) =>{
        MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje
        })
    }

    responseGoogle = (responseG) => {
        if(responseG.error){
            this.mostrarAlerta('Operacion cancelada')
        }else{
            //console.log(responseG)

            this.setState({
                user:{
                    ...this.state.user,
                    correoUsuario : responseG.profileObj.email,
                    nombreUsuario : responseG.profileObj.name,
                    tipoUsuario : 4,
                    idtipoSesion : 2
                }
            })
            let url = ApiLogin + '/crearUsuario'
            console.log(this.state.user)
            axios.post(url, this.state.user)
            .then( response =>{
                if(response.data.crearUsuario === true){
                    localStorage.setItem("tocken", response.data.tocken)
                    localStorage.setItem("tipoUsuario", this.state.user.tipoUsuario)
                    localStorage.setItem("nombreUsuario", this.state.user.nombreUsuario)
                    localStorage.setItem("correoUsuario", this.state.user.correoUsuario)
                    this.props.history.push('/Home')
                }else{
                    console.log(response.data.idtipoSesion)
                    if(response.data.idtipoSesion === 2){
                        localStorage.setItem("tocken", response.data.tocken)
                        localStorage.setItem("tipoUsuario", this.state.user.tipoUsuario)
                        localStorage.setItem("nombreUsuario", this.state.user.nombreUsuario)
                        localStorage.setItem("correoUsuario", this.state.user.correoUsuario)
                        localStorage.setItem("tipoSesion", 2)
                        this.props.history.push('/Home')
                    }else{
                        this.mostrarAlerta('No se a podido iniciar sesion con esta cuenta, prueba con otra!')
                    }
                }
            }).catch(error =>{
                console.log(error)
                this.setState({
                    error: true,
                    errorMSG: 'No se puede comunicar con el servidor'
                })
            })
        }
        
      }


    render(){
        
        const bodyCrearCuenta=(
            <div className="container white position-sticky" style={mobalStyle}>
                <h2 className="pt-2">Crear Cuenta</h2>
                {this.state.errorCrear === true &&
                    <div className="alert alert-danger" role="alert">
                        {this.state.errorMSG}
                    </div>
                }
                <form onSubmit={this.manejadorSubmit}>
                    <div className="mb-3">
                        <label className="labelPassword">Nombre</label>
                        <input type="text" className="form-control" name="nombreUsuario" aria-describedby="emailHelp"  onChange={this.manejadorChangeCrear}/>
                    </div>
                    <div className="mb-3">
                        <label className="labelPassword">Correo</label>
                        <input type="email" className="form-control" name="correoUsuario" aria-describedby="emailHelp"  onChange={this.manejadorChangeCrear}/>
                    </div>
                    <div className="mb-3">
                        <label  className="labelPassword">Clave</label>
                        <input type="password" className="form-control" name="claveUsuario"  onChange={this.manejadorChangeCrear}/>
                    </div>
                    <div className="mb-3">
                        <label  className="labelPassword">Confirmar clave</label>
                        <input type="password" className="form-control" name="claveConfir"  onChange={this.manejadorChangeClaveConfir}/>
                    </div>
                    <div className="mb-3">
                        <label  className="labelPassword">Numero de telefono (El número debera ir sin guiones y sin codigo de área)</label>
                        <input type="tel" className="form-control" name="telefonoUsuario"  onChange={this.manejadorChangeCrear} pattern="+503[0-9]{4}[0-9]{4}" defaultValue='+503'/>
                    </div>
                    <button type="submit" className="btn btn-light" id="iniciarSesion" onClick={this.manejadorBotonCrearCuenta}>Crear cuenta</button>
                    <button onClick={this.abrirCerrarCrearCuenta} className="btn btn-light text-dark">Cancelar</button>
                </form>
                <br/>
            </div>
        )
        return(
            <>
                <Navigation />
                <Banner />
                <Benefits />
                <Modal
                open={this.state.modalCrearCuenta}
                onClose={this.abrirCerrarCrearCuenta}>
                    {bodyCrearCuenta}
                </Modal>
                
                <footer className="page-footer font-small bg-dark pt-4 center" id="login">
                <div className="container ">
                <h1 className="text-center">Cuenta</h1>
                    <div className="row text-center">
                    <div className="col-md-6 align-items-center py-3">
                        <React.Fragment>
                        {this.state.error === true &&
                            <div className="alert alert-danger" role="alert">
                                {this.state.errorMSG}
                            </div>
                        }
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
                            <button onClick={this.abrirCerrarCrearCuenta} className="btn btn-light text-dark">Crear cuenta</button>
                        </form>
                        {this.state.error === false &&
                            <div>
                                <br/>
                                <br/>
                                <br/>
                            </div>
                        }
                        </React.Fragment>
                    </div>
                    <div className="col-md-2 align-self-center">
                            <h1>O</h1>
                            <br/>
                        </div>
                    <div className="col-md-4 align-self-center">
                    <GoogleLogin
                        clientId="1090310261909-nnh16r71cvgulj0t13pbvttqr3ncfq5l.apps.googleusercontent.com"
                        buttonText="Iniciar sesion con Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                    <br/><br/>
                    </div>
                </div>
                </div>
                <div className="footer-copyright text-center py-3">WEEM
                </div>
            </footer>
            </> 
        ) 
    }
}

export default Home
