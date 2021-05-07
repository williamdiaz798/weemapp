import React, { Component } from 'react'

import NavAdmin from '../../../functional/navigation/NavSAdmin'
import FooterAdmin from '../footerSAdmin/FooterSAdmin'

import { ApiLogin } from '../../../services/apiLogin'
import axios from 'axios'

import MarerialTable from 'material-table'

const columnas=[
    {
        title:'Cliente',
        field:'nombre_usuario'
    },
    {
        title: 'Nombre evento',
        field:'nombre_evento'
    },
    {
        title:'Fecha evento',
        field:'fecha_evento'
    },
    {
        title:'Fecha reservación',
        field:'fecha_reservacion'
    },{
        title:'Código',
        field:'codigo_entrada'
    }
]

class EventosReservadosPCliente extends Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '1'){
        }else{
            this.props.history.push('/')
        }
        let url = ApiLogin + '/eventosReservadosPCliente'
        axios.get(url)
        .then( response =>{
            if(response.data){
                this.setState({
                    data: response.data
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
        data:[]
    }
    render(){
        return(
            <>
                <NavAdmin/>
                    <div className="container">
                        <br/>
                        <h1>Eventos reservados por Cliente</h1>
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
                <FooterAdmin/>
            </>
        )
    }
}

export default EventosReservadosPCliente