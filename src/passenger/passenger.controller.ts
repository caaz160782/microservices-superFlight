import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PassengerDTO } from './dto/passenger.dto';
import { IPassenger } from 'src/interfaces/passenger.interface';
import { Observable } from 'rxjs';
import { PassengerMSG } from 'src/common/constants';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';


@Controller('api/v2/passenger')
export class PassengerController {

     private _clientProxyPassengers;
    
        constructor(private readonly clientProxy: ClientProxySuperFlights) {
            this._clientProxyPassengers = this.clientProxy.clientProxyPassengers();
        }
    
        @Post()
        create(@Body() passengerDTO: PassengerDTO): Observable<IPassenger> {
            return this._clientProxyPassengers.send(PassengerMSG.CREATE, passengerDTO);
        }
    
        @Get()
        findAll(): Observable<IPassenger[]> {
            return this._clientProxyPassengers.send(PassengerMSG.FIND_ALL,'')
        }
    
        @Get(':id')
        findOne(@Param('id') id:string): Observable<IPassenger[]> {
            return this._clientProxyPassengers.send(PassengerMSG.FIND_ONE,id)
        }
    
        @Put(':id')
        update(@Param('id') id:string ,@Body() passengerDTO: PassengerDTO): Observable<IPassenger[]> {
            return this._clientProxyPassengers.send(PassengerMSG.UPDATE,{id,passengerDTO})
        }
    
        @Delete(':id')
        delete(@Param('id') id:string): Observable<IPassenger[]> {
            return this._clientProxyPassengers.send(PassengerMSG.DELETE,id)
        }

}
