import React from 'react'
import { Component } from 'react';

import NavClient from '../../../functional/navigation/navCliente/NavCliente'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import {ApiLogin} from '../../../services/apiLogin'
import axios from 'axios'

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

        let url = ApiLogin + '/reservacionesPorClienteTodas/'
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
                        busqueda: response.data,
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

    state={
        eventos:[],
        busqueda:[],
        busquedaevento: '',
        error: false,
        errorMSG:''
    }

    onChange=async e=>{
        e.persist();
        await this.setState({busquedaevento: e.target.value});
        this.filtrarElementos();
    }
    filtrarElementos=()=>{
        var search = this.state.eventos.filter(item=>{
          if(
          item.nombre_evento.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").includes(this.state.busquedaevento)
          ){
            return item;
          }else{
            return null;
          }
        });
        this.setState({busqueda: search});
      }

    render(){
        return(
            <>
                <NavClient />
                <div className='text-center pt-5 py-5' style = {{minHeight:'700px'}}>
                    <h1>Eventos reservados</h1>
                    {this.state.error === true &&
                        <div id="error" className="alert alert-danger ocultar">
                            {this.state.errorMSG}
                        </div>
                    }

                    <div className="barraBusqueda">
                        <input
                        type="text"
                        placeholder="Buscar"
                        className="textField"
                        name="busqueda"
                        value={this.state.busquedaevento}
                        onChange={this.onChange}
                        />
                    </div>
                    
                    <div className = 'container pt-5'>
                        {this.state.busqueda && this.state.busqueda.map((evento, i) =>(
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
                                            <li className="dropdown-item"><b>Fecha creacion: </b>{evento.fecha_creacion}</li>
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