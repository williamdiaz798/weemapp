import React, { Component } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MarerialTable from 'material-table'


import {Modal,  Button} from '@material-ui/core'

import NavSAdmin from '../../../functional/navigation/NavSAdmin'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import  crypot from 'crypto';
import {ApiLogin} from '../../../services/apiLogin'
import axios from 'axios'

const MySwal = withReactContent(Swal)
const columnas=[
    {
        title:'Nombre',
        field:'nombre_usuario'
    },
    {
        title:'Correo',
        field:'correo_usuario'
    },
    {
        title:'Tipo',
        field:'nombre_tipo_usuario'
    },{
        title:'Estado',
        field:'estado_usuario'
    }
]

const mobalStyle = {
    marginTop: '5%' 
}



class ListaUsuarios extends Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '1'){
        }else{
            this.props.history.push('/')
        }
    }
    state={
        usuarios:[],
        usuarioPorCorreo:{
            'nombreUsuario': '',
            'correoUsuario': '',
            'claveUsuario': '',
            'tipoUsuario': '',
            'idtipoSesion':1
        },
        modalInsertar: false,
        modalEditar: false,
        correo:{
            correoUsuario:''
        },
        form:{
            'nombreUsuario': '',
            'correoUsuario': '',
            'claveUsuario': '',
            'tipoUsuario': '',
            'idtipoSesion':1
        },
        valContraseña:'',
        estadoUsuario:{
            'correoUsuario': '',
            'estado_usuario': ''
        }
    }    

    mostrarAlerta = (correo, estado) =>{
        var mensaje
        var color
        if(estado === 'ACTIVO'){
            mensaje = 'INHABILITAR'
            color = '#d33'
          }else{
            mensaje = 'REACTIVAR'
            color = '#00c851'
          }
        MySwal.fire({
            title: 'Desea cambiar el estado del usuario con correo: ' + correo,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: color,
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, '+ mensaje
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                this.cambiarEstado(correo,estado)
              )
            }
          })
    }


    abrirCerrarModalInsertar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            success: false
        })
    }

    abrirCerrarEditar=(correoUser)=>{
        if(this.state.modalEditar === false){
            this.state.usuarios.forEach((user, i)=>{
                if(user.correo_usuario === correoUser){
                    this.setState({
                        modalEditar: !this.state.modalEditar,
                        usuarioPorCorreo:{
                            'nombreUsuario': user.nombre_usuario,
                            'correoUsuario': user.correo_usuario,
                            'claveUsuario': user.clave_usuario,
                            'tipoUsuario': user.id_tipo_usuario
                        },
                        form:{
                            'nombreUsuario': user.nombre_usuario,
                            'correoUsuario': user.correo_usuario,
                            'claveUsuario': user.clave_usuario,
                            'tipoUsuario': user.id_tipo_usuario
                        },
                        valContraseña:{
                            userPass: user.clave_usuario
                        }
                    })
                }
            })
        }else{
            this.setState({
                modalEditar: !this.state.modalEditar,
                usuarioPorCorreo:{
                    'nombreUsuario': '',
                    'correoUsuario': '',
                    'claveUsuario': '',
                    'tipoUsuario': ''
                },
                error: false,
                success:false
            })
        }
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

    cambiarEstado=(correo, estado)=>{
        let url = ApiLogin + '/estadoUsuario'
            this.setState({
                estadoUsuario:{
                    correoUsuario: correo,
                    estadoUsuario: estado
                }
            })
            axios.post(url, this.state.estadoUsuario)
            .then( response =>{
                if(response.data.success === true){
                    this.componentDidMount()
                }else{
                }
            }).catch(error =>{
                console.log(error)
                this.setState({
                    error: true,
                    errorMSG: 'No se puede comunicar con el servidor'
                })
            })
    }

    // este se encarga de guardar los datos de nuvos usuarios

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

            //this.state.form.claveUsuario = passEncrip
            await this.setState({
                form:{
                    ...this.state.form,
                    claveUsuario:passEncrip
                }
            })
            // envio de datos a api
            console.log(this.state.form)
            let url = ApiLogin + '/crearUsuario'
            axios.post(url, this.state.form)
            .then( response =>{
                if(response.data.crearUsuario === true){
                    //this.abrirCerrarModalInsertar()
                    this.setState({
                        success: true,
                        error: false,
                        errorMSG: 'Usuario creado correctamente'
                    })
                    this.componentDidMount()
                    this.abrirCerrarModalInsertar()
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

    // este se encarga de mandar los datos para editar usuario

    manejadorBotonEditar = async (res)=>{
        var validarClave = false

        // para guardar los datos 

        if(this.state.form.claveUsuario !== this.state.usuarioPorCorreo.claveUsuario){
            validarClave = true
        }



        if(this.state.valContraseña.userPass === this.state.form.claveUsuario){

            if(validarClave){
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

                //this.state.form.claveUsuario = passEncrip
                await this.setState({
                    form:{
                        ...this.state.form,
                        claveUsuario:passEncrip
                    }
                })
            }

            //envio de datos a api
            let url = ApiLogin + '/editarUsuario'
            axios.post(url, this.state.form)
            .then( response =>{
                if(response.data.editarUsuario === true){
                    //this.abrirCerrarModalInsertar()
                    this.setState({
                        success: true,
                        error: false,
                        errorMSG: 'Datos guardados correctamente'
                    })
                    this.componentDidMount()
                    this.abrirCerrarEditar()
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

    // Se ejecuta cuando al final de un renderizado
    componentDidMount(){
        let url = ApiLogin + '/users'
        const body = {
            'tocken': localStorage.getItem('tocken')
        }
        console.log(localStorage.getItem('tocken'))
        axios.post(url, body)
        .then( response =>{
            if(response.data){
                this.setState({
                    usuarios: response.data
                })
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
        const bodyInsertar=(
            <div className="container white position-sticky" style={mobalStyle}>
                <br/>
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
                <h1>Crear usuario</h1>
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
                    <Button onClick={()=>this.abrirCerrarModalInsertar()}>Cerrar</Button>
                </form>
                <br/>
            </div>
        )

        const bodyEditar=(
            <div className="container white position-sticky" style={mobalStyle}>
                <br/>
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
                <h1>Editar usuario</h1>
                {this.state.usuarioPorCorreo &&
                    <form onSubmit={this.manejadorSubmit} method="POST" id='formUser'>
                    <div className="mb-3">
                    <label className="labelCorreo">Nombre</label>
                    <input type="text" className="form-control" id="nombreUsuario" name="nombreUsuario" aria-describedby="emailHelp" required  onChange={this.manejadorChange} defaultValue={this.state.usuarioPorCorreo.nombreUsuario}/>
                    </div>
                    <div className="mb-3">
                        <label className="labelCorreo">Correo</label>
                        <input type="email" className="form-control" id="correoUsuario" name="correoUsuario" aria-describedby="emailHelp" required  onChange={this.manejadorChange} value={this.state.usuarioPorCorreo.correoUsuario}/>
                    </div>
                    <div className="mb-3">
                        <label className="labelClave">Clave</label>
                        <input type="password" className="form-control" id="claveUsuario" name="claveUsuario" required  onChange={this.manejadorChange} defaultValue={this.state.usuarioPorCorreo.claveUsuario}/>
                    </div>
                    <div className="mb-3">
                        <label className="lclaveUsuarioConfir">Confirmar clave</label>
                        <input type="password" className="form-control" id="claveUsuarioConfir" name="userPass" required  onChange={this.manejadorChangeVal} defaultValue={this.state.usuarioPorCorreo.claveUsuario}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tipo usuario:      </label>
                        <select className="form-select" aria-label="Default select example" name="tipoUsuario" required onChange={this.manejadorChange} defaultValue={this.state.usuarioPorCorreo.tipoUsuario} >
                            <option value="">Selecione</option>
                            <option value="1">Super Administrador</option>
                            <option value="2">Administrador de eventos</option>
                            <option value="3">Ventanilla</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-light" id="iniciarSesion" onClick={this.manejadorBotonEditar}>Guardar</button>
                    <Button onClick={()=>this.abrirCerrarEditar()}>Cerrar</Button>
                </form>
                }
                <br/>
            </div>
        )
        return(
            <>
                <NavSAdmin/>
                <div className="container align-items-center text-center pt-5 py-5">
                <h1>Usuarios</h1>
                {this.state.errorCarga === true &&
                        <div id="error" className="alert alert-danger ocultar pt-3">
                            {this.state.errorMSGCarga}
                        </div>
                    }
                <div className="row g-0 pt-3" >
                    <div className="col-6">
                        {/* <a href="/crearUsuario" className="text-dark d-flex" >
                            <img src="img/user.svg" alt="" width="95px"/>
                            <h4 className=" pt-4">Crear usuario</h4>
                        </a> */}
                        <Button onClick={()=>this.abrirCerrarModalInsertar()}>Insertar usuario</Button>
                    </div>
                </div>

                

                <br/>
                <MarerialTable className=" pt-5"
                   columns={columnas}
                   data={this.state.usuarios}
                   title=""
                   actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Editar usuario',
                            onClick: (event, rowData)=>this.abrirCerrarEditar(rowData.correo_usuario)
                        },
                        {
                            icon: 'remove',
                            tooltip: 'Cambiar estado',
                            onClick: (event, rowData)=>this.mostrarAlerta(rowData.correo_usuario,rowData.estado_usuario)
                        }
                   ]}
                   options={{
                       actionsColumnIndex:-1,
                       headerStyle: {
                        backgroundColor: '#212121',
                        color: '#FFF'
                      }
                   }}
                   localization={{
                    pagination:{
                        labelRowsSelect: 'Registros',
                        firstAriaLabel: 'Primera',
                        firstTooltip: 'Primera',
                        previousAriaLabel: 'Anterior',
                        previousTooltip: 'Anterior',
                        nextAriaLabel: 'siguiente',
                        nextTooltip: 'siguiente',
                        lastAriaLabel: 'Ultima',
                        lastTooltip: 'ultima'
                    },
                    header:{
                        actions: 'Acciones'
                    },
                    toolbar:{
                         searchTooltip: 'Buscar',
                         searchPlaceholder: 'Buscar'
                    }
                   }}
                   />
                </div>
                <FooterSA/>

                {/* MODAL'S */}
                <Modal
                open={this.state.modalInsertar}
                onClose={this.abrirCerrarModalInsertar}>
                    {bodyInsertar}
                </Modal>

                <Modal
                open={this.state.modalEditar}
                onClose={this.abrirCerrarEditar}>
                    {bodyEditar}
                </Modal>
            </>
        )
    }
}

export default ListaUsuarios