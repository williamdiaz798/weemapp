import React from 'react'

const Benefits = () =>{
    return(
        <div className="container pt-5">

            <h1 className = "text-center">Beneficios</h1>
            <div className="row text-center pt-5 py-4" id="beneficios">
                <div className="col-md-4 pt-5 py-4">
                    <img src="img/tickets.svg" alt="" className="img-size-2"></img>
                    <h4 className="my-3">No necesitas tickets fisicos</h4>
                </div>
                <div className="col-md-4 pt-5 py-4">
                    <img src="img/codigo-qr.svg" alt="" className="img-size-2"></img>
                    <br/><br/>
                    <h4 className="my-3">Crea eventos facilmente</h4>
                </div>
                <div className="col-md-4 pt-5 py-4">
                    <img src="img/distanciamiento-social.svg" alt="" className="img-size-2"></img>
                    <br/><br/>
                    <h4 className="my-4">Manten la distancia</h4>
                </div>
            </div>
        </div>
    )
}

export default Benefits