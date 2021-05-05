import { Component } from 'react';
import NavClient from '../../../functional/navigation/navCliente/NavCliente'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import {ApiLogin} from '../../../services/apiLogin'
import axios from 'axios'

import GoogleMap  from 'google-map-react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const Marker = ({children}) => children

class DetallesRCliente extends Component{
    constructor(props){
        super(props)
        var idReservacion = props.match.params.idReservacion
        this.state.idReservacion = idReservacion
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '4'){
        }else{
            this.props.history.push('/')
        }
    }

    state={
        evento:[],
        error: false,
        errorMSG: '',
        idReservacion: '',
        nombreEstado:''
    }
    mostrarAlerta = () =>{
        const fechaActual = this.state.evento.hoy
        const fechaValida = this.state.evento.semana_anterior
        if( fechaActual <=  fechaValida){
            MySwal.fire({
                title: 'Desea cancelar la reservacion?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Si, Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    this.cancelarReservacion()
                  )
                }
              })
        }else{
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede cancelar una reservacion faltando 7 dias para el evento!'
            })
        }
    }


    cancelarReservacion = () =>{
        var idReservacion = this.state.idReservacion
        var body = {
            idReservacion: idReservacion,
            idEvento: this.state.evento.id_evento,
            estadoEvento: this.state.evento.estado_evento,
            tocken: localStorage.getItem('tocken')
        }
        let url = ApiLogin + '/reservacionEliminar/'
        console.log(url)
        axios.post(url, body)
        .then( response =>{
            if(response.data){
                if(response.data.error){
                    this.setState({
                        error: true,
                        errorMSG: response.data.error
                    })
                }else if(response.data.respuesta){
                    this.setState({
                        error: false,
                        idReservacion: idReservacion
                    })
                    this.props.history.push('/MisRecervaciones')
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
        var idReservacion = this.state.idReservacion
        var body = {
            idReservacion: idReservacion,
            estadoEvento: this.state.evento.estado_evento,
            tocken: localStorage.getItem('tocken')
        }
        let url = ApiLogin + '/reservacionDetalle/'
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
                        idReservacion: idReservacion
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

    botton = () =>{
        if (this.state.evento.nombre_estado_reservacion === 'Cancelada') {
            return <div></div>
        }else
        if(this.state.evento.nombre_estado_reservacion === 'Procesada'){
            return <div></div>
        }else if (this.state.evento.nombre_estado_reservacion === 'Activa'){
            return <button className='btn btn-dark' onClick={this.mostrarAlerta}>Cancelar reservacion</button> 
        }
    }

    render(){
        return(
            <>
            <NavClient/>
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
                        <h3><b>Codigo de entrada:</b> {this.state.evento.codigo_entrada}</h3>
                        <br/>
                        <h3><b>Fecha:</b> {this.state.evento.fecha_evento}</h3>
                        <br/>
                        <h3><b>Fecha reservación:</b> {this.state.evento.reserva_fecha_creacion}</h3>
                        <br/>
                        <h3><b>Hora:</b> {this.state.evento.hora_evento}</h3>
                        <br/>
                        <h3><b>Precio: $</b> {this.state.evento.precio_entradas_evento}</h3>
                        <br/>
                        <h3><b>Direccion:</b> {this.state.evento.direccion_evento}</h3>
                        <br/>
                        <h3><b>Estado Reservacion:</b> {this.state.evento.nombre_estado_reservacion}</h3>
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

                        {
                            this.botton()
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



export default DetallesRCliente