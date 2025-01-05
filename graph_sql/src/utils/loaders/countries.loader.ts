import * as DataLoader from 'dataloader';
import { CountriesService } from 'src/countries/countries.service';
import { Country } from 'src/countries/entities/country.entity';

export default function createCountriesLoader(
  countriesService: CountriesService,
) {
  return new DataLoader<string, Country>(async (countriesIds: string[]) => {
    const countries = await countriesService.findByIds(countriesIds);

    return countriesIds.map((id) =>
      countries.find((country) => country._id === id),
    );
  });
}
