/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.join(__dirname, '../../src/grpc/notification.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

// Create gRPC client
const client = new proto.notification.NotificationService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

// Function to send low stock alert to admin
export function sendLowStockAlert(bookId: number, bookTitle: string) {
  client.SendBookLowStockAlert(
    { BookId: bookId, BookTitle: bookTitle },
    (error: any, response: any) => {
      if (error) {
        console.error('Error in sending low stock alert:', error);
        return;
      }
      console.log('Low stock alert sent:', response.message);
    },
  );
}

// Example usage (you can call this when the last copy is borrowed)
sendLowStockAlert(9999, 'default mail');