import React, { Component } from 'react'

import NavAdminEvent from '../../../functional/navigation/navAdminEvent/NavAdminEvent'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import { ApiLogin } from '../../../services/apiLogin'
import axios from 'axios'

import MarerialTable from 'material-table'

const columnas=[
    {
        title:'Evento',
        field:'nombre_evento'
    },
    {
        title:'Fecha',
        field:'fecha_evento'
    },
    {
        title:'Entradas totales',
        field:'entradas_totales_evento'
    },
    {
        title:'Entradas reservadas',
        field:'entradas_reservadas_evento'
    },
    {
        title:'Entradas disponibles',
        field:'entradas_disponibles'
    },
    {
        title:'Entradas procesadas',
        field:'entradas_procesadas_evento'
    },
    {
        title:'Total recaudado',
        field:'ganancias_evento'
    }
]

class Reservaciones extends Component{
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

        let url = ApiLogin + '/reservarPorEventoAdmin/'
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
                        data: response.data,
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
        data:[]
    }
    render(){
        return(
            <>
                <NavAdminEvent/>
                    <div className="container">
                        <br/>
                        <h1>Reservaciones por evento</h1>
                        {this.state.errorCarga === true &&
                            <div id="error" className="alert alert-danger ocultar pt-3">
                                {this.state.errorMSGCarga}
                            </div>
                        }
                        <br/>
                        <MarerialTable className="pt-5"
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
                <FooterSA/>
            </>
        )
    }
}

export default Reservaciones