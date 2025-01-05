"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { MUTATION_CREATE_COUNTRY, QUERY_GET_COUNTRIES } from "@/lib/queries";
import { Country } from "@/lib/types";

const iso3166Alpha2Codes = [
  "AF",
  "AX",
  "AL",
  "DZ",
  "AS",
  "AD",
  "AO",
  "AI",
  "AQ",
  "AG",
  "AR",
  "AM",
  "AW",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BM",
  "BT",
  "BO",
  "BA",
  "BW",
  "BV",
  "BR",
  "IO",
  "BN",
  "BG",
  "BF",
  "BI",
  "KH",
  "CM",
  "CA",
  "CV",
  "KY",
  "CF",
  "TD",
  "CL",
  "CN",
  "CX",
  "CC",
  "CO",
  "KM",
  "CG",
  "CD",
  "CK",
  "CR",
  "CI",
  "HR",
  "CU",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "ET",
  "FK",
  "FO",
  "FJ",
  "FI",
  "FR",
  "GF",
  "PF",
  "TF",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GI",
  "GR",
  "GL",
  "GD",
  "GP",
  "GU",
  "GT",
  "GG",
  "GN",
  "GW",
  "GY",
  "HT",
  "HM",
  "VA",
  "HN",
  "HK",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IM",
  "IL",
  "IT",
  "JM",
  "JP",
  "JE",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MO",
  "MK",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MQ",
  "MR",
  "MU",
  "YT",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MS",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "AN",
  "NC",
  "NZ",
  "NI",
  "NE",
  "NG",
  "NU",
  "NF",
  "MP",
  "NO",
  "OM",
  "PK",
  "PW",
  "PS",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PN",
  "PL",
  "PT",
  "PR",
  "QA",
  "RE",
  "RO",
  "RU",
  "RW",
  "SH",
  "KN",
  "LC",
  "PM",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "GS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SJ",
  "SZ",
  "SE",
  "CH",
  "SY",
  "TW",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TK",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TC",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "US",
  "UM",
  "UY",
  "UZ",
  "VU",
  "VE",
  "VN",
  "VG",
  "VI",
  "WF",
  "EH",
  "YE",
  "ZM",
  "ZW",
];

const schema = z.object({
  name: z.string().min(1, "Country name is required"),
  country_code: z.string().refine((val) => iso3166Alpha2Codes.includes(val), {
    message: "Country code must be ISO3166 ALPHA2 code",
  }),
});

type FormFields = z.infer<typeof schema>;

interface CountriesType {
  countries: Country[];
}

const CreateRole = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const [createCountryMutation, { error: countryCreateError }] = useMutation(
    MUTATION_CREATE_COUNTRY
  );

  // submit handler
  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await createCountryMutation({
        variables: { ...formData, roleId: 2 },
        update: (cache, { data }) => {
          const existingCountries = cache.readQuery<CountriesType>({
            query: QUERY_GET_COUNTRIES,
          });

          if (existingCountries) {
            cache.writeQuery({
              query: QUERY_GET_COUNTRIES,
              data: {
                countries: [...existingCountries.countries, data.createCountry],
              },
            });
          }
        },
      });
      if (res) {
        toast.success("Country created successfully!");
        setTimeout(() => {
          router.push("/countries");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center">
        <div className="w-1/3">
          <h2 className="text-3xl">Create country:</h2>
          <Toaster richColors />
          {countryCreateError && (
            <p className="text-xl text-red-500">{countryCreateError.message}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-5">
              <Label htmlFor="name" className="text-xl font-normal mb-5">
                Name:
              </Label>
              <Input {...register("name")} id="name" className="mt-3"></Input>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="my-5">
              <Label
                htmlFor="country_code"
                className="text-xl font-normal mb-5"
              >
                Country code:
              </Label>
              <Input
                {...register("country_code")}
                id="country_code"
                className="mt-3"
              ></Input>
              {errors.country_code && (
                <p className="text-sm text-red-500">
                  {errors.country_code.message}
                </p>
              )}
            </div>

            <Button
              className="text-lg mt-5 bg-green-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRole;
