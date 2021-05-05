import React from 'react'

class BodyHomeSA extends React.Component{
    render(){
        return(
            <div className='text-center pt-5 py-5'>
                <h1>Bienvenid@ {localStorage.getItem('nombreUsuario')}</h1>

                <div className="container pt-5 my-4">
                    <div className="row text-center align-items-center">
                        
                        <div className="col-md-6">
                            <a href="/crearUsuario" className="text-dark">
                                <img src="img/user.svg" alt="" className="img-size-2"/>
                                <h4 className=" pt-4">Crear usuario</h4>
                            </a>
                        </div>
                        
                        <div className="col-md-6">
                            <a href="/reportsSAdmin" className="text-dark">
                                <img src="img/calendar.svg" alt="" className="img-size-2"/>
                                <h4 className=" pt-4">Ver Reportes</h4>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default BodyHomeSA