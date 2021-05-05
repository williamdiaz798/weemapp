import { Component } from 'react';
import NavAdminEvent from '../../../functional/navigation/navAdminEvent/NavAdminEvent'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import {ApiLogin} from '../../../services/apiLogin'
import axios from 'axios'

import GoogleMap  from 'google-map-react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
const Marker = ({children}) => children

class DetalleEvento extends Component{
    constructor(props){
        super(props)
        var idEvento = props.match.params.idEvento
        var body = {
            idEvento: idEvento,
            tocken: localStorage.getItem('tocken')
        }
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '2'){
        }else{
            this.props.history.push('/')
        }

        let url = ApiLogin + '/eventoDetalle/'
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
                        evento: response.data[0],
                        error: false,
                        idEvento: idEvento
                    })
                    if(response.data[0].estado_evento === 1){
                        this.setState({
                            nombreEstado: 'Ocultar'
                        })
                    }else if(response.data[0].estado_evento === 2){
                        this.setState({
                            nombreEstado: 'Dejar de ocultar'
                        })
                    }
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

    state={
        evento:[],
        error: false,
        errorMSG: '',
        idEvento: '',
        nombreEstado:''
    }

    ocultarEvento = () =>{
        var idEvento = this.state.idEvento
        var body = {
            idEvento: idEvento,
            estadoEvento: this.state.evento.estado_evento,
            tocken: localStorage.getItem('tocken')
        }
        let url = ApiLogin + '/cambiarEstadoEvento/'
        axios.post(url, body)
        .then( response =>{
            if(response.data){
                if(response.data.respuesta){
                    this.setState({
                        error: false,
                        idEvento: idEvento
                    })
                    if(response.data.estado_evento === 1){
                        this.setState({
                            nombreEstado: 'Ocultar'
                        })
                    }else{
                        this.setState({
                            nombreEstado: 'Dejar de ocultar'
                        })
                    }
                    this.componentDidMount()
                }else{
                    this.setState({
                        error: true,
                        errorMSG: response.data.respuesta
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
    }

    eliminarEvento = () =>{
        var idEvento = this.state.idEvento
        var body = {
            idEvento: idEvento,
            estadoEvento: this.state.evento.estado_evento,
            tocken: localStorage.getItem('tocken')
        }
        let url = ApiLogin + '/eliminarEvento/'
        axios.post(url, body)
        .then( response =>{
            if(response.data){
                if(response.data.respuesta){
                    this.setState({
                        error: false,
                        idEvento: idEvento
                    })
                    this.componentDidMount()
                }else{
                    this.setState({
                        error: true,
                        errorMSG: response.data.respuesta
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
    }

    componentDidMount(){
        var idEvento = this.state.idEvento
        var body = {
            idEvento: idEvento,
            estadoEvento: this.state.evento.estado_evento,
            tocken: localStorage.getItem('tocken')
        }
        let url = ApiLogin + '/eventoDetalle/'
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
                        evento: response.data[0],
                        error: false,
                        idEvento: idEvento
                    })
                    if(response.data[0].estado_evento === 1){
                        this.setState({
                            nombreEstado: 'Ocultar'
                        })
                    }else if(response.data[0].estado_evento === 2){
                        this.setState({
                            nombreEstado: 'Dejar de ocultar'
                        })
                    }
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

    mostrarAlerta = () =>{
        MySwal.fire({
            title: 'Desea cancelar el evento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                this.eliminarEvento()
              )
            }
          })
    }

    render(){
        return(
            <>
            <NavAdminEvent/>
            <div className='container'>
                <br/>
                {this.state.error === true &&
                    <div id="error" className="alert alert-danger ocultar">
                        {this.state.errorMSG}
                    </div>
                }
                {this.state.evento &&
                    <div>
                        <h1>{this.state.evento.nombre_evento}</h1>
                        <br/>
                        <h3><b>Fecha:</b> {this.state.evento.fecha_evento}</h3>
                        <br/>
                        <h3><b>Hora:</b> {this.state.evento.hora_evento}</h3>
                        <br/>
                        <h3><b>Precio: $</b> {this.state.evento.precio_entradas_evento}</h3>
                        <br/>
                        <h3><b>Direccion:</b> {this.state.evento.direccion_evento}</h3>
                        <br/>
                        <h3><b>Estado:</b> {this.state.evento.nombre_estado_evento}</h3>
                        <br/>
                        <div style={{height: '50vh',  width: '100%'}}>
                        <GoogleMap 
                                bootstrapURLKeys={{key: 'AIzaSyCQMbz4kAHQP7pLuMA2nPskVxvjDa-yUwU'}}
                                center={{
                                    lat: this.state.evento.coordenada_x,
                                    lng: this.state.evento.coordenada_y
                                }}
                                defaultZoom={15}
                            >
                                <Marker 
                                key={this.state.evento.nombre_evento}
                                lat={this.state.evento.coordenada_x}
                                lng={this.state.evento.coordenada_y}>
                                    <button className='btn-danger'>{this.state.evento.nombre_evento}</button>
                                </Marker>
                            </GoogleMap>
                        </div>
                        <br/>
                        <h3><b>Entradas totales: </b> {this.state.evento.entradas_totales_evento }</h3>
                        {this.state.evento.nombre_estado_evento !== 'Cancelado' &&
                            <div>
                                <a href={"/editarEvento/"+this.state.idEvento} className='btn btn-dark'>Editar</a>
                                <button className='btn btn-dark' onClick={this.ocultarEvento}>{this.state.nombreEstado}</button>
                                <button className='btn btn-dark' onClick={this.mostrarAlerta}>Cancelar</button>
                            </div>
                        }
                        {this.state.evento.nombre_estado_evento === 'Cancelado' &&
                            <div>
                                <h3>
                                    El evento a sido cancelado, por ende no puede Editar, ocultar
                                </h3>
                            </div>
                        }
                        <br/><br/>
                    </div>
                }
            </div>
            <FooterSA/>
            </>
        )
    }
}



export default DetalleEvento