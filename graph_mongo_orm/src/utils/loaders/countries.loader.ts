import * as DataLoader from 'dataloader';
import { CountriesService } from 'src/countries/countries.service';
import { Country } from 'src/countries/entities/country.entity';
import { ObjectId } from 'typeorm';

export default function createCountriesLoader(
  countriesService: CountriesService,
) {
  return new DataLoader<ObjectId, Country>(async (countriesIds: ObjectId[]) => {
    const countries = await countriesService.findByIds(countriesIds);

    return countriesIds.map((id) =>
      countries.find((country) => country._id.equals(id)),
    );
  });
}
