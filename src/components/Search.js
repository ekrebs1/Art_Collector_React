import React, { useEffect, useState } from "react";

/**
 * Don't touch these imports!
 */
import {
  fetchAllCenturies,
  fetchAllClassifications,
  fetchQueryResults,
} from "../api";

/**
 * We are at the Search component, a child of app. This has a form, so we need to use useState for
 * our controlled inputs:
 *
 * centuryList, setCenturyList (default should be an empty array, [])
 * classificationList, setClassificationList (default should be an empty array, [])
 * queryString, setQueryString (default should be an empty string, '')
 * century, setCentury (default should be the string 'any')
 * classification, setClassification (default should be the string 'any')
 */

/**
 * Inside of useEffect, use Promise.all([]) with fetchAllCenturies and fetchAllClassifications
 *
 * In the .then() callback pass the returned lists to setCenturyList and setClassificationList
 *
 * Make sure to console.error on caught errors from the API methods.
 */

const Search = (props) => {
  // Make sure to destructure setIsLoading and setSearchResults from the props
  const { setIsLoading, setSearchResults } = props;

  //CENTURIES DROP DOWN List
  const [centuryList, setCenturyList] = useState([]);

  //CLASSIFICATIONS DROP DOWN LIST
  const [classificationList, setClassificationList] = useState([]);

  //QUERY STRING
  const [queryString, setQueryString] = useState("");

  //CENTURY
  const [century, setCentury] = useState("any");

  //CLASSIFICATION
  const [classification, setClassification] = useState("any");

  useEffect(() => {
    Promise.all([fetchAllCenturies(), fetchAllClassifications()])
      .then(([centuries, classifications]) => {
        setCenturyList(centuries);
        setClassificationList(classifications);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  /**
   * This is a form element, so we need to bind an onSubmit handler to it which:
   *
   * calls event.preventDefault()
   * calls setIsLoading, set it to true
   *
   * then, in a try/catch/finally block:
   *
   * try to:
   * - get the results from fetchQueryResults({ century, classification, queryString })
   * - pass them to setSearchResults
   *
   * catch: error to console.error
   *
   * finally: call setIsLoading, set it to false
   */

  async function handleSubmit(event) {
    event.preventDefault();
    await setIsLoading();

    try {
      const results = await fetchQueryResults({
        century,
        classification,
        queryString,
      });

      setSearchResults(results);
    } catch (error) {
      console.error(error);
    } finally {
      return !setIsLoading;
    }
  }

  const HandleQueryChange = (event) => {
    setQueryString(event.target.value);
  };

  const handleClassificationChange = (event) => {
    setClassification(event.target.value);
  };

  const handleCenturyChange = (event) => {
    setCentury(event.target.value);
  };

  return (
    <form id='search' onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor='keywords'>Query</label>
        <input
          id='keywords'
          type='text'
          placeholder='enter keywords...'
          value={queryString}
          onChange={HandleQueryChange}
        />
      </fieldset>
      <fieldset>
        <label htmlFor='select-classification'>
          Classification{" "}
          <span className='classification-count'>
            ({classificationList.length})
          </span>
        </label>
        <select
          name='classification'
          id='select-classification'
          value={classification}
          onChange={handleClassificationChange}>
          <option value='any'>Any</option>
          {/* map over the classificationList, return an <option /> */}
          {classificationList.map((classification, index) => (
            <option
              key={`${index}:${classification.name}`}
              value={classification.name}>
              {classification.name}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor='select-century'>
          Century <span className='century-count'>({centuryList.length})</span>
        </label>
        <select
          name='century'
          id='select-century'
          value={century}
          onChange={handleCenturyChange}>
          <option value='any'>Any</option>
          {/* map over the centuryList, return an <option /> */}
          {centuryList.map((century, index) => (
            <option key={`${index}:${century.name}`} value={century.name}>
              {century.name}
            </option>
          ))}
        </select>
      </fieldset>
      <button>SEARCH</button>
    </form>
  );
};

export default Search;
