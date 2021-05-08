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


class EditarEvento extends React.Component{
    constructor(props) {
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '2'){
        }else{
            this.props.history.push('/')
        }
        var idEvento = props.match.params.idEvento
        var body = {
            idEvento: idEvento,
            tocken: localStorage.getItem('tocken')
        }
        
        let url = ApiLogin + '/eventoDetalle/'
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
                        error: false,
                        form:{
                            ...this.state.form,
                            id_evento:props.match.params.idEvento,
                            nombre_evento: response.data[0].nombre_evento,
                            fecha_evento: response.data[0].fecha_evento,
                            hora_evento: response.data[0].hora_evento_2,
                            //hora_evento_2: response.data[0].hora_evento_2,
                            direccion_evento: response.data[0].direccion_evento,
                            entradas_totales_evento: response.data[0].entradas_totales_evento,
                            precio_entradas_evento: response.data[0].precio_entradas_evento,
                            coordenada_x: response.data[0].coordenada_x,
                            coordenada_y: response.data[0].coordenada_y,
                            tipo_evento: response.data[0].tipo_evento
                        },
                        address:response.data[0].direccion_evento
                    })
                }
            }
        }).catch(error =>{
            this.setState({
                error: true,
                errorMSG: 'No se puede comunicar con el servidor'
            })
        })
    }

    state={
        error: false,
        errorMSG: '',
        address:'',
        form:{
            id_evento: '',
            tocken: localStorage.getItem('tocken'),
            id_usuario_creador: localStorage.getItem('correoUsuario'),
            nombre_evento: '',
            fecha_evento: '',
            hora_evento: '',
            direccion_evento: '',
            entradas_totales_evento: '',
            precio_entradas_evento: '',
            coordenada_x: '',
            coordenada_y: '',
            tipo_evento: ''    
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
            coordenada_y: latLng.lng
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
        console.log(this.state.form)
    }

    manejadorChangeMapa = async e =>{
        await this.setState({
            address: e
        })
    }

    manejadorBoton =()=>{
        //console.log(this.state.form)
        let url = ApiLogin + '/editarEvento'
        axios.post(url, this.state.form)
        .then( response =>{
            if(response.data.respuesta === 'correcto'){
                this.setState({
                    error: false
                })
                this.props.history.push('/Detalles/'+this.state.form.id_evento)
            }else{
                this.setState({
                    error: false,
                    errorMSG: 'No se pudieron almacenar los datos'
                })
            }
        }).catch(error =>{
            this.setState({
                error: false,
                errorMSG: 'No se puede comunicar con el servidor'
            })
        })
    }


    render(){
        return(
            <>
                <NavAdminEvent/>
                    <div className='container pt-5'>
                        <h1>Eventos</h1>
                        {this.state.error === true &&
                            <div id="error" className="alert alert-danger ocultar">
                                {this.state.errorMSG}
                            </div>
                        }
                        <form onSubmit={this.manejadorSubmit} method="POST" id='formUser'>
                            <div className="mb-3">
                                <label className="labelCorreo">Nombre</label>
                                <input type="text" className="form-control" id="nombreEvento" name="nombre_evento"required  onChange={this.manejadorChange} defaultValue={this.state.form.nombre_evento}/>
                            </div>
                            <div className="mb-3">
                                <label className="labelCorreo">Fecha</label>
                                <input type="date" className="form-control" id="fechaEvento" name="fecha_evento"required  onChange={this.manejadorChange} defaultValue={this.state.form.fecha_evento}/>
                            </div>
                            <div className="mb-3">
                                <label className="labelCorreo">Hora</label>
                                <input type="time" className="form-control" id="horaEvento" name="hora_evento"required  onChange={this.manejadorChange} defaultValue={this.state.form.hora_evento}/>
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
                                <input type="number" className="form-control" id="entradasTotalesEvento" name="entradas_totales_evento"required  onChange={this.manejadorChange} defaultValue={this.state.form.entradas_totales_evento}/>
                            </div>
                            <div className="mb-3">
                                <label className="labelCorreo">Precio</label>
                                <input type="number" className="form-control" id="entradasPrecioEvento" name="precio_entradas_evento"required  onChange={this.manejadorChange} defaultValue={this.state.form.precio_entradas_evento}/>
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
export default EditarEvento