import React from 'react'

class Navigation extends React.Component{
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <a className="navbar-brand" href="/">WEEM</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="/miPerfil">Mi Perfil</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="/usuarios">Usuarios</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="/reportsSAdmin">Reportes</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/close">Cerrar sesion</a>
                    </li>
                    </ul>
                    
                </div>
                </div>
            </nav> 
        )
    }
}

export default Navigation