import NavAdminEvent from '../../../functional/navigation/navAdminEvent/NavAdminEvent'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

import PlacesAutoComplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete'

import GoogleMap from 'google-map-react'

import {ApiLogin} from '../../../services/apiLogin'
import axios from 'axios'
import React from 'react'


class CrearEvento extends React.Component{
    constructor(props) {
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '2'){
        }else{
            this.props.history.push('/')
        }
        
    }

    state={
        error: false,
        errorMSG: '',
        address:'',
        form:{
            tipoEvento: '',
            tocken: localStorage.getItem('tocken'),
            nombreusuario: localStorage.getItem('correoUsuario'),
            nombreEvento: '',
            fechaEvento: '',
            horaEvento: '',
            direccionEvento: '',
            entradasTotalesEvento: '',
            entradasPrecioEvento: '',
            coordenada_x: 0.0,
            coordenada_y: 0.0
        }
    }

    handSelect = async value =>{
        const results = await geocodeByAddress(value)
        const latLng = await getLatLng(results[0])
        this.setState({
            form:{
            ...this.state.form,
            direccion_evento: value,
            coordenada_x: latLng.lat,
            coordenada_y: latLng.lng,
            direccionEvento: value
            },
            address: value
        })
    }

    manejadorSubmit = e =>{
        e.preventDefault()
    }

    manejadorChange = async e =>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    manejadorChangeMapa = async e =>{
        await this.setState({
            address: e
        })
    }

    manejadorBoton =()=>{
        // la fecha a evaluar sera convertira en el formato para evaluar el formulario
        var fechaEvento = this.state.form.fechaEvento
        var horaEvento = this.state.form.horaEvento
        var fechaEvaluar = new Date(fechaEvento)
        var hoy = new Date()
        var horaEvaluar = hoy.getHours() +':'+ hoy.getMinutes()
        console.log('hora1: '+horaEvaluar+'; hora2: '+horaEvento) 
        
        if(fechaEvaluar >= hoy){
            let url = ApiLogin + '/crearEvento'
            axios.post(url, this.state.form)
            .then( response =>{
                if(response.data.respuesta === 'correcto'){
                    this.setState({
                        error: false
                    })
                    this.props.history.push('/MisEventos')
                }else{
                    this.setState({
                        error: false,
                        errorMSG: 'No se pudieron almacenar los datos'
                    })
                }
            }).catch(error =>{
                this.setState({
                    error: true,
                    errorMSG: 'No se puede comunicar con el servidor'
                })
            })

        }else{
            this.setState({
                error: true,
                errorMSG: 'No puede selecionar una fecha anterior a la actual'
            })
        }
    }


    render(){
        return(
            <>
                <NavAdminEvent/>
                    <div className='container pt-5'>
                        <h1>Crear evento</h1>
                        {this.state.error === true &&
                            <div id="error" className="alert alert-danger ocultar">
                                {this.state.errorMSG}
                            </div>
                        }
                        <form onSubmit={this.manejadorSubmit} method="POST" id='formUser'>
                            <div className="mb-3">
                                <label className="labelCorreo">Nombre</label>
                                <input type="text" className="form-control" id="nombreEvento" name="nombreEvento"required  onChange={this.manejadorChange} />
                            </div>
                            <div className="mb-3">
                                <label className="labelCorreo">Fecha</label>
                                <input type="date" className="form-control" id="fechaEvento" name="fechaEvento"required  onChange={this.manejadorChange} />
                            </div>
                            <div className="mb-3">
                                <label className="labelCorreo">Hora</label>
                                <input type="time" className="form-control" id="horaEvento" name="horaEvento"required  onChange={this.manejadorChange} />
                            </div>
                            <div className="mb-3">
                                <label className="labelCorreo">Direccion</label>
                                <PlacesAutoComplete 
                                value={this.state.address}
                                onChange={this.manejadorChangeMapa} 
                                onSelect={this.handSelect}>
                                {({getInputProps, suggestions, getSuggestionItemProps, loading})=>(
                                    <div>
                                        <input {...getInputProps({placeholder: 'Ingresa la dirección'})}/>
                                        <div>
                                            {loading ? <div>...Cargando</div> : null}
                                            {suggestions.map(suggestion => {
                                                const style = {
                                                    backgroundColor: suggestion.active ? '#41b6e6' : '#fff'
                                                };
                                                return (
                                                    <div {...getSuggestionItemProps(suggestion, {style})}>
                                                    {suggestion.description}
                                                </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                </PlacesAutoComplete>
                            </div>
                            <div style={{height: '40vh',  width: '100%'}}>
                                <GoogleMap 
                                    bootstrapURLKeys={{key: 'AIzaSyCQMbz4kAHQP7pLuMA2nPskVxvjDa-yUwU'}}
                                    center={{
                                        lat: this.state.form.coordenada_x,
                                        lng: this.state.form.coordenada_y
                                    }}
                                    defaultZoom={15}
                                >
    
                                </GoogleMap>
                            </div>
                            <br/>
                            <div className="mb-3">
                                <label className="labelCorreo">Entradas</label>
                                <input type="number" className="form-control" id="entradasTotalesEvento" name="entradasTotalesEvento"required  onChange={this.manejadorChange} min="1"/>
                            </div>
                            <div className="mb-3">
                                <label className="labelCorreo">Precio</label>
                                <input type="number" className="form-control" id="entradasPrecioEvento" name="entradasPrecioEvento"required  onChange={this.manejadorChange} min="1"/>
                            </div>
<div className="mb-3">
                            <label className="form-label">Tipo Evento:      </label>
                            <select className="form-select" aria-label="Default select example" name="tipoEvento" required onChange={this.manejadorChange} defaultValue="">
                                <option value="">Selecione</option>
                                <option value="1">Presencial</option>
                                <option value="2">Virtual</option>
                            </select>
                        </div>
                            <button type="submit" className="btn btn-light" onClick={this.manejadorBoton}>Guardar</button>
                            <br/><br/>
                        </form>
                    </div>
                <FooterSA/>
            </>
            )
    }
    
}
export default CrearEvento