import React, { useState } from "react";
import { Form } from "react-bootstrap";

function Autocomplete(props) {
  const [label] = useState(props.label);
  const [placeholder] = useState(props.placeholder);
  const [options] = useState(props.options);
  const [display, setDisplay] = useState(false);
  const [search, setSearch] = useState("");

  const updateInput = (input) => {
    setSearch(input);
    setDisplay(false);
  };

  function handleInputChange(event) {
    setDisplay(true);
    setSearch(event.target.value);
  }

  function handleClick(event) {
    setSearch(event.target.innerHTML)
  }

  return (
    <>
      <Form.Group controlId="autocompleteInput">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="search"
          placeholder={placeholder}
          onClick={() => {
            setDisplay(!display);
          }}
          value={search}
          onChange={handleInputChange}
        />
        {display && (
          <div className="autocomplete-suggestions">
            {options
              .filter(
                ({ fullName }) => fullName.toLowerCase().indexOf(search.toLowerCase()) > -1
              )
              .map((option, index) => {
                return (
                  <div onClick={handleClick} key={index}>
                    {option.fullName}
                  </div>
                );
              })}
          </div>
        )}
      </Form.Group>
    </>
  );
}

export default Autocomplete;
