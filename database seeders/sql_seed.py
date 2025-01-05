import uuid
from faker import Faker
from datetime import datetime, timedelta
import pymysql
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


connection = pymysql.connect(
    host="localhost",
    user="root",
    password=os.getenv('MYSQLDB_ROOT_PASSWORD'),
    database=os.getenv('MYSQLDB_DATABASE'),
    
)
print("Database connection established successfully ✅")

cursor = connection.cursor()

yesterday = datetime.utcnow() - timedelta(hours=36)
counter = 1

## Insert users and roles 
def generate_roles_and_users():
    insert_roles = """
    INSERT INTO roles (_id, name,updated_at, created_at) VALUES(%s, 'admin',%s,%s),(%s, 'user',%s,%s)
    """
    cursor.execute(insert_roles,(uuid.uuid4(),fake.date_time_between(start_date='-2d',end_date=yesterday),fake.date_time_between(start_date='-2d',end_date=yesterday),uuid.uuid4(), fake.date_time_between(start_date='-2d',end_date=yesterday),fake.date_time_between(start_date='-2d',end_date=yesterday)))
    connection.commit()
    
     # Get the total number of trips to insert logs for each trip
    user_role_id = "SELECT _id FROM roles WHERE name='user';"
    cursor.execute(user_role_id)
    user_role_id = cursor.fetchone()[0]
    
    insert_users = """
    INSERT INTO users (_id, firstName, lastName, email, password, dob, role_id,updated_at,created_at)
    VALUES(%s, %s, %s, %s, %s, %s, %s,%s,%s)
    """
    
    for _ in range(20):  # Generate 20 users
        _id = uuid.uuid4()
        firstName = fake.first_name()
        lastName = fake.last_name()
        email = fake.email()
        password = fake.password()
        dob = fake.date_of_birth(minimum_age=18, maximum_age=70)
        role_id = user_role_id
        updated_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
        created_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
        
        
        cursor.execute(insert_users, (_id, firstName, lastName, email, password, dob, role_id, updated_at, created_at))
    connection.commit()
    print("Roles and users inserted successfully ✅")
    

## Insert all european countries and for them 10 drivers and per driver 1-2 vehicles
def generate_countries_and_drivers_and_vehicles(num):
   global counter
   insert_query = """
    INSERT INTO countries (_id, name, country_code,updated_at,created_at) VALUES(%s, %s, %s, %s, %s)
    """
    
   for country,details in countries_dict.items():
        country_id = uuid.uuid4()     
        updated_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
        created_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
        
        cursor.execute(insert_query, (country_id ,country, details['country_code'],updated_at, created_at))
        connection.commit()
        
        # Generate NUM drivers for each country
        insert_drivers_query = """
        INSERT INTO drivers (_id, firstName, lastName, dob,updated_at, created_at)
        VALUES (%s, %s, %s, %s,%s,%s)
        """
        for _ in range(num):
            driver_id = uuid.uuid4()
            first_name = fake.first_name()
            last_name = fake.last_name()
            dob = fake.date_of_birth(minimum_age=21, maximum_age=65)
            updated_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
            created_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
            
            cursor.execute(insert_drivers_query, (driver_id, first_name, last_name, dob,updated_at,created_at))
            connection.commit()
            
            # Generate 1 or 2 vehicles per driver
            vehicle_types = ['TRUCK', 'VAN', 'PICKUP']
            
            insert_vehicles_query = """
            INSERT INTO vehicles (_id, plates, vehicle_type, width, length, height, country_id, updated_at, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
           
            vehicle_id = uuid.uuid4()
            plates = fake.license_plate()
            vehicle_type = random.choice(vehicle_types)
            width = fake.pyfloat(min_value=1.5, max_value=2.6)
            length = fake.pyfloat(min_value=1.5, max_value=13.6)
            height = fake.pyfloat(min_value=0.5, max_value=3.5)
            updated_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
            created_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
            
            cursor.execute(insert_vehicles_query, (vehicle_id, plates, vehicle_type, width, length, height, country_id, updated_at, created_at))
            connection.commit()
            
            for _ in range(3):
                query_generate_trips = """
                INSERT INTO trips (_id, startOdometar, finishOdometar, active, vehicle_id, driver_id, updated_at, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                trip_id = uuid.uuid4()
                startOdometar = fake.random_int(min=50000, max=950000)
                finishOdometar = startOdometar + fake.random_int(min=1500, max=5000)
                if counter % 4 == 0:
                    active = 1
                else:
                    active = 0
                counter+=1
                updated_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
                created_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
                
                cursor.execute(query_generate_trips, (trip_id, startOdometar, finishOdometar, active, vehicle_id, driver_id,updated_at,created_at))
                connection.commit()
                
                for _ in range(2):
                    query_insert_orders = """
                    INSERT INTO orders (_id, origin, destination, price, weight, goods_type, quantity, origin_country_id, destination_country_id, trip_id, updated_at, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    
                    countires_query = "SELECT _id, name FROM countries"
                    cursor.execute(countires_query)
                    countires=cursor.fetchall()
                    
                    # Helper variables
                    rand_country_1 = random.choice(countires)
                    rand_country_2 = random.choice(countires)
                    origin_county_data = countries_dict.get(rand_country_1[1])
                    destinatio_county_data = countries_dict.get(rand_country_2[1])
                    order_id = uuid.uuid4()
                    origin = random.choice(origin_county_data['cities'])
                    destination = random.choice(destinatio_county_data['cities'])
                    price = fake.random_int(min=500, max=4800)
                    weight = fake.random_int(min=30, max=24000)
                    goods_type = random.choice(['BOX', 'PALLET', 'COLLI'])
                    quantity = fake.random_int(min=1, max=33)
                    origin_country_id = rand_country_1[0]
                    destination_country_id = rand_country_2[0]
                    updated_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
                    created_at = fake.date_time_between(start_date='-2d',end_date=yesterday)
                    
                    cursor.execute(query_insert_orders, (order_id, origin, destination, price, weight, goods_type, quantity, origin_country_id, destination_country_id, trip_id, updated_at, created_at))
                    connection.commit()
                        
                      

def insert_events_and_trips_events():
    # Insert events into the events table
    insert_events_query = """
    INSERT INTO events (_id, name, description)
    VALUES
      (%s, 'Trip started', 'The trip has started'),
      (%s, 'Arrived at pickup', 'The vehicle has arrived at the pickup location'),
      (%s, 'Loaded', 'The goods have been loaded onto the vehicle'),
      (%s, 'Goods Loaded', 'The goods are fully loaded'),
      (%s, 'Arrived at customs', 'The vehicle has arrived at customs'),
      (%s, 'Finished with customs', 'Customs clearance is finished'),
      (%s, 'Arrived at border', 'The vehicle has arrived at the border'),
      (%s, 'Arrived at delivery', 'The vehicle has arrived at the delivery location'),
      (%s, 'Delivered', 'The goods have been delivered'),
      (%s, 'Unloaded', 'The goods have been unloaded from the vehicle'),
      (%s, 'Waiting', 'The vehicle is waiting for the next step')
    """

    event_uuids = [str(uuid.uuid4()) for _ in range(11)]

    cursor.execute(insert_events_query, tuple(event_uuids))
    connection.commit()
    print("Events inserted successfully ✅")

    count_query = "SELECT COUNT(*) FROM trips;"
    cursor.execute(count_query)
    count_of_trips = cursor.fetchone()[0]

    if count_of_trips > 0:
        select_trip_ids_query = "SELECT _id FROM trips;"
        cursor.execute(select_trip_ids_query)
        trip_ids = [row[0] for row in cursor.fetchall()]

        for trip_id in trip_ids:
            insert_into_logs = """
            INSERT INTO event_logs (_id , trip_id, event_id, description, updated_at, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            """

            # Get the number of events
            count_number_of_events = "SELECT COUNT(*) FROM events;"
            cursor.execute(count_number_of_events)
            num_of_events = cursor.fetchone()[0]

            # Insert logs for each event
            for event_id in range(1, num_of_events + 1):
                description = fake.sentence()
                event_id_uuid = event_uuids[event_id - 1] 
                log_id = uuid.uuid4()
                updated_at = fake.date_time_between(start_date='-2d', end_date=yesterday)
                created_at = fake.date_time_between(start_date='-2d', end_date=yesterday)
                # Insert log entry for the event
                cursor.execute(insert_into_logs, (log_id, trip_id ,event_id_uuid, description,updated_at,created_at))
                connection.commit()

        print("Trip logs inserted successfully ✅")
    else:
        print("No trips found, cannot insert logs 🛑")

    print("Countries, drivers, and vehicles inserted successfully ✅")


## Primary function for seeding
def seed_database():
    generate_roles_and_users()
    generate_countries_and_drivers_and_vehicles(2)
    insert_events_and_trips_events()

# Seed database
seed_database()
print("Database seeding completed successfully ✅")

# Close the connection
cursor.close()
connection.close()
print("Database connection closed successfully ✅")
