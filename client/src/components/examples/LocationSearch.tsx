import { LocationSearch } from '../LocationSearch';

export default function LocationSearchExample() {
  return (
    <LocationSearch
      onLocationSelect={(lat, lng, name) => {
        console.log('Location selected:', { lat, lng, name });
      }}
    />
  );
}
