import React, { useRef, useState, useContext } from "react";
import styled from "styled-components";

import { Context } from "../../context";

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
`;

const StyledHeader = styled.div<{ level: number; selected: boolean }>`
  font-size: ${({ level }) =>
    level === 1
      ? "3.5em"
      : level === 2
      ? "3.2em"
      : level === 3
      ? "2.9em"
      : level === 4
      ? "2.6em"
      : level === 5
      ? "2.3em"
      : "2em"};
  border: ${({ selected }) => (selected ? "1px solid red" : "none")};
`;

function Header({ itemId }: { itemId: number }) {
  const editingElement = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState(false);

  const { getItemById, removeElement, changeElementValue } = useContext(
    Context
  );

  const item = getItemById(itemId);

  function editHeading(event: React.FocusEvent<HTMLDivElement>) {
    editingElement.current &&
      editingElement.current.setAttribute("contenteditable", "true");
    setSelected(true);
  }

  function finishEditing(event: React.FocusEvent<HTMLDivElement>) {
    editingElement.current &&
      editingElement.current.setAttribute("contenteditable", "false");
    setSelected(false);

    if (event.target.innerText === "") {
      removeElement(item.id);
    } else {
      changeElementValue(item.id, event.target.innerText);
    }
  }

  function checkMouseDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.code === "Enter") {
      event.preventDefault();
      editingElement.current && editingElement.current.blur();
    }
  }

  function changeHeadingText(event: any) {}

  function remove() {
    removeElement(item.id);
  }

  const Tag = `h${item.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Container>
      <StyledHeader
        as={Tag}
        level={item.level as number}
        selected={selected}
        ref={editingElement}
        onKeyDown={checkMouseDown}
        onInput={changeHeadingText}
        onBlur={finishEditing}
        onFocus={editHeading}
        data-id={item.id}
        tabIndex={-1}
      >
        {item.value}
      </StyledHeader>
      {selected && <StyledButton onMouseDown={remove}>X</StyledButton>}
    </Container>
  );
}

Header.displayName = "Header";

export default Header;
