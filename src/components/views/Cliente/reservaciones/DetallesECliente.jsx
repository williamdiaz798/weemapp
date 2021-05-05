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

class DetallesECliente extends Component{
    constructor(props){
        super(props)
        var idEvento = props.match.params.idEvento
        this.state.idEvento = idEvento
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '4'){
        }else{
            this.props.history.push('/')
        }
    }

    state={
        evento:[],
        error: false,
        errorMSG: '',
        idEvento: '',
        nombreEstado:''
    }


    reservar = () =>{
        const body = {
            correoUsuario: localStorage.getItem('correoUsuario'),
            idEvento:this.state.idEvento,
            tocken: localStorage.getItem('tocken'),
            telefonoUsuario: localStorage.getItem('telefonoUsuario'),
            nombreUsuario: localStorage.getItem('nombreUsuario'),
            nombreEvento: this.state.evento.nombre_evento
        }
        let url = ApiLogin + '/reservar/'
        axios.post(url, body)
        .then( response =>{
            if(response.data){
                if(response.data.error){
                    console.log(response.data.error)
                    this.mostrarAlertaError(response.data.error)
                }else if(response.data.respuesta){
                    this.props.history.push('/Home')
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
                    console.log(response.data[0])
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
            title: 'Desea hacer la reservacion?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, Reservar'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                this.reservar()
              )
            }
          })
    }

    mostrarAlertaError = (error) =>{
        MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error+'!'
        })
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
                        <h3><b>Fecha:</b> {this.state.evento.fecha_evento}</h3>
                        <br/>
                        <h3><b>Hora:</b> {this.state.evento.hora_evento}</h3>
                        <br/>
                        <h3><b>Precio: $</b> {this.state.evento.precio_entradas_evento}</h3>
                        <br/>
                        <h3><b>Direccion:</b> {this.state.evento.direccion_evento}</h3>
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
                        <br/>
                        <h3><b>Entradas disponibles: </b> {this.state.evento.entradas_libres }</h3>
                        <button className='btn btn-dark' onClick={this.mostrarAlerta}>Reservar</button>
                        <br/><br/>
                    </div>
                }
            </div>
            <FooterSA/>
            </>
        )
    }
}



export default DetallesECliente