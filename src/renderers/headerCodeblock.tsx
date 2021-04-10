import styled from "styled-components";

import { Builder } from "../types";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .top {
    background-color: ${({ theme }) => theme.primary};
    flex: 1;
    display: flex;

    h1,
    h2,
    h3,
    h4,
    h5 {
      display: flex;
      align-items: flex-end;
      color: white;
    }
  }
  .bottom {
    align-items: center;
    display: flex;
    justify-content: center;
    flex: 2;

    pre {
      display: block;
      width: 100%;
      height: 100%;

      code {
        height: 100%;
      }
    }
  }
`;

export function HeaderCodeblockRenderer({
  children,
}: {
  children: JSX.Element[];
}) {
  const header = children.find((item) => item.type.displayName === "Header");
  const paragraph = children.find(
    (item) => item.type.displayName === "Paragraph"
  );

  if (!header) {
    return <></>;
  }

  return (
    <Container>
      <div className="top">{header}</div>
      <div className="bottom">{paragraph}</div>
    </Container>
  );
}

export const HeaderCodeblockBuilder: Builder = {
  add: (type) => {
    if (type === "paragraph") return "headerManyParagraphs";
    if (type === "image") return "headerManyParagraphsImage";
    return "normal";
  },
  remove: (type) => {
    return "normal";
  },
};
