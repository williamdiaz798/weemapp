import React from 'react'

function error404  () {
    return(
        <div>
            <div className="container pt-5">
                <div className="row pt-5">
                    <div className="col-md-12">
                        <div className="error-template">
                            <h1>
                                Oops!</h1>
                            <h2>
                                404 No Encontrado</h2>
                            <div className="error-details">
                            Lo sentimos, no pudimos localizar la pagina!
                            </div>
                            <br/>
                            <div className="error-actions">
                                <a href='/' className='btn btn-dark'>Volver a inicio</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default error404