
const TicketContol = require( '../models/ticket-control' );

const ticketContol = new TicketContol();

const socketController = ( socket ) => {

    // Cuando un cliente se conecta
    socket.emit( 'ultimo-ticket', ticketContol.ultimo );
    socket.emit( 'estado-actual', ticketContol.ultimos4 );
    socket.emit( 'tickets-pendientes', ticketContol.tickets.length );

    socket.on('siguiente-ticket', ( payload, callback ) => {

        const siguiente = ticketContol.siguiente();
        callback( siguiente );
        socket.broadcast.emit( 'tickets-pendientes', ticketContol.tickets.length );

    } );

    socket.on( 'atender-ticket', (  { escritorio }, callback ) => {
        

        if ( !escritorio ) {
            return callback( {
                ok: false, 
                msg: 'El escritorio es obligatorio'
            } );
        }

        const ticket = ticketContol.atenderTicker( escritorio );

        socket.broadcast.emit( 'estado-actual', ticketContol.ultimos4 );
        socket.emit( 'tickets-pendientes', ticketContol.tickets.length );
        socket.broadcast.emit( 'tickets-pendientes', ticketContol.tickets.length );

        if ( !ticket ) {
            callback( {
                ok: false,
                msg: 'Ya no hay ticket pendientes'
            } );
        } else {
            callback( {
                ok: true,
                ticket
            } );
        }
    } );

}

module.exports = {
    socketController
}
