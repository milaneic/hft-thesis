from bson import ObjectId
from datetime import datetime,timedelta
from faker import Faker
from pymongo import MongoClient
import random
import os
from dotenv import load_dotenv

countries_dict = {
    "Germany": {
        "country_code": "DE",
        "cities": ["Berlin", "Hamburg", "Munich", "Frankfurt", "Düsseldorf"]
    },
    "France": {
        "country_code": "FR",
        "cities": ["Paris", "Bordeaux", "Lille", "Toulouse", "Marseille"]
    },
    "Italy": {
        "country_code": "IT",
        "cities": ["Rome", "Milan", "Turin", "Naples", "Catania"]
    },
    "Spain": {
        "country_code": "ES",
        "cities": ["Madrid", "Barcelona", "Valencia", "San Sebastián", "Malaga"]
    },
    "Austria": {
        "country_code": "AT",
        "cities": ["Vienna", "Salzburg", "Graz"]
    },
    "United Kingdom": {
        "country_code": "GB",
        "cities": ["London", "Dublin", "Belfast"]
    },
    "Czech Republic": {
        "country_code": "CZ",
        "cities": ["Prague", "Brno", "Ostrava"]
    },
    "Hungary": {
        "country_code": "HU",
        "cities": ["Budapest", "Pecs", "Debrecen"]
    },
    "Netherlands": {
        "country_code": "NL",
        "cities": ["Amsterdam", "Rotterdam", "The Hague"]
    },
    "Belgium": {
        "country_code": "BE",
        "cities": ["Brussels", "Antwerp", "Ghent"]
    },
    "Poland": {
        "country_code": "PL",
        "cities": ["Warsaw", "Gdansk", "Krakow"]
    },
    "Denmark": {
        "country_code": "DK",
        "cities": ["Copenhagen", "Aarhus", "Odense"]
    },
    "Sweden": {
        "country_code": "SE",
        "cities": ["Stockholm", "Gothenburg", "Malmö"]
    },
    "Finland": {
        "country_code": "FI",
        "cities": ["Helsinki", "Espoo", "Tampere"]
    },
    "Norway": {
        "country_code": "NO",
        "cities": ["Oslo", "Bergen", "Trondheim"]
    },
    "Portugal": {
        "country_code": "PT",
        "cities": ["Lisbon", "Porto", "Faro"]
    },
    "Croatia": {
        "country_code": "HR",
        "cities": ["Zagreb", "Split", "Zadar", "Pula", "Dubrovnik"]
    },
    "Slovenia": {
        "country_code": "SI",
        "cities": ["Ljubljana", "Maribor", "Celje"]
    },
    "Serbia": {
        "country_code": "RS",
        "cities": ["Belgrade", "Novi Sad", "Niš"]
    },
    "Greece": {
        "country_code": "GR",
        "cities": ["Athens", "Thessaloniki", "Patras"]
    },
    "Bulgaria": {
        "country_code": "BG",
        "cities": ["Sofia", "Plovdiv", "Varna"]
    },
    "Romania": {
        "country_code": "RO",
        "cities": ["Bucharest", "Cluj-Napoca", "Timișoara"]
    },
    "Bosnia and Herzegovina": {
        "country_code": "BA",
        "cities": ["Sarajevo", "Mostar", "Banja Luka"]
    },
    "North Macedonia": {
        "country_code": "MK",
        "cities": ["Skopje", "Bitola", "Ohrid"]
    },
    "Montenegro": {
        "country_code": "ME",
        "cities": ["Podgorica", "Nikšić", "Herceg Novi"]
    },
    "Albania": {
        "country_code": "AL",
        "cities": ["Tirana", "Durrës", "Vlorë"]
    },
    "Lithuania": {
        "country_code": "LT",
        "cities": ["Vilnius", "Kaunas", "Klaipėda"]
    },
    "Latvia": {
        "country_code": "LV",
        "cities": ["Riga", "Daugavpils", "Liepāja"]
    },
    "Estonia": {
        "country_code": "EE",
        "cities": ["Tallinn", "Tartu", "Narva"]
    },
    "Luxembourg": {
        "country_code": "LU",
        "cities": ["Luxembourg", "Esch-sur-Alzette", "Differdange"]
    },
    "Monaco": {
        "country_code": "MC",
        "cities": ["Monaco", "Fontvieille", "La Condamine"]
    },
    "Switzerland": {
        "country_code": "CH",
        "cities": ["Zürich", "Geneva", "Bern", "Lausanne"]
    },
    "Ukraine": {
        "country_code": "UA",
        "cities": ["Kiev", "Lviv", "Odessa"]
    },
    "Belarus": {
        "country_code": "BY",
        "cities": ["Minsk", "Gomel", "Vitebsk"]
    },
    "Moldova": {
        "country_code": "MD",
        "cities": ["Chisinau", "Tiraspol", "Bălți"]
    },
    "Russia": {
        "country_code": "RU",
        "cities": ["St. Petersburg", "Sochi", "Moscow"]
    },
    "Cyprus": {
        "country_code": "CY",
        "cities": ["Nicosia", "Limassol", "Larnaca"]
    },
    "Malta": {
        "country_code": "MT",
        "cities": ["Malta", "Valletta", "Mdina"]
    },
    "Georgia": {
        "country_code": "GE",
        "cities": ["Tbilisi", "Batumi", "Kutaisi"]
    },
    "Armenia": {
        "country_code": "AM",
        "cities": ["Yerevan", "Gyumri", "Vanadzor"]
    }
}

list_of_countries= list(countries_dict.keys())

load_dotenv('../.env')

# Faker instance with European locales
european_locales = ['en_GB', 'de_DE', 'fr_FR', 'it_IT', 'es_ES', 'nl_NL', 'pl_PL', 'cs_CZ', 'pt_PT', 'da_DK', 'fi_FI']
fake = Faker(european_locales)


client = MongoClient(
    host=os.getenv('MONGOORM_INITDB_HOST','localhost'),
    username=os.getenv("MONGO_INITDB_ROOT_USERNAME"),
    password=os.getenv('MONGO_INITDB_ROOT_PASSWORD'),
    port=int(os.getenv('MONGO_INITDB_PORT',27017))
    
)
db = client[os.getenv('MONGO_INITDB_DATABASE')]
roles_collection = db['roles']
users_collection = db['users']
countries_collection = db['countries']
drivers_collection = db['drivers']
vehicle_collection = db['vehicles']
trips_collection = db['trips']
orders_collection = db['orders']
events_collection = db['events']
event_logs_collection = db['event_logs']

print("Database connection established successfully ✅")

yesterday = datetime.utcnow() - timedelta(hours=24)

counter = 1
## Insert users and roles 
def generate_roles_and_users():
   
    # Insert roles
    roles = [
        {"_id": ObjectId(), "name": "user","updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday), "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": ObjectId(), "name": "admin","updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday), "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)}
    ]
    roles_collection.insert_many(roles)
    
       # Fetch user role ID
    user_role = roles_collection.find_one({"name": "user"})
    
    # Insert users
    users = []
    for _ in range(20):  # Generate 20 users
        user = {
            "_id": ObjectId(),
            "firstName": fake.first_name(),
            "lastName": fake.last_name(),
            "email": fake.email(),
            "password": fake.password(),
            "dob": fake.date_of_birth(minimum_age=18, maximum_age=70).strftime('%Y-%m-%d'),
            "role": user_role,
            "updated_at": fake.date_time_between(start_date="-2d",end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d",end_date=yesterday),
        }
        users.append(user)
    
    users_collection.insert_many(users)
    print("Roles and users inserted successfully ✅")

## Insert all european countries and for them 10 drivers and per driver 1-2 vehicles
def generate_countries_and_drivers_and_vehicles(num):
    global counter
    
    for country,details in countries_dict.items():  
        country_data={
            "_id": ObjectId() ,
            "name": country,
            "country_code": details['country_code'],
            "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)
        }
        country_insert_result=countries_collection.insert_one(country_data)
        countryObject = countries_collection.find_one({"_id": country_insert_result.inserted_id})
        
        for _ in range(num):

            driver_data={
                "_id":ObjectId(),
                "firstName": fake.first_name(),
                "lastName": fake.last_name(),
                "dob": fake.date_of_birth(minimum_age=21,maximum_age=65).strftime('%Y-%m-%d'),
                "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
                "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)
            }
            driver_insert_result = drivers_collection.insert_one(driver_data)
            driverObject = drivers_collection.find_one({"_id": driver_insert_result.inserted_id})
            
            vehicle_types=["TRUCK","VAN","PICKUP"]

            vehicle_data={
                "_id":ObjectId(),
                "plates": fake.license_plate(),
                "vehicleType": random.choice(vehicle_types),
                "width": fake.pyfloat(min_value=1.5, max_value=2.6),
                "length": fake.pyfloat(min_value=1.5, max_value=13.6),
                "height": fake.pyfloat(min_value=0.5, max_value=3.5),
                "country": countryObject,
                "updated_at": fake.date_time_between(start_date="-2d",end_date=yesterday),
                "created_at": fake.date_time_between(start_date="-2d",end_date=yesterday),
            }
            vehicle_insert_result = vehicle_collection.insert_one(vehicle_data) 
            vehicleObject = vehicle_collection.find_one({"_id": vehicle_insert_result.inserted_id})

            for _ in range(3):
                    if counter % 4 == 0:
                        active = True
                    else:
                        active = False
                    startOdometar = fake.random_int(min=50000, max=950000)  # Ensure it's an integer
                    finishOdometar = startOdometar + fake.random_int(min=500, max=4500)  # Adding two integers should work
                    trip_data = {
                        "_id": ObjectId(),
                        "startOdometar": startOdometar,
                        "finishOdometar": finishOdometar,
                        "active": active,
                        "vehicle": vehicleObject,
                        "driver": driverObject,
                        "orders": [],
                        "event_logs":[],
                        "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
                        "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)
                    }
                    counter += 1
                    trip_insert_object = trips_collection.insert_one(trip_data)
                    tripObject = trips_collection.find_one({"_id": trip_insert_object.inserted_id})
                    # Generate orders for each trip
                    for _ in range(2):

                        # Get random origin and destination country from countries collection
                        rand_country_1 = random.choice(list(countries_collection.find()))
                        rand_country_2 = random.choice(list(countries_collection.find()))
                        
                        origin_city = random.choice(countries_dict.get(rand_country_1['name'])['cities'])
                        destination_city = random.choice(countries_dict.get(rand_country_2['name'])['cities'])

                        order_data = {
                            "_id": ObjectId(),
                            "origin": origin_city,
                            "destination": destination_city,
                            "price": fake.random_int(min=500, max=4800),
                            "weight": fake.random_int(min=30, max=24000),
                            "goodsType": random.choice(['BOX', 'PALLET', 'COLLI']),
                            "quantity": fake.random_int(min=1, max=33),
                            "originCountry": rand_country_1,
                            "destinationCountry": rand_country_2,
                            "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
                            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)
                        }
                        
                        trips_collection.update_one(
                        {"_id": trip_insert_object.inserted_id},
                        {"$push": {"orders": order_data}}
    )
                        
print("Countires, drivers, vehicles, trips and orders inserted successfully! ✅")
        

def insert_events_and_trips_events():
    
    # Insert events into the events collection
    event_uuids = [ObjectId() for _ in range(11)]
    events_data = [
        {"_id": event_uuids[0], "name": "Trip started", "description": "The trip has started",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[1], "name": "Arrived at pickup", "description": "The vehicle has arrived at the pickup location",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[2], "name": "Loaded", "description": "The goods have been loaded onto the vehicle",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[3], "name": "Goods Loaded", "description": "The goods are fully loaded",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[4], "name": "Arrived at customs", "description": "The vehicle has arrived at customs",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[5], "name": "Finished with customs", "description": "Customs clearance is finished",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[6], "name": "Arrived at border", "description": "The vehicle has arrived at the border",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[7], "name": "Arrived at delivery", "description": "The vehicle has arrived at the delivery location",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[8], "name": "Delivered", "description": "The goods have been delivered",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[9], "name": "Unloaded", "description": "The goods have been unloaded from the vehicle",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)},
        {"_id": event_uuids[10], "name": "Waiting", "description": "The vehicle is waiting for the next step",  "updated_at": fake.date_time_between(start_date="-2d", end_date=yesterday),
            "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)}
    ]
    
    # Insert events data into events collection
    events_collection.insert_many(events_data)
    print("Events inserted successfully ✅")
    
    # Get all trip IDs from the trips collection
    trip_ids = [trip["_id"] for trip in trips_collection.find()]
    
    if trip_ids:
        # Insert event logs for each trip
        for trip_id in trip_ids:
            logs_data = []
            eventsObjects = events_collection.find()

            # Insert logs for each event
            for eventObject in eventsObjects:
                log_data = {
                    "_id": ObjectId(),
                    "event": eventObject,
                    "description": fake.sentence(),
                    "created_at": fake.date_time_between(start_date="-2d", end_date=yesterday)
                }
                logs_data.append(log_data)

            # Push all the logs into the event_logs array
            trips_collection.update_one(
                {"_id": trip_id},  # Match the trip by its ID
                {"$push": {"event_logs": {"$each": logs_data}}}  # Use $each to push all logs
            )

        print("Trip logs inserted successfully ✅")
    else:
        print("No trips found, cannot insert logs 🛑")

## Primary function for seeding
def seed_database():
    generate_roles_and_users()
    generate_countries_and_drivers_and_vehicles(2)
    insert_events_and_trips_events()

# Seed database
seed_database()
print("Database seeding completed successfully ✅")

# Close the connection
client.close()
print("Database connection closed successfully ✅")
