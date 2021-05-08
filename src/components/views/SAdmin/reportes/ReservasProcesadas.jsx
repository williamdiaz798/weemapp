import React, { Component } from 'react'

import NavAdmin from '../../../functional/navigation/NavSAdmin'
import FooterAdmin from '../footerSAdmin/FooterSAdmin'

import { ApiLogin } from '../../../services/apiLogin'
import axios from 'axios'

import MarerialTable from 'material-table'

const columnas=[
    {
        title:'Administrador',
        field:'nombre_usuario'
    },
    {
        title:'Nombre Evento',
        field:'año_evento'
    },
    {
        title:'Año',
        field:'mes_evento'
    },
    {
        title:'Mes',
        field:'mes_evento'
    }
    ,
    {
        title:'Entradas Totales',
        field:'entradas_totales_evento'
    },
    {
        title:'Entradas Reservadas',
        field:'entradas_reservadas_evento'
    },
    {
        title:'Entradas Procesadas',
        field:'entradas_procesadas_evento'
    },
    {
        title:'Total Generado',
        field:'ganancias_evento'
    }
]

class ReservasProcesadas extends Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '1'){
        }else{
            this.props.history.push('/')
        }
        let url = ApiLogin + '/reservasProcesadas'
        axios.get(url)
        .then( response =>{
            if(response.data){
                this.setState({
                    data: response.data
                })
                this.setState({
                    error: false
                })
            }else{
                this.setState({
                    error: true,
                    MSG: 'No se retorno ningun registro'
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
    state={
        data:[],
        error: false,
        MSG: 'No existen datos'
    }
    render(){
        return(
            <>
                <NavAdmin/>
                    <div className="container" style = {{minHeight:'700px'}}>
                        <br/>
                        <h1>Entradas procesadas</h1>
                        {this.state.errorCarga === true &&
                            <div id="error" className="alert alert-danger ocultar pt-3">
                                {this.state.errorMSGCarga}
                            </div>
                        }
                        <br/>

                            {this.state.error === true &&
                            <div id="error" className="alert alert-danger ocultar">
                                {this.state.MSG}
                            </div>
                        }
                        <MarerialTable className="pt-5 table"
                            columns={columnas}
                            data={this.state.data}
                            title=""
                            options={{
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
                <FooterAdmin/>
            </>
        )
    }
}

export default ReservasProcesadas