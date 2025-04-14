import { createClient, Client, ClientOptions, SubscribePayload } from 'graphql-ws';

export function createGraphQLWSClient(options: ClientOptions): Client {
  return createClient(options);
}

export function subscribeToUpdates<T = any>(
  client: Client,
  payload: SubscribePayload,
  next: (data: T) => void,
  error?: (err: unknown) => void,
  complete?: () => void
) {
  return client.subscribe(payload, {
    next: (msg) => next((msg as any).data),
    error: error || (() => {}),
    complete: complete || (() => {}),
  });
}
