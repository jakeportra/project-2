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
