import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import styled from "styled-components";
import sanitizeHtml from "sanitize-html";
import { ReactComponent as TrashIcon } from "bootstrap-icons/icons/trash.svg";

import EditableToolbar from "../EditableToolbar";
import { SlidesContext } from "../../../context/slides";
import { Element } from "../../../types";
import { HistoryContext } from "../../../context/history";

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledButton = styled.button`
  padding: 0.5em;
  position: absolute;
  top: -2em;
  right: -2em;
`;

const StyledHeader = styled.div<{ level: number; selected: boolean }>`
  line-height: 120%;
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

  padding: 0.1em;
  border: 2px solid
    ${({ selected }) => (selected ? "#15aabf" : "rgba(0, 0, 0, 0)")}; ;
`;

function Header({
  slideNumber,
  item,
  present,
}: {
  present: boolean;
  slideNumber: number;
  item: Element;
}) {
  const editingElement = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState(false);

  const { addElement, removeElement, changeElementValue } = useContext(
    SlidesContext
  );
  const { addAction } = useContext(HistoryContext);

  function editHeading() {
    editingElement.current &&
      editingElement.current.setAttribute("contenteditable", "true");
  }

  function remove() {
    addAction(
      () => removeElement(slideNumber, item.id),
      () => addElement(slideNumber, item)
    );
  }

  const finishEditing = useCallback(() => {
    if (editingElement.current) {
      editingElement.current.setAttribute("contenteditable", "false");
      setSelected(false);
      if (editingElement.current.innerHTML === "") {
        addAction(
          () => removeElement(slideNumber, item.id),
          () => addElement(slideNumber, item)
        );
      } else if (editingElement.current.innerHTML !== item.value) {
        addAction(
          () =>
            editingElement.current &&
            changeElementValue(
              slideNumber,
              item.id,
              editingElement.current.innerHTML
            ),
          () => changeElementValue(slideNumber, item.id, item.value)
        );
      }
    }
  }, [
    editingElement,
    setSelected,
    removeElement,
    addElement,
    changeElementValue,
    item,
    slideNumber,
    addAction,
  ]);

  function checkMouseDown(event: React.KeyboardEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (event.code === "Enter") {
      event.preventDefault();
      finishEditing();
    }
  }

  const Tag = `h${item.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        selected &&
        editingElement.current &&
        !editingElement.current.contains(event.target)
      ) {
        finishEditing();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingElement, selected, finishEditing]);

  return (
    <Container>
      {selected && <EditableToolbar ref={editingElement} />}
      <StyledHeader
        as={Tag}
        level={item.level as number}
        selected={selected}
        ref={editingElement}
        onKeyDown={checkMouseDown}
        onMouseDown={() => !present && setSelected(true)}
        onDoubleClick={() => !present && editHeading()}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(item.value, {
            allowedTags: ["b", "i", "a"],
            allowedAttributes: { a: ["href"] },
          }),
        }}
      />
      {selected && (
        <StyledButton onMouseDown={remove}>
          <TrashIcon />
        </StyledButton>
      )}
    </Container>
  );
}

Header.displayName = "Header";

export default Header;
