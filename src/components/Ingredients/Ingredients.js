import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from '../UI/ErrorModal';


function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loadedIngredients, setLoadedIngredients] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    fetch(
      "https://react-hook-update-daf8b-default-rtdb.firebaseio.com/ingredients.json"
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        const loadedIngredients = [];
        responseData &&
          Object.keys(responseData).map((key) =>
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount,
            })
          );
        setIngredients(loadedIngredients);
      });
  }, []);

  const filterIngredientHandler = useCallback((filterIngredients) => {
    setIngredients(filterIngredients);
  }, []);

  const addIngredientHandler = (ingredient) => {
    setLoadedIngredients(true);
    fetch(
      "https://react-hook-update-daf8b-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        setLoadedIngredients(false);
        return response.json();
      })
      .then((responseData) => {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };
  const removeIngredientHandler = (id) => {
    setLoadedIngredients(true);
    fetch(
      `https://react-hook-update-daf8b-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      setLoadedIngredients(false);
      setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== id)
      );
    }).catch(error => {
      setError('Something went wrong');
    });
  };

  const clearError = () => {
    setError(null);
    setLoadedIngredients(false);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={loadedIngredients}/>
      <section>
        <Search onLoadingIngredients={filterIngredientHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
