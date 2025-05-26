# Setting Up Google Maps for Property Location

To enable the property location map feature, you need to set up a Google Maps API key:

## Steps to Set Up Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (for autocomplete functionality)
   - Geocoding API (for address to coordinates conversion)
4. Create an API key in the Credentials section
5. Restrict the API key to your domain for security (recommended)

## Adding the API Key to Your Project

Create a `.env.local` file in the root directory of the project and add your API key:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Replace `your_google_maps_api_key_here` with your actual API key.

## Restart the Development Server

After adding the API key, restart your development server for the changes to take effect:

```
npm run dev
```

The property location map should now be visible on the property details page. 