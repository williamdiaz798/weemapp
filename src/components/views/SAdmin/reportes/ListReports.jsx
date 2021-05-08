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
                <div className="container align-items-center text-center pt-5 py-5 min-width" style = {{minHeight:'700px'}}>
                    <h1>Reportes</h1>
                    <br />
                    <div className="pt-4 border border-dark" style={{minHeight: '100px'}}>
                        <a href="/enventosCreadosPAdmin" className="text-dark"><h2 className=""><b>Eventos creados por administrador</b></h2></a>
                    </div>
                    <br />
                    <div className="pt-4 border border-dark" style={{minHeight: '100px'}}>
                        <a href="/eventosReservadosPCliente" className="text-dark"><h2 className=""><b>Reserva por cliente</b></h2></a>
                    </div>
                </div>
                <FooterAdmin/>
            </>
        )
    }
}

export default ListReports