import NodeGeoCoder from "node-geocoder"
import config from '../config/config'
const options:any = {
    provider:config.GEOCODER_PROVIDER,
    httpAdapter:'https',
    apiKey:config.GEOCODER_API_KEY,
    formatter:null
}
export const geocoder = NodeGeoCoder(options)