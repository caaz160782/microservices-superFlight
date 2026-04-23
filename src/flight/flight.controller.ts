import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FlightDTO } from './dto/flight.dto';
import { Observable } from 'rxjs';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { IFlight } from 'src/interfaces/flight.interface';
import { FlightMSG, PassengerMSG } from 'src/common/constants';

@Controller('api/v3/flight')
export class FlightController {
  private _clientProxyFlights;
  private _clientProxyPassengers;

  constructor(private readonly clientProxy: ClientProxySuperFlights) {
    this._clientProxyFlights = this.clientProxy.clientProxyPassengers();
    this._clientProxyPassengers = this.clientProxy.clientProxyPassengers();
  }

  @Post()
  create(@Body() flightDTO: FlightDTO): Observable<IFlight> {
    return this._clientProxyFlights.send(FlightMSG.CREATE, flightDTO);
  }

  @Get()
  findAll(): Observable<IFlight[]> {
    return this._clientProxyFlights.send(FlightMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IFlight[]> {
    return this._clientProxyFlights.send(FlightMSG.FIND_ONE, id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() flightDTO: FlightDTO,
  ): Observable<IFlight[]> {
    return this._clientProxyFlights.send(FlightMSG.UPDATE, { id, flightDTO });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<IFlight[]> {
    return this._clientProxyFlights.send(FlightMSG.DELETE, id);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ) {
    const passenger = await this._clientProxyPassengers
      .send(PassengerMSG.FIND_ONE, passengerId)
      .toPromise();

    if (!passenger)
      throw new HttpException('Passenger Not found', HttpStatus.NOT_FOUND);

    return this._clientProxyFlights.send(FlightMSG.ADD_PASSENGER, {
      flightId,
      passengerId,
    });
  }
}
