import React from 'react'
import { Component } from 'react';
import {Modal} from '@material-ui/core'
import NavClient from '../../../functional/navigation/navCliente/NavCliente'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import {ApiLogin} from '../../../services/apiLogin'
import axios from 'axios'

const mobalStyle = {
    marginTop: '20vh' 
}

class HomeCliente extends Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '4'){
        }else{
            this.props.history.push('/')
        }

        var body = {
            correoUsuario: localStorage.getItem('correoUsuario'),
            tocken: localStorage.getItem('tocken')
        }

        let url = ApiLogin + '/reservacionesPorCliente/'
        axios.post(url, body)
        .then( response =>{
            if(response.data){
                if(response.data.error){
                    this.setState({
                        error: true,
                        errorMSG: response.data.error
                    })
                }else{
                    this.setState({
                        eventos: response.data,
                        error: false
                    })
                }
            }
        }).catch(error =>{
            console.log(error)
            this.setState({
                error: true,
                errorMSG: 'No se puede comunicar con el servidor'
            })
        })
        let url2 = ApiLogin + '/usuarioPorCorreo'
        const data = {
            correoUsuario: localStorage.getItem('correoUsuario')
        }
        axios.post(url2, data)
        .then( response =>{
            if(response.data){
                if(response.data[0].telefono_usuario === ''){
                    this.abrirCerrarTelefono()
                }else{
                    localStorage.setItem("telefonoUsuario", response.data[0].telefono_usuario)
                }
            }
        }).catch(error =>{
            console.log(error)
            this.setState({
                errorCarga: true,
                errorMSGCarga: 'No se puede comunicar con el servidor'
            })
        })
    }

    state={
        eventos:[],
        error: false,
        modalTelfono: false,
        errorMSG:'',
        telefono: ''
    }

    abrirCerrarTelefono=()=>{
        this.setState({
            modalTelfono: !this.state.modalTelfono
        })
    }

    manejadorChangeTelefono = async e =>{
        await this.setState({
            telefono:e.target.value
        })
    }

    manejadorBotonGuardarTelefono=()=>{
        let url = ApiLogin + '/insertar_telefono'
            const dataUser = {
                'telefonoUsuario': this.state.telefono,
                'correoUsuario': localStorage.getItem('correoUsuario')
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
    }

    render(){
        const bodyTelefono=(
            <div className="container white position-sticky" style={mobalStyle}>
                <h2 className="pt-2">Ingrese un numero de telefono</h2>
                <form onSubmit={this.manejadorSubmit}>
                    
                    <div className="mb-3">
                        <label  className="labelPassword">Numero de telefono (El número debera ir sin guiones y sin codigo de área)</label>
                        <input type="tel" className="form-control" name="telefonoUsuario"  onChange={this.manejadorChangeTelefono} pattern="+503[0-9]{4}[0-9]{4}" defaultValue='+503'/>
                    </div>
                    <button type="submit" className="btn btn-light" id="iniciarSesion" onClick={this.manejadorBotonGuardarTelefono}>Guardar telefono</button>
                    <button onClick={this.abrirCerrarTelefono} className="btn btn-light text-dark">Cancelar</button>
                </form>
                <br/>
            </div>
            
        )
        return(
            <>
                <NavClient />
                <div className='text-center pt-5 py-5'>
                    <h2>Bienvenid@ {localStorage.getItem('nombreUsuario')}</h2>
                    <br/>
                    <h1>Eventos reservados recientemente</h1>
                    {this.state.error === true &&
                        <div id="error" className="alert alert-danger ocultar">
                            {this.state.errorMSG}
                        </div>
                    }
                    <Modal
                        open={this.state.modalTelfono}
                        onClose={this.abrirCerrarTelefono}>
                            {bodyTelefono}
                    </Modal>
                    <div className = 'container pt-5'>
                        {this.state.eventos && this.state.eventos.map((evento, i) =>(
                            <div>
                            <div className="row text-center align-items-center border "  >
                                <div className="col-md-4">
                                    <img src="img/calendar.svg" className="card-img-top img-size-2" alt="..."/>
                                    
                                </div>
                                <div className="col-md-4" >
                                <div className="card-body">
                                        <h5 className="card-title"><b>{evento.nombre_evento}</b></h5>
                                    </div>
                                <ul className="list-group list-group-flush">
                                            <li className="dropdown-item"><b>Fecha evento: </b>{evento.fecha_evento}</li>
                                            <li className="dropdown-item"><b>Fecha reservación: </b>{evento.reserva_fecha_creacion}</li>
                                            <li className="dropdown-item"><b>Hora: </b> {evento.hora_evento}</li>
                                            <li className="dropdown-item"><b>Estado: </b> {evento.nombre_estado_reservacion}</li>
                                        </ul>
                                </div>
                                <div className="col-md-4" >
                                    <br/><br/><br/><br/>
                                <ul className="list-group list-group-flush">
                                    <li className="dropdown-item"><b>Espacios libres:</b> {evento.entradas_libres}</li>
                                    <li className="dropdown-item"><b>Precio:</b> ${evento.precio_entradas_evento }</li>
                                    <li className="dropdown-item">
                                        <a href={"/DetallesRCliente/"+evento.id_reservacion } className="btn btn-dark">Detalles</a>
                                    </li>
                                </ul>
                                </div>
                            </div>
                                <br/>
                            </div>
                        ))
                        }

                    </div>
                </div>
                <FooterSA />
            </>
        )
    }
}

export default HomeCliente