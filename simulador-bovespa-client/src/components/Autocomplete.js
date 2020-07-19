import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

function Autocomplete(props) {
  const [label] = useState(props.label);
  const [placeholder] = useState(props.placeholder);
  const [inputedId] = useState(props.controlId);
  const [inputedLabelId] = useState(props.labelId)
  const [name] = useState(props.name);
//   const [onUserTyping] = useState(props.onUserTyping)
  const [options, setOptions] = useState(props.options);
  const [display, setDisplay] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState({
    actual: -1,
    past: -1,
  });
  const [optionsQuantity, setOptionsQuantity] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setOptions(props.options);
  }, [props.options]);

  useEffect(() => {
    const allOptions = document.querySelectorAll(
      "div.autocomplete-suggestions > div"
    );
    setOptionsQuantity(allOptions.length);
    if (selectedOptionIndex.actual !== -1) {
      const optionSelected = document.getElementById(
        `option#${selectedOptionIndex.actual}`
      );
      // Tirar a classe "selected" da opção passada, cuidando com o zero
      if (selectedOptionIndex.actual > 0 || selectedOptionIndex.past > 0) {
        const lastOptionSelected = document.getElementById(
          `option#${selectedOptionIndex.past}`
        );

        lastOptionSelected.classList.remove("selected");
      }

      // Adicionando a classe selected da escolha atual do usuário
      optionSelected.classList.add("selected");
    }
  }, [selectedOptionIndex]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    props.onUserTyping({
        target: {
            name,
            value: search
        }
    })
  }, [search])

  function changeSelectedOptionIndex(keyCode) {
    if (
      keyCode === 40 &&
      selectedOptionIndex.actual === optionsQuantity - 1 &&
      selectedOptionIndex.actual !== -1
    ) {
      // Quando o usuário está na última opção de autocompletação
      // E ele aperta pra baixo, vou jogar ele para o primeiro item da lista
      setSelectedOptionIndex({ actual: 0, past: selectedOptionIndex.actual });
    } else if (keyCode === 38 && selectedOptionIndex.actual <= 0) {
      // quando ele está no primeiro item da lista e aperta para cima
      // vou jogar ele para o último item da lista
      setSelectedOptionIndex({
        actual: optionsQuantity - 1,
        past: selectedOptionIndex.actual,
      });
    } else if (keyCode === 38) {
      setSelectedOptionIndex({
        actual: selectedOptionIndex.actual - 1,
        past: selectedOptionIndex.actual,
      });
    } else if (keyCode === 40) {
      setSelectedOptionIndex({
        actual: selectedOptionIndex.actual + 1,
        past: selectedOptionIndex.actual,
      });
    }
  }

  function handleInputChange(event) {
    event.preventDefault();
    setDisplay(true);
    setSearch(event.target.value);
    // Se alguém digitar, vou tirar a marcação de onde o usuário estava na autocompletação
    setSelectedOptionIndex({
      actual: -1,
      past: -1,
    });
    const allOptions = document.querySelectorAll(
      "div.autocomplete-suggestions > div"
    );
    allOptions.forEach((element) => {
      element.classList.remove("selected");
    });

    // console.log(event.target)
    // console.log(event)
    console.log(search)
  }

  function handleClick(event) {
    setSearch(event.target.innerHTML);
    setDisplay(false);
  }

  function handleClickOutside(event) {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
      setSelectedOptionIndex({
        actual: -1,
        past: selectedOptionIndex.actual,
      });
    }
  }

  function handleKeyDown(event) {
    if (event.keyCode === 38 || event.keyCode === 40) {
      // seta pra cima ou pra baixo
      changeSelectedOptionIndex(event.keyCode);
    } else if (event.keyCode === 13) {
      // usuário apertou enter
      const actualSelectedOption = document.getElementById(
        `option#${selectedOptionIndex.actual}`
      );
      setSearch(actualSelectedOption.innerHTML);
      setDisplay(false);
    } else if (event.keyCode === 9) {
      // usuário apertou tab, ir para o próximo input.
      const actualSelectedOption = document.getElementById(
        `option#${selectedOptionIndex.actual}`
      );
      if (actualSelectedOption === null) {
        setDisplay(false);
      } else {
        setSearch(actualSelectedOption.innerHTML);
        setDisplay(false);
      }
    }
  }

  return (
    <>
      <Form.Group
        className="form-group-autocomplete"
        ref={wrapperRef}
        controlId={`${inputedId}`}
      >
        <Form.Label id={inputedLabelId}>{label}</Form.Label>
        <Form.Control
          type="search"
          name={name}
          placeholder={placeholder}
          onClick={() => {
            setDisplay(true);
          }}
          value={search}
          onChange={handleInputChange}
          autoComplete="off"
          onKeyDown={handleKeyDown}
        />
        {display && (
          <div className="autocomplete-suggestions">
            {options
              .filter(
                ({ fullName }) =>
                  fullName.toLowerCase().indexOf(search.toLowerCase()) > -1
              )
              .map((option, index) => {
                if (index < 6) {
                  return (
                    <div
                      onClick={handleClick}
                      key={index}
                      id={`option#${index}`}
                    >
                      {option.fullName}
                    </div>
                  );
                }
              })}
          </div>
        )}
      </Form.Group>
    </>
  );
}

export default Autocomplete;
