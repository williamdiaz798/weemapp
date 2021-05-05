import React, { Component } from 'react'

import NavAdmin from '../../../functional/navigation/NavSAdmin'
import FooterAdmin from '../footerSAdmin/FooterSAdmin'

class ListReports extends Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '1'){
        }else{
            this.props.history.push('/')
        }
    }
    render(){
        return(
            <>
                <NavAdmin/>
                <div className="container align-items-center text-center pt-5 py-5 min-width">
                    <h1>Reportes</h1>
                    <a href="/enventosCreadosPAdmin" className="text-dark"><h2 className="border border-dark">Eventos creados por administrador</h2></a>
                    <a href="/eventosReservadosPCliente" className="text-dark"><h2 className="border border-dark">Reserva por cliente</h2></a>
                    <a href="/reservasProcesadas" className="text-dark"><h2 className="border border-dark">Reservas registradas en ventanilla</h2></a>
                </div>
                <FooterAdmin/>
            </>
        )
    }
}

export default ListReports