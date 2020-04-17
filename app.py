import pandas as pd
import numpy as np
import json
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

# Database setup
engine = create_engine("sqlite:///world-alcohol-consumption.db")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Countries = Base.classes.countries

# Flask Setup
app = Flask(__name__)

# Flask Routes
@app.route("/")
def IndexRoute():
    webpage = render_template("index.html")
    return webpage

@app.route("/data")
def choroDict():
    ''' This function returns JSON of data '''
    session = Session(engine)
    results = session.query(Countries.country, Countries.beer_servings, Countries.spirit_servings, Countries.wine_servings, Countries.total_litres_of_pure_alcohol).all()
    session.close()

    country_data = []
    for country, beer_servings, spirit_servings, wine_servings, total_litres_of_pure_alcohol in results:
        dict = {}
        dict["country"] = country
        dict["beer_servings"] = beer_servings
        dict["spirit_servings"] = spirit_servings
        dict["wine_servings"] = wine_servings
        dict["total_litres_of_pure_alcohol"] = total_litres_of_pure_alcohol
        country_data.append(dict)

    with open('countries.geo.json') as f:
        geo_data = json.load(f)

    list_of_countries = []
    for d in country_data:
        name = d["country"]
        list_of_countries.append(name)

    for feature in geo_data["features"]:
        country_name_geo = feature['properties']['name']
        if country_name_geo in list_of_countries:
            for country in country_data:
                country_name_data = country["country"]
                if country_name_geo == country_name_data:
                    beer_servings = country["beer_servings"]
                    wine_servings = country["wine_servings"]
                    spirit_servings = country["spirit_servings"]
                    total_litres_of_pure_alcohol = country["total_litres_of_pure_alcohol"]
                
                    feature["properties"].update({"beer_servings" : beer_servings})
                    feature["properties"].update({"wine_servings" : wine_servings})
                    feature["properties"].update({"spirit_servings" : spirit_servings})
                    feature["properties"].update({"total_litres_of_pure_alcohol" : total_litres_of_pure_alcohol})

    return jsonify(geo_data)

if __name__ == '__main__':
    app.run(debug=True)
