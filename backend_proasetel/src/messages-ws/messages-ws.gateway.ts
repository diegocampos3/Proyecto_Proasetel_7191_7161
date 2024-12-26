import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayConnection {
  
  @WebSocketServer() wss: Server
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly JwtService: JwtService
  ) {}
  
async  handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload : JwtPayload;

    try {
      payload = this.JwtService.verify( token);
      await this.messagesWsService.registerClient( client, payload.id );

    } catch (error) {
      client.disconnect()
      return; 
    }

    // console.log({payload  })

    //console.log('Cliente conectado', client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  handleDisconnect(client: Socket) {
    //console.log('Method not implemented.', client.id);
    this.messagesWsService.removeClient( client.id)
    // console.log({ conectados: this.messagesWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  async onMessageFromClient( client: Socket, payload: NewMessageDto){
    
    // !Emite únicamente al cliente
    // client.emit('message-form-server',{
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // });

    //! Emitir a todos MENOS, al cliente inicial (quien lo emite)
    // client.broadcast.emit('message-form-server',{
    //     fullName: 'Soy Yo!',
    //     message: payload.message || 'no-message!!'
    //   });

    // Emitir a todos incluido el emisor
    this.wss.emit('message-form-server',{
        fullName: this.messagesWsService.getUserFullName( client.id),
        message: payload.message || 'no-message!!'
      });

    // Adicionalmente podemos hacer
    // client.join('ventas');
    // client.join(client.id);
    // client.join( user.email);
    // this.wss.to('ventas').emit('')
  
    
  }
}
