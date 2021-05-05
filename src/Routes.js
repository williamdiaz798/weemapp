import React from 'react'
import { BrowserRouter, Switch, Route} from 'react-router-dom'

// Views component
import Home from './components/views/home/Home.jsx'

import NotFound from './components/views/error/404'

// superAdmin

import HomeSAdmin from './components/views/SAdmin/homeSAdmin/HomeSAdmin.jsx'
import Close from './components/services/close'
// usuarios
import Users from './components/views/SAdmin/usuarios/ListaUsuarios.jsx'
import CreateUser from './components/views/SAdmin/usuarios/CrearUsuarios.jsx'
// reportes
import ListReports from './components/views/SAdmin/reportes/ListReports.jsx'
// eventos creados por admin
import EnventosCreadosPAdmin from './components/views/SAdmin/reportes/EnventosCreadosPAdmin.jsx'
// eventos reservados por cliente
import EventosReservadosPCliente from './components/views/SAdmin/reportes/EventosReservadosPCliente.jsx'
// reservar procesadas
import ReservasProcesadas from './components/views/SAdmin/reportes/ReservasProcesadas.jsx'

// adminEventos
import HomeAdmin from './components/views/AdminEvent/homeAdmin/HomeAdmin'
import DetalleEvento from './components/views/AdminEvent/eventos/DetalleEvento'
import CrearEvento from './components/views/AdminEvent/eventos/CrearEvento'
import MisEventos from './components/views/AdminEvent/eventos/MisEventos'
import Reservaciones from './components/views/AdminEvent/eventos/Reservaciones'
import EditarEvento from './components/views/AdminEvent/eventos/EditarEvento'

// cliente
import HomeCliente from './components/views/Cliente/homeCliente/HomeCliente'
import DetallesECliente from './components/views/Cliente/reservaciones/DetallesECliente'
import DetallesRCliente from './components/views/Cliente/reservaciones/DetallesRCliente'
import MisRecervaciones from './components/views/Cliente/reservaciones/MisRecervaciones'
import Eventos from './components/views/Cliente/eventos/eventos'

// Validador entratradas
import HomeValidador from './components/views/ValidadorEntradas/homeValidador/HomeValidador'

// Editar perfil
import MiPerfil from './components/views/perfil/perfilSAdmin'

const Routes = () =>{
    return(
        <React.Fragment>
            <BrowserRouter>
                <Switch>
                    <Route path='/' exact render = { props =>(<Home {...props}/>)}></Route>
                    {/* Rutas para usuario super administrador */}
                    <Route path='/HomeSAdmin' exact render = { props =>(<HomeSAdmin {...props}/>)}></Route>
                    <Route path='/usuarios' exact render = { props =>(<Users {...props}/>)}></Route>
                    <Route path='/close' exact render = { props =>(<Close {...props}/>)}></Route>
                    <Route path='/crearUsuario' exact render = { props =>(<CreateUser {...props}/>)}></Route>
                    <Route path='/reportsSAdmin' exact render = { props =>(<ListReports {...props}/>)}></Route>
                    <Route path='/enventosCreadosPAdmin' exact render = { props =>(<EnventosCreadosPAdmin {...props}/>)}></Route>
                    <Route path='/eventosReservadosPCliente' exact render = { props =>(<EventosReservadosPCliente {...props}/>)}></Route>
                    <Route path='/reservasProcesadas' exact render = { props =>(<ReservasProcesadas {...props}/>)}></Route>
                    {/* Rutas para usuario administrador de evetos */}
                    <Route path='/HomeAdmin' exact render = { props =>(<HomeAdmin {...props}/>)}></Route>
                    <Route path='/Detalles/:idEvento' exact render = { props =>(<DetalleEvento {...props}/>)}></Route>
                    <Route path='/CrearEvento/' exact render = { props =>(<CrearEvento {...props}/>)}></Route>
                    <Route path='/MisEventos/' exact render = { props =>(<MisEventos {...props}/>)}></Route>
                    <Route path='/editarEvento/:idEvento' exact render = { props =>(<EditarEvento {...props}/>)}></Route>
                    <Route path='/reportsAdmin/' exact render = { props =>(<Reservaciones {...props}/>)}></Route>                    
                    {/* Rutas para cliente */}
                    <Route path='/Home/' exact render = { props =>(<HomeCliente {...props}/>)}></Route>
                    <Route path='/DetallesECliente/:idEvento' exact render = { props =>(<DetallesECliente {...props}/>)}></Route>
                    <Route path='/DetallesRCliente/:idReservacion' exact render = { props =>(<DetallesRCliente {...props}/>)}></Route>
                    <Route path='/Eventos' exact render = { props =>(<Eventos {...props}/>)}></Route>
                    <Route path='/MisRecervaciones' exact render = { props =>(<MisRecervaciones {...props}/>)}></Route>
                    {/* Rutas para validador de entradas */}
                    <Route path='/HomeValidador' exact render = { props =>(<HomeValidador {...props}/>)}></Route>
                    <Route path='/MiPerfil' exact render = { props =>(<MiPerfil {...props}/>)}></Route>
                    <Route component={NotFound} ></Route>

                </Switch>
            </BrowserRouter>
        </React.Fragment>
    )
}

export default Routes;