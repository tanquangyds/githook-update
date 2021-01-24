import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadingIngredients } = props;
  const [enterFilter, setEnterFilter] = useState("");
  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enterFilter === inputRef.current.value) {
        const query =
          enterFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enterFilter}"`;
        fetch(
          "https://react-hook-update-daf8b-default-rtdb.firebaseio.com/ingredients.json" +
            query
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
            console.log(loadedIngredients);
            onLoadingIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enterFilter, onLoadingIngredients]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enterFilter}
            onChange={(event) => setEnterFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
