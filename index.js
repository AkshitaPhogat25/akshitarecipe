import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      find: "",
      recipy: {},
      image: "",
      loadsta: null
    };
  }

  setName = event => {
    this.setSta({
      find: event.target.value
    });
  };

  getRecipe = async () => {
    this.setSta({
      loadsta: "LOADING"
    });
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${this.state.find}`
    );

    const myJson = await response.json();
    console.log("myJson", myJson);

    if (myJson.meals == null) {
      this.setSta({
        loadsta: "LOADING_FAILED"
      });
    }
    var ingr = myJson.meals.map(this.getingr);
    var measures = myJson.meals.map(this.getMeasures);
    this.setSta({
      recipy: myJson.meals[0],
      image: myJson.meals[0].strMealThumb,
      loadsta: "LOADING_DONE",
      ingr: ingr,
      measures: measures
    });
    console.log(this.state.recipy);
  };
  //button
  toggleL = event => {
    if (event.target.style.color == "black") event.target.style.color = "red";
    else event.target.style.color = "black";
  };
  getingr = object => {
    var keys = Object.keys(object);
    console.log(keys);
    var ingr = [];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("strIngredient") != -1) {
        if (object["" + keys[i]] != null && object["" + keys[i]].length > 0)
          ingr.push(object["" + keys[i]]);
      }
    }
    console.log(ingr);
    return ingr;
  };
  // measures
  getMeasures = object => {
    var keys = Object.keys(object);
    console.log(keys);
    var measures = [];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("strMeasure") != -1) {
        if (object["" + keys[i]] != null && object["" + keys[i]].length > 0)
          measures.push(object["" + keys[i]]);
      }
    }
    console.log(measures);
    return measures;
  };

  printingr = (value, index) => {
    console.log(this.state);
    return (
      <p>
        {value} ---- {this.state.measures[0][index]}
      </p>
    );
  };

  render() {
    return (
      <div id="parent">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.css"
        />

        <div id="header">
          <h1 id="head">Recipe Finder</h1>
          <center>
            <input
              onChange={() => this.setName(event)}
              value={this.state.find}
              placeholder="Enter the Name of the Dish"
            />
            <span>
              <button onClick={this.getRecipe}>Get Recipes</button>
            </span>
            <br />
            <br />
            {this.state.loadsta == null ? (
              <h2>Type a Dish Name to find for it's ingredient</h2>
            ) : (
              ""
            )}
          </center>
        </div>
        {this.state.loadsta == "LOADING_FAILED" ? (
          <h1>No Data Has been received</h1>
        ) : (
          ""
        )}
        {this.state.loadsta == "LOADING" ? <h1>Loading....</h1> : ""}
        {this.state.loadsta == "LOADING_DONE" ? (
          <div id="container">
            <div id="header1">
              <div />
              <div>
                <h1 id="main">{this.state.recipy.strMeal}</h1>
              </div>
              <div>
                <i
                  id="heart"
                  className="far fa-heart"
                  onClick={this.toggleL}
                />
              </div>
            </div>
            <div id="description">
              <div id="left">
                <img src={this.state.image} />
              </div>
              <div id="right">
                <i>Category of the Meal - </i>
                {this.state.recipy.strCategory}
                <br />
                <i>Area of the Meal - </i>
                {this.state.recipy.strArea}
                <br />
                <br />
                <i>ingr</i>
                <div id="ingredient">
                  {this.state.ingr[0].map(this.printingr)}
                </div>
                <i>
                  <center>Recipe</center>
                </i>
                <div id="Recipe">{this.state.recipy.strInstructions}</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
