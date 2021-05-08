import React from 'react'
import { Component } from 'react';
import NavAdminEvent from '../../../functional/navigation/navAdminEvent/NavAdminEvent'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import {ApiLogin} from '../../../services/apiLogin'
import axios from 'axios'


class MisEventos extends Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '2'){
        }else{
            this.props.history.push('/')
        }

        var body = {
            correoUsuario: localStorage.getItem('correoUsuario'),
            tocken: localStorage.getItem('tocken')
        }

        let url = ApiLogin + '/eventosPorAdminTotales/'
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

      componentDidMount(){
        this.setState({
            busqueda: this.state.eventos
        })
    }
    render (){
        return(
            <>
                <NavAdminEvent/>
                <div className='text-center pt-5 py-5' style = {{minHeight:'700px'}}>
                    <h1>Mis eventos</h1>
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
                    {this.state.error === true &&
                        <div id="error" className="alert alert-danger ocultar">
                            {this.state.errorMSG}
                        </div>
                    }
                    
                    <div className = 'container pt-5'>
                        {this.state.busqueda && this.state.busqueda.map((evento, i) =>(
                            <div>
                            <div className="row text-center align-items-center border " >
                                <div className="col-md-4">
                                    <img src="img/calendar.svg" className="card-img-top" alt="..."/>
                                    
                                </div>
                                <div className="col-md-4" >
                                <div className="card-body">
                                        <h5 className="card-title"><b>{evento.nombre_evento}</b></h5>
                                    </div>
                                <ul className="list-group list-group-flush">
                                            <li className="dropdown-item"><b>Fecha evento: </b>{evento.fecha_evento}</li>
                                            <li className="dropdown-item"><b>Fecha creacion: </b>{evento.fecha_creacion}</li>
                                            <li className="dropdown-item"><b>Hora:</b> {evento.hora_evento}</li>
                                        </ul>
                                </div>
                                <div className="col-md-4" >
                                    <br/><br/><br/><br/>
                                <ul className="list-group list-group-flush">
                                    <li className="dropdown-item"><b>Espacios libres:</b> {evento.entradas_libres}</li>
                                    <li className="dropdown-item"><b>Precio:</b> ${evento.precio_entradas_evento }</li>
                                    <li className="dropdown-item">
                                        <a href={"/Detalles/"+evento.id_evento} className="btn btn-dark">Detalles</a>
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
                <FooterSA/>
            </>
        )
    }
}

export default MisEventos