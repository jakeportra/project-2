import numpy as np

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

if __name__ == '__main__':
    app.run(debug=True)

@app.route("/data")
def choroDict():
    ''' This function returns JSON of data '''
    session = Session(engine)
    results = session.query(Countries.country, Countries.beer_servings, Countries.spirit_servings, Countries.wine_servings, Countries.total_litres_of_pure_alcohol).all()
    session.close()

    all_data = []
    for country, beer_servings, spirit_servings, wine_servings, total_litres_of_pure_alcohol in results:
        dict = {}
        dict["country"] = country
        dict["beer_servings"] = beer_servings
        dict["spirit_servings"] = spirit_servings
        dict["wine_servings"] = wine_servings
        dict["total_litres_of_pure_alcohol"] = total_litres_of_pure_alcohol
        all_data.append(dict)

    return jsonify(all_data)
