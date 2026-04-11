// https://vite.dev/guide/env-and-mode.html
export const secrets = {
  backendEndpoint: import.meta.env.VITE_BACKEND_ENDPOINT,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
};
