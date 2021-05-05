import React from 'react'
import NavValEntradas from '../../../functional/navigation/navValEntradas/NavValidadorEntradas'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import {ApiLogin} from '../../../services/apiLogin'
import axios from 'axios'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

class HomeValidador extends React.Component{

    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '3'){
        }else{
            this.props.history.push('/')
        }
    }

    state={
        datosEntrada:[],
        codigoEntrada:'',
        valEntrada: false,
        error: false,
        errorMSG: ''
    }

    manejadorSubmit = e =>{
        e.preventDefault()
    }

    manejadorChange = async e =>{
        await this.setState({
            codigoEntrada: e.target.value
        })
        //console.log(this.state.codigoEntrada)
    }

    manejadorBoton = () =>{
        var body = {
            codigoEntrada: this.state.codigoEntrada,
            tocken: localStorage.getItem('tocken')
        }        
        let url = ApiLogin + '/buscarEntrada/'
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
                        datosEntrada: response.data[0],
                        valEntrada: true,
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
    }

    procesarEntrada = () =>{
        var body = {
            codigoEntrada: this.state.codigoEntrada,
            tocken: localStorage.getItem('tocken')
        }        
        let url = ApiLogin + '/procesarReservacion/'
        axios.post(url, body)
        .then( response =>{
            if(response.data){
                if(response.data.error){
                    this.setState({
                        error: true,
                        errorMSG: response.data.error
                    })
                }else{
                    MySwal.fire({
                        icon: 'success',
                        title: 'Excelente!!!',
                        text: 'Entrada procesada con exito!'
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

    limpiarCampos = async () =>{
        this.props.history.push("/")
    }

    render(){
        return(
            <>
                <NavValEntradas/>
                <div style={{minHeight: '70vh'}} className="container pt-4">
                <h2>Bienvenid@ {localStorage.getItem('nombreUsuario')}</h2>
                    {this.state.error === true &&
                        <div className="alert alert-danger" role="alert">
                            {this.state.errorMSG}
                        </div>
                    }
                    <br/>
                    <form onSubmit={this.manejadorSubmit}>
                        <div className="mb-3">
                            <label className="labelPassword">Numero de entrada</label>
                            <input type="text" className="form-control" name="codigoEntrada" aria-describedby="emailHelp" required onChange={this.manejadorChange} defaultValue={this.state.codigoEntrada}/>
                        </div>
                        <button type="submit" className="btn btn-light" id="iniciarSesion" onClick={this.manejadorBoton}>Buscar</button>
                        <button className='btn btn-light' onClick={this.limpiarCampos}>Limpiar</button>
                    </form>
                    {this.state.valEntrada === true &&
                        <div className="container">
                            <div className="row text-center align-items-center border "  >
                                <div className="col-md-4">
                                    <img src="img/tickets.svg" className="card-img-top img-size-2" alt="..."/>
                                    
                                </div>
                                <div className="col-md-4" >
                                <div className="card-body">
                                        <h5 className="card-title"><b>{this.state.datosEntrada.nombre_evento}</b></h5>
                                    </div>
                                <ul className="list-group list-group-flush">
                                    <li className="dropdown-item"><b>Codigo entrada: </b>{this.state.datosEntrada.codigo_entrada}</li>
                                    <li className="dropdown-item"><b>Fecha evento: </b>{this.state.datosEntrada.fecha_evento}</li>
                                    <li className="dropdown-item"><b>Hora: </b> {this.state.datosEntrada.hora_evento}</li>
                                    <li className="dropdown-item"><b>Cliente: </b> {this.state.datosEntrada.nombre_usuario}</li>
                                    <li className="dropdown-item"><b>Estado: </b> {this.state.datosEntrada.nombre_estado_reservacion}</li>
                                </ul>
                                </div>
                                {this.state.datosEntrada.nombre_estado_reservacion === 'Activa' &&
                                    <div className="col-md-4" >
                                        <li className="dropdown-item">
                                            <button className='btn btn-dark' onClick={this.procesarEntrada}>Procesar</button>
                                        </li>
                                        <br/><br/><br/><br/>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
                <FooterSA/>
            </>
        )
    }
}

export default HomeValidador